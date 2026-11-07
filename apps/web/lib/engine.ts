export interface Engine {
  name: string;
  convert: (bytes: Uint8Array, format: string) => Promise<Blob>;
}

const MIME: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

type WasmModule = {
  default?: () => Promise<unknown>;
  convert?: (input: Uint8Array, format: string) => Uint8Array;
  version?: () => string;
};

/**
 * Charge le paquet généré par wasm-pack depuis /wasm (public).
 * webpackIgnore: le fichier est servi tel quel, pas bundlé par Next.
 * Si absent, repli automatique sur le Canvas du navigateur.
 */
let cachedEngine: Engine | null = null;

export async function getEngine(): Promise<Engine> {
  if (cachedEngine) return cachedEngine;

  try {
    // Import découplé du bundler: le fichier est servi tel quel depuis /public/wasm
    // (généré par `npm run wasm:build`). Un new Function évite tout résolution
    // statique par webpack/Turbopack et par TypeScript.
    const dynamicImport = new Function("u", "return import(u)") as (
      u: string,
    ) => Promise<WasmModule>;
    const mod = await dynamicImport("/wasm/core_rust.js");
    if (mod?.default) {
      await mod.default();
    }
    if (typeof mod?.convert === "function") {
      cachedEngine = {
        name: "Rust WASM",
        convert: async (bytes, format) => {
          const result = mod.convert!(bytes, format);
          return new Blob([toBlobPart(result)], { type: MIME[format] });
        },
      };
      return cachedEngine;
    }
  } catch {
    // module WASM non compilé : on utilisera le fallback
  }

  cachedEngine = { name: "Canvas (repli navigateur)", convert: canvasConvert };
  return cachedEngine;
}

async function canvasConvert(bytes: Uint8Array, format: string): Promise<Blob> {
  const mime = MIME[format];
  if (!mime) throw new Error(`Format non supporté: ${format}`);
  const bitmap = await createImageBitmap(new Blob([toBlobPart(bytes)]));
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 });
    if (!blob || blob.type !== mime) {
      throw new Error(`Le navigateur ne peut pas encoder ${mime}`);
    }
    return blob;
  } finally {
    bitmap.close();
  }
}

/** Copie vers un ArrayBuffer explicite (TS 5.7: Uint8Array<ArrayBufferLike>
 * n'est pas directement un BlobPart). */
function toBlobPart(bytes: Uint8Array): ArrayBuffer {
  const plain = new ArrayBuffer(bytes.length);
  new Uint8Array(plain).set(bytes);
  return plain;
}
