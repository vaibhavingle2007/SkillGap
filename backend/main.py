import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes import jobs, analysis, roadmap, resources, dashboard

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title="Skill Gap Analyzer API",
    description="Analyze skill gaps, generate learning roadmaps, and find resources.",
    version="1.0.0",
    # Disable the default docs route so our custom one (serving bundled assets
    # from backend/public/) can take over — see the @app.get("/docs") below.
    docs_url=None,
    redoc_url=None,
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter: max 10 requests per minute per IP
_rate_limit_store = defaultdict(list)
RATE_LIMIT_MAX = 10
RATE_LIMIT_WINDOW = 60  # seconds


def _is_rate_limited(ip: str) -> bool:
    now = time.time()
    _rate_limit_store[ip] = [ts for ts in _rate_limit_store[ip] if now - ts < RATE_LIMIT_WINDOW]
    if len(_rate_limit_store[ip]) >= RATE_LIMIT_MAX:
        return True
    _rate_limit_store[ip].append(now)
    return False


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only limit POST endpoints that trigger expensive backend work
    if request.method == "POST" and request.url.path in ("/analyze-skills", "/analyze-skills/detailed", "/learning-roadmap"):
        client_ip = request.client.host if request.client else "unknown"
        if _is_rate_limited(client_ip):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Max 10 requests per minute."},
            )
    response = await call_next(request)
    return response

app.include_router(jobs.router, tags=["Job Roles"])
app.include_router(analysis.router, tags=["Skill Analysis"])
app.include_router(roadmap.router, tags=["Roadmap"])
app.include_router(resources.router, tags=["YouTube Resources"])
app.include_router(dashboard.router, tags=["Dashboard"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "Skill Gap Analyzer API",
        "docs": "/docs",
        "endpoints": ["/job-roles", "/analyze-skills", "/roadmap", "/youtube-resources", "/dashboard"],
    }


# Serve Swagger UI from locally-bundled assets in backend/public/.
# FastAPI defaults to a jsdelivr CDN URL; we override to use the files
# shipped in the repo so the docs work in restricted networks.
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    from fastapi.openapi.docs import get_swagger_ui_html
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " — Swagger UI",
        swagger_js_url="/swagger-ui-bundle.js",
        swagger_css_url="/swagger-ui.css",
    )
