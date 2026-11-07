// Déclarations pour le paquet généré par wasm-pack (servi depuis /public/wasm,
// présent uniquement après `npm run wasm:build`).
declare module "/wasm/core_rust.js" {
  const init: () => Promise<unknown>;
  const convert: (input: Uint8Array, format: string) => Uint8Array;
  const version: () => string;
  export default init;
  export { convert, version };
}
