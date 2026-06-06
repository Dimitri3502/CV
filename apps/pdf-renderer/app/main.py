import os
from urllib.parse import ParseResult, urlparse, urlunparse

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from weasyprint import HTML


def ensure_cache_dir() -> str:
    cache_dir = os.getenv("WEASYPRINT_CACHE_DIR", "/tmp/weasyprint-cache")
    os.makedirs(cache_dir, exist_ok=True)
    os.environ.setdefault("XDG_CACHE_HOME", cache_dir)
    return cache_dir


CACHE_DIR = ensure_cache_dir()
app = FastAPI(title="CV PDF Renderer")


class RenderPdfRequest(BaseModel):
    url: str


LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0"}


def is_supported_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def resolve_render_url(value: str) -> str:
    parsed = urlparse(value)
    if parsed.hostname not in LOOPBACK_HOSTS:
        return value

    gateway_host = os.getenv("PDF_SOURCE_HOST", "host.docker.internal").strip() or "host.docker.internal"
    netloc = gateway_host
    if parsed.port:
        netloc = f"{gateway_host}:{parsed.port}"

    rewritten = ParseResult(
        scheme=parsed.scheme,
        netloc=netloc,
        path=parsed.path,
        params=parsed.params,
        query=parsed.query,
        fragment=parsed.fragment,
    )
    return urlunparse(rewritten)


@app.get("/health")
def get_health() -> dict[str, str]:
    return {"status": "ok", "cacheDir": CACHE_DIR}


@app.post("/render-pdf")
def render_pdf(payload: RenderPdfRequest) -> Response:
    if not is_supported_url(payload.url):
        raise HTTPException(status_code=400, detail="Body must include a valid http(s) URL")

    try:
        pdf_bytes = HTML(url=resolve_render_url(payload.url)).write_pdf()
    except Exception as error:  # pragma: no cover - renderer failures are environment-dependent
        raise HTTPException(status_code=500, detail=f"Unable to render PDF: {error}") from error

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Cache-Control": "no-store"},
    )
