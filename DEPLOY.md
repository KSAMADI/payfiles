# Déployer PayFiles gratuitement (Cloudflare Pages + Render)

Budget : **0 €**. Le plan gratuit suffit largement pour démarrer.

| Bloc | Hébergeur | Plan gratuit | Ce que ça donne |
|---|---|---|---|
| Site Next.js | Cloudflare Pages | bande passante **illimitée**, déploiements illimités | `https://payfiles.pages.dev` |
| API FastAPI + LibreOffice | Render | conteneur 512 Mo, veille après 15 min | `https://payfiles-api.onrender.com` |

Mécanique : le site appelle `/api/*` (même origine, cookie OK) et Cloudflare **proxy** vers
l'API via `API_URL`. L'utilisateur ne voit que `payfiles.pages.dev`.

---

## Étape 0 — Pousser le code sur GitHub

```bash
git init              # déjà fait si ce repo a été initialisé
git add -A
git commit -m "PayFiles monorepo"
# Créez un repo vide sur github.com puis :
git remote add origin https://github.com/VOTRE-COMPTE/payfiles.git
git push -u origin main
```

## Étape 1 — API sur Render (5 min)

1. [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance** → autorisez GitHub → choisissez le repo.
2. Render lit `render.yaml` tout seul → **Apply**. C'est tout (Dockerfile + LibreOffice inclus).
3. Notez l'URL publique, ex. `https://payfiles-api.onrender.com` — testez `GET /api/health`.

⚠️ Plan gratuit : le service s'endort après ~15 min sans trafic ; la première requête
du réveille en 30-60 s (le dashboard temps réel s'en remet tout seul).

## Étape 2 — Site sur Cloudflare Pages (5 min)

1. [pages.cloudflare.com](https://pages.cloudflare.com) → **Create a project** → **Connect to Git** → le repo.
2. Configuration :
   - **Root directory**: `apps/web`
   - **Build command** : `npx @cloudflare/next-on-pages@latest`
   - **Output** : `.vercel/output/static`
   - **Variables** :
     - `API_URL = https://payfiles-api.onrender.com` (votre URL Render de l'étape 1)
     - `NEXT_PUBLIC_SITE_URL = https://payfiles.pages.dev`
3. **Deploy** → ~3 min de build → votre site est en ligne en HTTPS.

> **Note Windows** : le build exécuté par Cloudflare tourne sur Linux — c'est celui qui
> compte. L'option `npx --legacy-peer-deps` est déjà dans `npm run pages:build` si vous
> voulez tester localement (lent sous Windows, normal). Si un jour le pipeline bloque,
> deux plans B : l'adaptateur officiel [OpenNext Cloudflare](https://opennext.js.org/cloudflare),
> ou Vercel (étape plus bas, zéro config).

## Étape 3 — Activer le vrai domaine dans les URLs SEO

Sur Cloudflare, mettez les variables d'environnement :
- `NEXT_PUBLIC_SITE_URL = https://payfiles.pages.dev` (ou votre domaine custom, qui est **gratuité** avec Pages)

Rebuild final : canonical, sitemap, hreflang et OG images pointent le votre domaine.

## Étape 4 — Passer en production réelle (quand revenus = là)

1. **OTP** : `OTP_DEV_MODE=0` sur Render + brancher Twilio/SMTP dans `otp_request`.
2. **Revenue webhooks** : écrire dans une vraie base + authentifier les signatures.
3. **Search Console** : soumettre `https://VOTRE-DOMAINE/sitemap.xml`.

---

## Alternative (encore plus simple) : Vercel

Si Cloudflare pose un souci avec une page (le pipeline `next-on-pages` évolue),
Vercel est plan B, sans config : [vercel.com/new](https://vercel.com/new) → repo →
Root directory `apps/web` → variables `API_URL`, `NEXT_PUBLIC_SITE_URL` → Deploy.
Plan gratuit : 100 Go/mois de bande passante.

## Lancer les deux en local (rappel)

```bash
npm install
py -3 -m pip install -r apps/api/requirements.txt
npm run dev      # web :3000 + api :8100 — code OTP dev : 123456
```
