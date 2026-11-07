//! Moteur de conversion d'images — compilé en WebAssembly et chargé
//! directement dans le navigateur (les fichiers ne quittent jamais
//! l'ordinateur de l'utilisateur).
//!
//! Build:
//!   rustup target add wasm32-unknown-unknown
//!   cargo install wasm-pack
//!   cargo wbuild  (ou: npm run wasm:build depuis la racine)
//! Sortie consommée par apps/web (dossier public/wasm).

use wasm_bindgen::prelude::*;

/// Convertit un fichier image (PNG/JPEG/GIF/WebP en entrée) vers un format
/// cible. `format` ∈ {"png" | "jpeg" | "webp"}.
#[wasm_bindgen]
pub fn convert(input: Vec<u8>, format: String) -> Result<Vec<u8>, JsValue> {
    let img = image::load_from_memory(&input)
        .map_err(|e| JsValue::from_str(&format!("lecture impossible: {e}")))?;

    let target = match format.as_str() {
        "png" => image::ImageFormat::Png,
        "jpeg" | "jpg" => image::ImageFormat::Jpeg,
        "webp" => image::ImageFormat::WebP,
        other => {
            return Err(JsValue::from_str(&format!("format non supporté: {other}")));
        }
    };

    let mut out = Vec::with_capacity(input.len());
    img.write_to(&mut std::io::Cursor::new(&mut out), target)
        .map_err(|e| JsValue::from_str(&format!("encodage impossible: {e}")))?;

    Ok(out)
}

/// Convertit par lot: un appel pour N fichiers, sans sérialisation JSON
/// côté JS pour chaque fichier.
#[wasm_bindgen]
pub fn version() -> String {
    "core-rust 0.1.0 (wasm)".to_string()
}
