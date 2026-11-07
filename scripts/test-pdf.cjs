/* Test rapide des APIs PDF critiques (@cantoo/pdf-lib) — exécuté en Node. */
const { PDFDocument, StandardFonts, degrees, rgb } = require("@cantoo/pdf-lib");

function fail(msg) { console.error("ÉCHEC:", msg); process.exit(1); }

(async () => {
  // 1. Création d'un PDF simple
  const a = await PDFDocument.create();
  const font = await a.embedFont(StandardFonts.Helvetica);
  a.addPage([595, 842]).drawText("Page A1", { x: 50, y: 500, size: 24, font });
  a.addPage([595, 842]).drawText("Page A2", { x: 50, y: 500, size: 24, font });
  const aBytes = await a.save();

  const b = await PDFDocument.create();
  const font2 = await b.embedFont(StandardFonts.Helvetica);
  b.addPage([595, 842]).drawText("Page B1", { x: 50, y: 500, size: 24, font2 });
  const bBytes = await b.save();

  // 2. Fusion
  const merged = await PDFDocument.create();
  for (const src of [aBytes, bBytes]) {
    const doc = await PDFDocument.load(src, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  if (merged.getPageCount() !== 3) fail(`fusion: 3 pages attendues, ${merged.getPageCount()} obtenues`);
  console.log("OK fusion: 3 pages");

  // 3. Chiffrement AES-256 + déchiffrement
  const protectedDoc = await PDFDocument.load(aBytes, { ignoreEncryption: true });
  protectedDoc.encrypt({ userPassword: "svp123", ownerPassword: "svp123", permissions: { printing: "highResolution" } });
  const protectBytes = await protectedDoc.save({ useObjectStreams: false });
  console.log("OK chiffrement AES-256:", protectBytes.length, "octets");

  const decrypted = await PDFDocument.load(protectBytes, { password: "svp123" });
  console.log("OK déchiffrement avec mot de passe:", decrypted.getPageCount(), "page(s)");

  // 4. Mauveau mot de passe -> doit échouer
  try {
    await PDFDocument.load(protectBytes, { password: "faux" });
    fail("un faux mot de passe a été accepté");
  } catch { console.log("OK rejet du faux mot de passe"); }

  // 5. Rotation
  const rot = await PDFDocument.load(aBytes, { ignoreEncryption: true });
  rot.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + 90) % 360)));
  const rotBytes = await rot.save();
  const back = await PDFDocument.load(rotBytes, { ignoreEncryption: true });
  const angle = back.getPages()[0].getRotation().angle;
  if (angle !== 90) fail(`rotation: 90° attendu, ${angle} obtenu`);
  console.log("OK rotation persistée: 90°");

  // 6. Filigrane diagnostic (API drawText avec rotate)
  const wm = await PDFDocument.load(aBytes, { ignoreEncryption: true });
  const f = await wm.embedFont(StandardFonts.HelveticaBold);
  wm.getPages()[0].drawText("BROUILLON", { x: 100, y: 300, size: 60, font: f, opacity: 0.35, color: rgb(0.55, 0.55, 0.55), rotate: degrees(38) });
  console.log("OK filigrane:", (await wm.save()).length, "octets");

  // 7. Extraction de plage (logique parseRanges)
  const parseRanges = (input, pageCount) => {
    const out = [];
    for (const part of input.split(",")) {
      const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!m) throw new Error(`Plage invalide: ${part}`);
      let x = parseInt(m[1], 10), y = m[2] ? parseInt(m[2], 10) : x;
      if (y < x) [x, y] = [y, x];
      for (let i = x; i <= y; i++) {
        if (i < 1 || i > pageCount) throw new Error(`Hors limites: ${i}`);
        if (!out.includes(i - 1)) out.push(i - 1);
      }
    }
    return out;
  };
  const picked = parseRanges("1-3,5,7-8", 10).join(",");
  if (picked !== "0,1,2,4,6,7") fail(`parseRanges: ${picked}`);
  console.log("OK parseRanges(\"1-3,5,7-8\") ->", picked);

  console.log("\nTOUS LES TESTS PASSENT");
})().catch((e) => fail(e.message));
