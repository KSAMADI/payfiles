# PayFiles — Monorepo Rust + Python + Next.js

Plateforme de conversion de fichiers (gratuite, monétisée) avec:

- **Next.js** (`apps/web`) — frontend SEO + convertisseur + tableau de bord de revenus
- **FastAPI / Python** (`apps/api`) — auth par OTP, revenus temps réel (SSE), prêt pour AdSense/Stripe
- **Rust → WASM** (`packages/core-rust`) — moteur de conversion exécuté **dans le navigateur** (fichiers 100 % locaux)

## Outils disponibles (17)

**100 % dans le navigateur (aucun upload)** : Fusionner / Diviser / Organiser / Tourner /
Compresser / Protéger (AES-256) / Déverrouiller / Filigrane / Numéroter / PDF→JPG /
JPG→PDF / PDF→Word / PDF→Excel / PDF→TXT / Images→PDF (accueil).

**Via le moteur serveur LibreOffice (traité à la volée, supprimé aussitôt)** :
Word→PDF, Excel→PDF, PPT→PDF — nécessite LibreOffice installé sur la machine
(`SOFFICE_PATH` optionnel). Sans LibreOffice, l'outil affiche un message clair.

Chaque outil = une page statique `/outils/[slug]` (usine SEO, données dans
`apps/web/lib/tools.ts`).

## Démarrage rapide

```bash
# 1. Dépendances JS
npm install

# 2. Dépendances Python (API)
py -3 -m pip install -r apps/api/requirements.txt

# 3. Lancer les deux serveurs
npm run dev
# ou séparément:
npm run dev:web   -> http://localhost:3000
npm run dev:api   -> http://127.0.0.1:8100
```

### Connexion OTP (développement)

| Étape | valeur |
|---|---|
| URL | http://localhost:3000/login |
| Code | **`123456`** (code fixe dev, voir `.env.example`) |
| Destination | Tableau de bord revenus temps réel (SSE) |

## Architecture

```
apps/web          Next.js 15 (App Router)
  app/page.tsx            page d'accueil + convertisseur
  app/loginpage           connexion OTP (code 123456 en dev)
  app/dashboardpage       gains temps réel (SSE + cookie de session)
  components/Converter    upload drag&drop, conversion WASM ou Canvas
  lib/engine.ts           chargeur WASM + fallback automatique
  next.config.mjs         proxy /api/* -> FastAPI (same-origin, pas de CORS)

apps/api          FastAPI
  main.py                 auth OTP, sessions HMAC, simulateur de revenus
  /api/earnings/stream    Server-Sent Events (1 s)

packages/core-rust  crate Rust -> wasm-pack -> apps/web/public/wasm
  convert(bytes, format)  PNG/JPEG/GIF -> PNG/JPEG/WebP
```

## Compiler le moteur WASM (optionnel)

Sans compilation, le site fonctionne quand même : le fallback Canvas prend
le relais automatiquement.

```bash
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
npm run wasm:build
# -> apps/web/public/wasm/core_rust.js (chargé à la volée)
```

Attention: `image` n'encode pas AVIF. Pour l'ajouter, utiliser `ravif` +
`rgb` (compatible WASM) côté Rust.

## Passer en production

1. **OTP** : remplacer `OTP_DEV_MODE` par un vrai envoie de code (Twilio / SMTP), hasher le code, limiter les tentatives.
2. **Revenus** : brancher des webhooks AdSense (MCM/AdManager) et Stripe sur un endpoint `POST /api/revenue/webhook` qui insère dans une vraie base.
3. **Sessions** : cookie `Secure` + `SameSite=Lax` derrière HTTPS,en token en base.
4. **Fichiers** : le modèle actuel est 100 % navigateur — aucun stockage. Pour les gros fichiers plus tard: worker Axum + Redis + R2 (suppression auto après le téléchargement).
