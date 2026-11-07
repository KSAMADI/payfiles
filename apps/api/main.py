"""
API FastAPI — Auth par OTP + Revenus temps réel (mode démo).

Endpoints:
  POST /api/auth/otp/request   -> demande un code OTP (dev: 123456)
  POST /api/auth/otp/verify    -> valide le code, pose le cookie de session
  POST /api/auth/logout        -> déconnexion
  GET  /api/me                 -> état de session
  GET  /api/earnings/summary   -> résumé des gains (auth)
  GET  /api/earnings/stream    -> flux SSE temps réel (auth)

En production: brancher un vrai service OTP (Twilio/SMTP) sur otp_request,
et une base persistante à la place de InMemoryStats.
"""

import asyncio
import hashlib
import hmac
import os
import random
import secrets
import shutil
import subprocess
import tempfile
import time
import uuid
from collections import deque
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Cookie, FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response as BytesResponse, StreamingResponse
from pydantic import BaseModel

DEV_SECRET = os.environ.get("DEV_SECRET", "dev-secret-a-changer")
OTP_DEV_CODE = os.environ.get("OTP_DEV_CODE", "123456")
OTP_DEV_MODE = os.environ.get("OTP_DEV_MODE", "1") == "1"
SESSION_TTL = 7 * 24 * 3600  # 7 jours

app = FastAPI(title="pay API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # le front passe par un proxy same-origin, CORS ici permissif
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Session: token HMAC « exp.signature » signé côté serveur
# ---------------------------------------------------------------------------

def make_token() -> str:
    exp = int(time.time()) + SESSION_TTL
    sig = hmac.new(DEV_SECRET.encode(), str(exp).encode(), hashlib.sha256).hexdigest()
    return f"{exp}.{sig}"


def verify_token(token: str | None) -> bool:
    if not token or "." not in token:
        return False
    exp_str, sig = token.split(".", 1)
    expected = hmac.new(DEV_SECRET.encode(), exp_str.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return False
    return int(time.time()) < int(exp_str)


def require_auth(session: str | None) -> None:
    if not verify_token(session):
        raise HTTPException(status_code=401, detail="Non authentifié")


# ---------------------------------------------------------------------------
# Stockage en mémoire (démo) — remplacer par Postgres/Redis en production
# ---------------------------------------------------------------------------

class InMemoryStats:
    """Simulateur de revenus : publicité + commandes premium."""

    SOURCES = {
        # (poids, montants typiques)
        "adsense-demo": (0.80, (0.02, 0.35)),
        "premium-addon": (0.08, (2.0, 6.0)),
        "api-demo": (0.12, (0.10, 1.50)),
    }

    def __init__(self) -> None:
        self.events: deque[dict] = deque(maxlen=5000)
        self._seed()

    def _pick_source(self) -> str:
        sources = list(self.SOURCES.keys())
        weights = [self.SOURCES[s][0] for s in sources]
        return random.choices(sources, weights=weights, k=1)[0]

    def _seed(self) -> None:
        approx = {
            "adsense-demo": (600, 0.02, 0.35),
            "premium-addon": (30, 2.0, 6.0),
            "api-demo": (200, 0.10, 1.50),
        }
        now = time.time()
        for source, (n, lo, hi) in approx.items():
            for _ in range(n):
                self.events.append(
                    {
                        "id": uuid.uuid4().hex,
                        "ts": now - secrets.randbelow(7 * 24 * 3600),
                        "source": source,
                        "amount": round(random.uniform(lo, hi), 2),
                    }
                )
        self.events = deque(sorted(self.events, key=lambda e: e["ts"]), maxlen=5000)

    def tick(self) -> dict:
        source = self._pick_source()
        lo, hi = self.SOURCES[source][1]
        event = {
            "id": uuid.uuid4().hex,
            "ts": time.time(),
            "source": source,
            "amount": round(random.uniform(lo, hi), 2),
        }
        self.events.append(event)
        return event

    def summary(self) -> dict:
        now = time.time()
        midnight = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0).timestamp()
        today = round(
            sum(e["amount"] for e in self.events if e["ts"] >= midnight), 2
        )
        total = round(sum(e["amount"] for e in self.events), 2)
        recent = list(self.events)[-12:][::-1]
        return {
            "today": today,
            "total": total,
            "count": len(self.events),
            "recent": [
                {
                    "id": e["id"],
                    "source": e["source"],
                    "amount": e["amount"],
                    "ts": e["ts"],
                    "label": SOURCE_LABELS_FR.get(e["source"], e["source"]),
                }
                for e in recent
            ],
        }


SOURCE_LABELS_FR = {
    "adsense-demo": "Publicité (AdSense, démo)",
    "premium-addon": "Achat premium",
    "api-demo": "API (appels payants)",
}

stats = InMemoryStats()


@app.on_event("startup")
async def start_simulator() -> None:
    """Boucle d'arrière-plan : un « revenu » entrant toutes les 0.8 à 3 s."""

    async def simulator() -> None:
        while True:
            stats.tick()
            await asyncio.sleep(random.uniform(0.8, 3.0))

    asyncio.create_task(simulator())


# ---------------------------------------------------------------------------
# Modèles
# ---------------------------------------------------------------------------

class OtpRequest(BaseModel):
    channel: str = ""  # email ou téléphone — démo


class OtpVerify(BaseModel):
    code: str
    channel: str = ""


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/api/auth/otp/request")
async def otp_request(payload: OtpRequest) -> dict:
    # Production: générer un code aléatoire, l'envoyer par SMS/email via un
    # fournisseur, l'hasher côté serveur et limiter le nombre de tentatives.
    if OTP_DEV_MODE:
        return {"ok": True, "dev_code": OTP_DEV_CODE, "note": "Mode développement : code fixe 123456"}
    return {"ok": True, "note": "Code envoyé."}


@app.post("/api/auth/otp/verify")
async def otp_verify(payload: OtpVerify, response: Response) -> dict:
    if payload.code.strip() != OTP_DEV_CODE:
        raise HTTPException(status_code=403, detail="Code incorrect")

    token = make_token()
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_TTL,
        path="/",
    )
    return {"ok": True, "channel": payload.channel}


@app.post("/api/auth/logout")
async def logout(response: Response) -> dict:
    response.delete_cookie("session", path="/")
    return {"ok": True}


@app.get("/api/me")
async def me(session: str | None = Cookie(default=None)) -> dict:
    if not verify_token(session):
        raise HTTPException(status_code=401, detail="Non authentifié")
    return {"ok": True, "user": {"name": "Compte démo", "plan": "free"}}


# ---------------------------------------------------------------------------
# Revenus
# ---------------------------------------------------------------------------

@app.get("/api/earnings/summary")
async def earnings_summary(session: str | None = Cookie(default=None)) -> dict:
    require_auth(session)
    return stats.summary()


@app.get("/api/earnings/stream")
async def earnings_stream(session: str | None = Cookie(default=None)):
    require_auth(session)
    return StreamingResponse(
        _stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def _stream():
    while True:
        payload = stats.summary()
        yield f"data: {payload}\n\n".encode("utf-8")
        await asyncio.sleep(1.0)


# Point de santé pour le proxy Next.js
@app.get("/api/health")
async def health() -> dict:
    return {"ok": True, "time": datetime.now(timezone.utc).isoformat()}


# ---------------------------------------------------------------------------
# Conversions Office -> PDF (moteur LibreOffice en mode headless)
# Fichier traité À LA VOLÉE dans un dossier temporaire : supprimé immédiatement.
# ---------------------------------------------------------------------------

SOFFICE_CANDIDATES = [
    os.environ.get("SOFFICE_PATH", ""),
    shutil.which("soffice") or "",
    r"C:\Program Files\LibreOffice\program\soffice.exe",
    r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    "/usr/bin/soffice",
    "/usr/local/bin/soffice",
    "/opt/libreoffice/program/soffice",
]


def find_soffice() -> str | None:
    for candidate in SOFFICE_CANDIDATES:
        if candidate and Path(candidate).is_file():
            return candidate
    return None


CONVERTIBLE_SUFFIXES = {".doc", ".docx", ".odt", ".rtf", ".xls", ".xlsx", ".csv", ".ods", ".ppt", ".pptx", ".odp"}


@app.post("/api/office/convert")
async def office_convert(file: UploadFile = File(...)) -> Response:
    soffice = find_soffice()
    if not soffice:
        raise HTTPException(
            status_code=503,
            detail=(
                "Moteur Office non disponible côté serveur : installez LibreOffice "
                "(puis définissez SOFFICE_PATH si nécessaire) pour activer Word/Excel/PPT -> PDF."
            ),
        )

    name = file.filename or "document"
    suffix = Path(name).suffix.lower()
    if suffix not in CONVERTIBLE_SUFFIXES:
        raise HTTPException(status_code=422, detail=f"Format non convertible : {suffix or 'inconnu'}")

    with tempfile.TemporaryDirectory(prefix="pay-office-") as tmp:
        src = Path(tmp) / f"source{suffix}"
        src.write_bytes(await file.read())

        try:
            proc = await asyncio.wait_for(
                asyncio.create_subprocess_exec(
                    soffice, "--headless", "--norestore", "--convert-to", "pdf",
                    "--outdir", tmp, str(src),
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL,
                ),
                timeout=120,
            )
            await asyncio.wait_for(proc.wait(), timeout=120)
        except asyncio.TimeoutError:
            raise HTTPException(status_code=504, detail="Conversion trop longue (délai dépassé)")
        except OSError as exc:
            raise HTTPException(status_code=500, detail=f"LibreOffice indisponible : {exc}")

        produced = src.with_suffix(".pdf")
        if not produced.is_file():
            raise HTTPException(status_code=422, detail="Conversion impossible (document corrompu ?)")

        pdf_bytes = produced.read_bytes()
        # TempDirectory sort du `with` : source + sortie sont effacées ici.

    return BytesResponse(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"X-Filename": f"{Path(name).stem}.pdf"},
    )
