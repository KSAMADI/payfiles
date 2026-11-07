# API FastAPI — image de production (Render/Fly/…)
# Inclut LibreOffice pour activer Word/Excel/PPT -> PDF dans le plan gratuit.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEV_SECRET=changez-moi-en-production \
    OTP_DEV_CODE=123456 \
    OTP_DEV_MODE=1

# LibreOffice headless (writer + calc + impress) sans les extras lourds
RUN apt-get update && apt-get install -y --no-install-recommends \
        libreoffice-core libreoffice-writer libreoffice-calc libreoffice-impress \
        fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .

EXPOSE 8000
# Render (et la plupart des hébergeurs) injectent PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
