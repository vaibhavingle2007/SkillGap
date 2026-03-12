from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes import jobs, analysis, roadmap, resources, dashboard

app = FastAPI(
    title="Skill Gap Analyzer API",
    description="Analyze skill gaps, generate learning roadmaps, and find resources.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, tags=["Job Roles"])
app.include_router(analysis.router, tags=["Skill Analysis"])
app.include_router(roadmap.router, tags=["Roadmap"])
app.include_router(resources.router, tags=["YouTube Resources"])
app.include_router(dashboard.router, tags=["Dashboard"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )


@app.get("/")
def root():
    return {
        "message": "Skill Gap Analyzer API",
        "docs": "/docs",
        "endpoints": ["/job-roles", "/analyze-skills", "/roadmap", "/youtube-resources", "/dashboard"],
    }
