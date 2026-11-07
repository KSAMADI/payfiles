/**
 * Moteur PDF 100 % navigateur, construit sur @cantoo/pdf-lib (fork de pdf-lib
 * avec chiffrement/déchiffrement AES) et pdf.js (rendu pour compression /
 * export image). Aucun octet ne quitte la machine de l'utilisateur.
 */

import { PDFDocument, StandardFonts, degrees, rgb } from "@cantoo/pdf-lib";
import { zipSync } from "fflate";
import type { ToolDef } from "@/lib/tools";
import { parseRanges } from "@/lib/tools";

export interface ToolResult {
  filename: string;
  blob: Blob;
  note?: string;
}

async function bytesOf(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

async function loadPdf(input: File | ArrayBuffer, password?: string) {
  const data = input instanceof ArrayBuffer ? input : await bytesOf(input);
  return password !== undefined
    ? PDFDocument.load(data, { password })
    : PDFDocument.load(data, { ignoreEncryption: true });
}

function pdfResult(bytes: Uint8Array | ArrayBuffer, filename: string, note?: string): ToolResult {
  return { filename, blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), note };
}

function zipResult(entries: Record<string, Uint8Array>, filename: string): ToolResult {
  const zipped = zipSync(entries, { level: 6 });
  return { filename, blob: new Blob([new Uint8Array(zipped)], { type: "application/zip" }) };
}

// ---------------------------------------------------------------------------
// pdf.js — chargé en différé, worker servi depuis /public/pdfjs
// ---------------------------------------------------------------------------

interface PdfJsPage {
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
}
interface PdfJsDoc {
  numPages: number;
  getPage: (i: number) => Promise<PdfJsPage>;
}
interface PdfJsModule {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (opts: { data: ArrayBuffer; password?: string }) => { promise: Promise<PdfJsDoc> };
}

let pdfjsPromise: Promise<PdfJsModule> | null = null;

async function requirePdfjs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = (import("pdfjs-dist") as Promise<unknown>).then((mod) => {
      const m = mod as PdfJsModule;
      m.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return m;
    });
  }
  return pdfjsPromise;
}

/** Rend chaque page en JPEG via pdf.js + canvas. */
async function renderEachPageToJpeg(
  source: File | ArrayBuffer,
  scale: number,
  jpegQuality: number,
  password?: string,
): Promise<Blob[]> {
  const pdfjs = await requirePdfjs();
  const data = source instanceof ArrayBuffer ? source : await bytesOf(source);
  const params: { data: ArrayBuffer; password?: string } = { data };
  if (password) params.password = password;
  const doc = await pdfjs.getDocument(params).promise;

  const blobs: Blob[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", jpegQuality),
    );
    if (!blob) throw new Error(`Rendu de la page ${i} impossible`);
    blobs.push(blob);
  }
  return blobs;
}

// ---------------------------------------------------------------------------
// Dispatcheur par outil
// ---------------------------------------------------------------------------

export async function runTool(
  tool: ToolDef,
  files: File[],
  options: Record<string, string>,
): Promise<ToolResult> {
  if (files.length === 0) throw new Error("Sélectionnez au moins un fichier");

  switch (tool.slug) {
    case "fusionner-pdf":
      return mergePdfs(files);
    case "diviser-pdf":
      return splitPdf(files[0], options.mode ?? "extraire", options.ranges ?? "");
    case "organiser-pdf":
      return organizePdf(files[0], options.mode ?? "supprimer", options.ranges ?? "");
    case "tourner-pdf":
      return rotatePdf(files[0], parseInt(options.rotation ?? "90", 10), options.pages ?? "");
    case "compresser-pdf":
      return compressPdf(files[0], options.quality ?? "moyen");
    case "proteger-pdf":
      return protectPdf(files[0], options.password ?? "");
    case "deverrouiller-pdf":
      return unlockPdf(files[0], options.password ?? "");
    case "filigrane-pdf":
      return watermarkPdf(files[0], options.text || "BROUILLON", parseInt(options.opacity ?? "35", 10) / 100);
    case "numeroter-pdf":
      return addPageNumbers(files[0], options.position ?? "bas-centre", parseInt(options.start ?? "1", 10) || 1);
    case "pdf-vers-jpg":
      return pdfToJpg(files[0], parseInt(options.dpi ?? "150", 10) / 72);
    case "jpg-vers-pdf":
      return imagesToPdf(files);
    case "pdf-vers-txt":
      return pdfToTxt(files[0]);
    case "pdf-vers-word":
      return pdfToDocx(files[0]);
    case "pdf-vers-excel":
      return pdfToXlsx(files[0]);
    case "word-vers-pdf":
    case "excel-vers-pdf":
    case "ppt-vers-pdf":
      throw new Error("__SERVER_WORKER__"); // traité par le runner (upload serveur)
    default:
      throw new Error(`Outil inconnu : ${tool.slug}`);
  }
}

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------

async function mergePdfs(files: File[]): Promise<ToolResult> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await loadPdf(file);
    const copied = await out.copyPages(src, src.getPageIndices());
    copied.forEach((page) => out.addPage(page));
  }
  return pdfResult(await out.save({ useObjectStreams: true }), "fusion.pdf");
}

async function splitPdf(file: File, mode: string, ranges: string): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const count = doc.getPageCount();

  if (mode === "tout") {
    const entries: Record<string, Uint8Array> = {};
    for (let i = 0; i < count; i++) {
      const one = await PDFDocument.create();
      const [page] = await one.copyPages(doc, [i]);
      one.addPage(page);
      entries[`page-${String(i + 1).padStart(3, "0")}.pdf`] = await one.save();
    }
    return zipResult(entries, `${count}-pages-pdf.zip`);
  }

  if (!ranges.trim()) throw new Error("Indiquez les pages à extraire (ex. 1-3,5)");
  const picked = parseRanges(ranges, count);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(doc, picked);
  copied.forEach((page) => out.addPage(page));
  return pdfResult(await out.save(), `extraction-${ranges.replace(/[,\s]+/g, "-")}.pdf`);
}

async function organizePdf(file: File, mode: string, ranges: string): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const count = doc.getPageCount();

  if (mode === "inverser") {
    const indices = Array.from({ length: count }, (_, i) => count - 1 - i);
    const out = await PDFDocument.create();
    const copied = await out.copyPages(doc, indices);
    copied.forEach((page) => out.addPage(page));
    return pdfResult(await out.save(), "inverse.pdf");
  }

  if (!ranges.trim()) throw new Error("Indiquez les pages (ex. 2,7)");
  const target = parseRanges(ranges, count);
  const keep =
    mode === "garder"
      ? target
      : Array.from({ length: count }, (_, i) => i).filter((i) => !target.includes(i));

  if (keep.length === 0) throw new Error("La sélection laisse un document vide");
  const out = await PDFDocument.create();
  const copied = await out.copyPages(doc, keep);
  copied.forEach((page) => out.addPage(page));
  const label = mode === "garder" ? "garde" : "sans";
  return pdfResult(await out.save(), `organise-${ranges.replace(/[,\s]+/g, "-")}-${label}.pdf`);
}

async function rotatePdf(file: File, delta: number, pagesStr: string): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const count = doc.getPageCount();
  const targets = pagesStr.trim() ? parseRanges(pagesStr, count) : Array.from({ length: count }, (_, i) => i);
  const pages = doc.getPages();
  targets.forEach((idx) => {
    const page = pages[idx];
    page.setRotation(degrees((page.getRotation().angle + delta) % 360));
  });
  return pdfResult(await doc.save(), "tourne.pdf");
}

async function compressPdf(file: File, level: string): Promise<ToolResult> {
  const presets: Record<string, { scale: number; q: number }> = {
    fort: { scale: 1.0, q: 0.45 },
    moyen: { scale: 1.7, q: 0.65 },
    leger: { scale: 2.5, q: 0.85 },
  };
  const preset = presets[level] ?? presets["moyen"]!;

  const blobs = await renderEachPageToJpeg(file, preset.scale, preset.q);
  const out = await PDFDocument.create();
  for (const blob of blobs) {
    const image = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const page = out.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const saved = await out.save({ useObjectStreams: true });
  const ratio = Math.round((saved.length / file.size) * 100);
  return pdfResult(saved, "compresse.pdf", `Taille finale : ${ratio} % de l'original`);
}

async function protectPdf(file: File, password: string): Promise<ToolResult> {
  if (!password) throw new Error("Choisissez un mot de passe");
  const doc = await loadPdf(file);
  doc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: { printing: "highResolution", modifying: false, copying: false },
  });
  return pdfResult(await doc.save({ useObjectStreams: false }), "protege.pdf");
}

async function unlockPdf(file: File, password: string): Promise<ToolResult> {
  if (!password) throw new Error("Saisissez le mot de passe actuel du PDF");
  let doc: PDFDocument;
  try {
    doc = await loadPdf(file, password);
  } catch {
    throw new Error("Mot de passe incorrect, ou chiffrement non supporté");
  }
  return pdfResult(await doc.save({ useObjectStreams: true }), "deverrouille.pdf");
}

async function watermarkPdf(file: File, text: string, opacity: number): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = Math.max(42, Math.min(110, 90 - text.length * 3));
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - size / 2,
      size,
      font,
      color: rgb(0.55, 0.55, 0.55),
      opacity,
      rotate: degrees(38),
    });
  }
  return pdfResult(await doc.save(), "filigrane.pdf");
}

async function addPageNumbers(file: File, position: string, start: number): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = 11;
  const margin = 24;
  doc.getPages().forEach((page, idx) => {
    const { width, height } = page.getSize();
    const label = String(start + idx);
    const textWidth = font.widthOfTextAtSize(label, size);
    const x = /droite/.test(position) ? width - margin - textWidth : (width - textWidth) / 2;
    const y = position.startsWith("bas") ? margin : height - margin - size;
    page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
  });
  return pdfResult(await doc.save(), "numerote.pdf");
}

async function pdfToJpg(file: File, scale: number): Promise<ToolResult> {
  const blobs = await renderEachPageToJpeg(file, scale, 0.85);
  const entries: Record<string, Uint8Array> = {};
  let i = 1;
  for (const blob of blobs) {
    entries[`page-${String(i++).padStart(3, "0")}.jpg`] = new Uint8Array(await blob.arrayBuffer());
  }
  return zipResult(entries, `${i - 1}-pages-pdf.zip`);
}

async function imagesToPdf(files: File[]): Promise<ToolResult> {
  const out = await PDFDocument.create();
  let added = 0;
  for (const file of files) {
    const bytes = await bytesOf(file);
    try {
      const image =
        file.type === "image/png"
          ? await out.embedPng(bytes)
          : await out.embedJpg(new Uint8Array(bytes));
      const page = out.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      added++;
    } catch {
      throw new Error(`Image non supportée : ${file.name} (utilisez PNG ou JPG)`);
    }
  }
  if (added === 0) throw new Error("Aucune image exploitable");
  return pdfResult(await out.save({ useObjectStreams: true }), "images.pdf");
}

// ---------------------------------------------------------------------------
// Extraction texte (pdf.js) -> Word / Excel / TXT
// ---------------------------------------------------------------------------

interface TextItemLike {
  str: string;
  transform: number[]; // [a, b, c, d, e, f] — e = x, f = y
  hasEOL?: boolean;
}
interface TextPage {
  numPages: number;
  getPage: (i: number) => Promise<PdfJsPage & {
    getTextContent: () => Promise<{ items: (TextItemLike | { type: string })[] }>;
  }>;
}

/** Reconstruit les lignes d'un PDF : par page, du haut vers le bas. */
async function extractLines(source: File | ArrayBuffer, password?: string): Promise<string[][]> {
  const pdfjs = await requirePdfjs();
  const data = source instanceof ArrayBuffer ? source : await bytesOf(source);
  const params: { data: ArrayBuffer; password?: string } = { data };
  if (password) params.password = password;
  const doc = (await pdfjs.getDocument(params).promise) as unknown as TextPage;

  const pages: string[][] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    type Item = { str: string; x: number; y: number };
    const items: Item[] = [];
    for (const raw of content.items) {
      if (!("str" in raw)) continue; // items de marquage
      const t = (raw as TextItemLike).transform;
      items.push({ str: (raw as TextItemLike).str, x: t[4], y: t[5] });
    }

    // regroupement par ligne (tolérance sur l'ordonnée)
    const buckets = new Map<number, Item[]>();
    for (const it of items) {
      const key = Math.round(it.y / 3) * 3;
      const list = buckets.get(key);
      if (list) list.push(it);
      else buckets.set(key, [it]);
    }
    const lineKeys = [...buckets.keys()].sort((a, b) => b - a);
    const lines: string[] = [];
    for (const key of lineKeys) {
      const parts = (buckets.get(key) ?? []).sort((a, b) => a.x - b.x);
      let line = "";
      let prev: Item | null = null;
      for (const p of parts) {
        if (prev) {
          const gap = p.x - (prev.x + prev.str.length * 4);
          if (gap > 12) line += "  "; // colonne détectée
        }
        line += p.str;
        prev = p;
      }
      line = line.trim();
      if (line) lines.push(line);
    }
    pages.push(lines);
  }
  return pages;
}

async function pdfToTxt(file: File): Promise<ToolResult> {
  const pages = await extractLines(file);
  const text = pages.map((l) => l.join("\n")).join("\n\n");
  return {
    filename: "extrait.txt",
    blob: new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }),
    note: `${pages.reduce((n, p) => n + p.length, 0)} lignes extraites`,
  };
}

async function pdfToDocx(file: File): Promise<ToolResult> {
  const pages = await extractLines(file);
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const children = pages.flatMap((lines, idx) => [
    ...(idx > 0
      ? [new Paragraph({ children: [new TextRun("")] })]
      : []),
    ...lines.map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 },
        }),
    ),
  ]);

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return {
    filename: "document.docx",
    blob,
    note: "Document reconstruit paragraphe par paragraphe (PDF textuel).",
  };
}

async function pdfToXlsx(file: File): Promise<ToolResult> {
  const pages = await extractLines(file);
  const XLSX = await import("xlsx");

  const aoa: string[][] = [];
  for (const lines of pages) {
    for (const line of lines) {
      // sépare les colonnes détectées (double espace) ou replie les gros espaces
      const cells = line.includes("  ")
        ? line.split(/\s{2,}/).map((c) => c.trim())
        : [line];
      aoa.push(cells);
    }
    aoa.push([]); // séparation entrepages
  }
  if (aoa.length === 0) throw new Error("Aucun texte exploitable trouvé (PDF image ?)");
  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Extraction");
  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return {
    filename: "extraction.xlsx",
    blob: new Blob([new Uint8Array(out)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    note: "Colonnes déduites des espacements horizontaux. Vérifiez l'alignement.",
  };
}
