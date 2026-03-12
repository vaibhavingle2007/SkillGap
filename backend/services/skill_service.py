import json
from pathlib import Path
from fastapi import HTTPException

from urllib.parse import quote_plus

from models.schemas import (
    JobRole,
    Skill,
    SkillAnalysisRequest,
    SkillAnalysisResponse,
    SkillGap,
    SkillGapDetectionRequest,
    SkillGapDetectionResponse,
    DashboardResponse,
    RoadmapResponse,
    SkillRoadmap,
    RoadmapStep,
    YouTubeLink,
    YouTubeSkillResource,
)

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "jobs.json"

PROFICIENCY_LEVELS = {"beginner": 1, "intermediate": 2, "advanced": 3}


def _load_data() -> dict:
    with open(DATA_PATH, "r") as f:
        return json.load(f)


def get_all_job_roles() -> list[JobRole]:
    data = _load_data()
    return [JobRole(**role) for role in data["job_roles"]]


def _normalize(s: str) -> str:
    """Normalize a string for fuzzy matching: lowercase, strip, collapse hyphens/spaces."""
    return s.lower().strip().replace("-", " ").replace("_", " ")


def get_job_role(role_id: str) -> JobRole:
    """Look up a job role by ID or by title (fuzzy: ignores case, hyphens, underscores)."""
    data = _load_data()
    for role in data["job_roles"]:
        if role["id"] == role_id:
            return JobRole(**role)
    # Fallback: try matching by title (normalized)
    needle = _normalize(role_id)
    for role in data["job_roles"]:
        if _normalize(role["title"]) == needle:
            return JobRole(**role)
    raise HTTPException(status_code=404, detail=f"Job role '{role_id}' not found")


def detect_skill_gaps(request: SkillGapDetectionRequest) -> SkillGapDetectionResponse:
    role = get_job_role(request.target_role)
    student_skills_lower = {s.lower() for s in request.student_skills}
    required_skill_names = [s.name for s in role.required_skills]

    matched: list[str] = []
    missing: list[str] = []

    for skill_name in required_skill_names:
        if skill_name.lower() in student_skills_lower:
            matched.append(skill_name)
        else:
            missing.append(skill_name)

    total = len(required_skill_names)
    score = round((len(matched) / total * 100) if total > 0 else 0, 1)

    return SkillGapDetectionResponse(
        missing_skills=missing,
        matched_skills=matched,
        skill_gap_score=score,
    )


def analyze_skills(request: SkillAnalysisRequest) -> SkillAnalysisResponse:
    role = get_job_role(request.target_role_id)
    user_skill_map: dict[str, str] = {
        s.name.lower(): s.proficiency for s in request.user_skills
    }

    skill_gaps: list[SkillGap] = []
    met_skills: list[SkillGap] = []

    for required in role.required_skills:
        req_name_lower = required.name.lower()
        current = user_skill_map.get(req_name_lower)

        if current is None:
            skill_gaps.append(
                SkillGap(
                    skill_name=required.name,
                    required_proficiency=required.proficiency,
                    current_proficiency=None,
                    gap_level="missing",
                )
            )
        elif PROFICIENCY_LEVELS.get(current, 0) < PROFICIENCY_LEVELS.get(
            required.proficiency, 0
        ):
            skill_gaps.append(
                SkillGap(
                    skill_name=required.name,
                    required_proficiency=required.proficiency,
                    current_proficiency=current,
                    gap_level="needs_improvement",
                )
            )
        else:
            met_skills.append(
                SkillGap(
                    skill_name=required.name,
                    required_proficiency=required.proficiency,
                    current_proficiency=current,
                    gap_level="met",
                )
            )

    total = len(role.required_skills)
    match_pct = (len(met_skills) / total * 100) if total > 0 else 0

    return SkillAnalysisResponse(
        target_role=role.title,
        match_percentage=round(match_pct, 1),
        skill_gaps=skill_gaps,
        met_skills=met_skills,
    )


def generate_roadmap(
    role_id: str, user_skills: list[Skill] | None = None
) -> RoadmapResponse:
    if user_skills is None:
        user_skills = []

    request = SkillAnalysisRequest(user_skills=user_skills, target_role_id=role_id)
    analysis = analyze_skills(request)
    data = _load_data()
    templates = data["roadmap_templates"]

    skill_roadmaps: list[SkillRoadmap] = []
    total_weeks = 0

    for gap in analysis.skill_gaps:
        if gap.gap_level == "missing":
            target = gap.required_proficiency
        else:
            target = gap.required_proficiency

        template = templates.get(target, templates["intermediate"])
        duration = template["duration_weeks"]
        if gap.gap_level == "needs_improvement":
            duration = max(4, duration // 2)

        steps = [
            RoadmapStep(step_number=i + 1, description=desc)
            for i, desc in enumerate(template["steps"])
        ]

        skill_roadmaps.append(
            SkillRoadmap(
                skill_name=gap.skill_name,
                current_level=gap.current_proficiency,
                target_level=target,
                duration_weeks=duration,
                steps=steps,
            )
        )
        total_weeks = max(total_weeks, duration)

    return RoadmapResponse(
        target_role=analysis.target_role,
        total_duration_weeks=total_weeks,
        skill_roadmaps=skill_roadmaps,
    )


def get_youtube_resources(skills: list[str]) -> list[YouTubeSkillResource]:
    data = _load_data()
    yt_data = data.get("youtube_resources", {})
    results: list[YouTubeSkillResource] = []

    for skill in skills:
        resources_raw = yt_data.get(skill, [])
        if resources_raw:
            links = [
                YouTubeLink(title=r["title"], url=r["url"])
                for r in resources_raw
            ]
        else:
            search_url = f"https://www.youtube.com/results?search_query={quote_plus(skill + ' tutorial')}"
            links = [
                YouTubeLink(title=f"Search: {skill} tutorial", url=search_url)
            ]
        results.append(YouTubeSkillResource(skill=skill, youtube_links=links))

    return results


# --- Dashboard: aggregates gap analysis + roadmap summary in one call ---
# Scalability: This endpoint reads from a JSON file. For production, swap
# _load_data() with a DB query (PostgreSQL/Redis cache) to handle concurrent
# users. The roadmap_summary here uses static templates for speed; the full
# AI-powered roadmap is available via GET /roadmap.

def get_dashboard(
    student_skills: list[str], target_role: str
) -> DashboardResponse:
    # Step 1: Detect skill gaps
    gap_request = SkillGapDetectionRequest(
        student_skills=student_skills, target_role=target_role
    )
    gap_result = detect_skill_gaps(gap_request)

    # Step 2: Build a quick roadmap summary from static templates
    data = _load_data()
    templates = data["roadmap_templates"]
    role = get_job_role(target_role)

    # Map required skills to their proficiency levels
    required_map = {s.name: s.proficiency for s in role.required_skills}

    roadmap_summary: list[str] = []
    for skill in gap_result.missing_skills:
        level = required_map.get(skill, "intermediate")
        duration = templates.get(level, templates["intermediate"])["duration_weeks"]
        roadmap_summary.append(f"Learn {skill} - ~{duration} weeks ({level} level)")

    return DashboardResponse(
        skill_gap_score=gap_result.skill_gap_score,
        matched_skills=gap_result.matched_skills,
        missing_skills=gap_result.missing_skills,
        roadmap_summary=roadmap_summary,
    )
