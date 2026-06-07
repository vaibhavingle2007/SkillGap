import json
from pathlib import Path
from typing import Dict, List, Optional
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
YOUTUBE_LINKS_PATH = Path(__file__).resolve().parent.parent / "data" / "youtube_links.json"
ROADMAPS_PATH = Path(__file__).resolve().parent.parent / "data" / "roadmaps.json"

PROFICIENCY_LEVELS = {"beginner": 1, "intermediate": 2, "advanced": 3}


def _load_data() -> dict:
    with open(DATA_PATH, "r") as f:
        return json.load(f)


def _load_youtube_links() -> dict:
    """Load YouTube links from the separate JSON file."""
    if YOUTUBE_LINKS_PATH.exists():
        with open(YOUTUBE_LINKS_PATH, "r") as f:
            return json.load(f)
    return {}


def _load_roadmaps() -> dict:
    """Load static skill roadmaps from roadmaps.json."""
    if ROADMAPS_PATH.exists():
        with open(ROADMAPS_PATH, "r") as f:
            return json.load(f)
    return {"roadmaps": {}}


def get_all_job_roles() -> List[JobRole]:
    data = _load_data()
    return [JobRole(**role) for role in data["job_roles"]]


def _normalize(s: str) -> str:
    """Normalize a string for fuzzy matching: lowercase, strip, collapse hyphens/spaces."""
    return s.lower().strip().replace("-", " ").replace("_", " ")


def _contains_words(normalized_input: str, normalized_title: str) -> bool:
    """Check if all words in input are found in title (partial match)."""
    input_words = set(normalized_input.split())
    title_words = set(normalized_title.split())
    # Check if key words match (developer/engineer are interchangeable)
    mapped_input = {
        w.replace("engineer", "developer").replace("programmer", "developer")
        for w in input_words
    }
    mapped_title = {
        w.replace("engineer", "developer").replace("programmer", "developer")
        for w in title_words
    }
    return mapped_input.issubset(mapped_title) or normalized_input in normalized_title


def get_job_role(role_id: str) -> JobRole:
    """Look up a job role by ID or by title (fuzzy: ignores case, hyphens, underscores)."""
    data = _load_data()
    needle = _normalize(role_id)

    for role in data["job_roles"]:
        # Direct ID match
        if role["id"] == role_id:
            return JobRole(**role)
        # Exact normalized title match
        if _normalize(role["title"]) == needle:
            return JobRole(**role)
        # Partial/fuzzy match: "Frontend Engineer" matches "Frontend Developer"
        if _contains_words(needle, _normalize(role["title"])):
            return JobRole(**role)

    raise HTTPException(status_code=404, detail=f"Job role '{role_id}' not found")


def detect_skill_gaps(request: SkillGapDetectionRequest) -> SkillGapDetectionResponse:
    role = get_job_role(request.target_role)
    student_skills_lower = {s.lower() for s in request.student_skills}
    required_skill_names = [s.name for s in role.required_skills]

    matched: List[str] = []
    missing: List[str] = []

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
    user_skill_map: Dict[str, str] = {
        s.name.lower(): s.proficiency for s in request.user_skills
    }

    skill_gaps: List[SkillGap] = []
    met_skills: List[SkillGap] = []

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
    role_id: str, user_skills: Optional[List[Skill]] = None
) -> RoadmapResponse:
    if user_skills is None:
        user_skills = []

    request = SkillAnalysisRequest(user_skills=user_skills, target_role_id=role_id)
    analysis = analyze_skills(request)
    data = _load_data()
    templates = data["roadmap_templates"]

    skill_roadmaps: List[SkillRoadmap] = []
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


def get_youtube_resources(skills: List[str]) -> List[YouTubeSkillResource]:
    """Get YouTube resources from the separate youtube_links.json file."""
    yt_data = _load_youtube_links()
    results: List[YouTubeSkillResource] = []

    for skill in skills:
        resources_raw = yt_data.get(skill, [])
        if resources_raw:
            links = [
                YouTubeLink(title=r["title"], url=r["url"])
                for r in resources_raw
            ]
        else:
            # Fallback to YouTube search if no links found
            search_url = f"https://www.youtube.com/results?search_query={quote_plus(skill + ' tutorial')}"
            links = [
                YouTubeLink(title=f"Search: {skill} tutorial", url=search_url)
            ]
        results.append(YouTubeSkillResource(skill=skill, youtube_links=links))

    return results


def get_static_roadmap(missing_skills: List[str]) -> dict:
    """Return a roadmap from curated static JSON data in roadmaps.json.

    Replaces the legacy AI-powered generation (ai_service.generate_ai_roadmap).
    Preserves the same output shape: {"roadmap": [AIRoadmapSkill]}.
    """
    data = _load_roadmaps()
    all_roadmaps = data.get("roadmaps", {})
    roadmap: List[dict] = []

    for skill_name in missing_skills:
        entry = all_roadmaps.get(skill_name)
        if entry:
            roadmap.append({
                "skill": entry["skill"],
                "learning_steps": entry["learning_steps"],
                "estimated_time": entry["estimated_time"],
                "youtube_videos": [],
            })

    return {"roadmap": roadmap}


# --- Dashboard: aggregates gap analysis + roadmap summary in one call ---
# Scalability: This endpoint reads from a JSON file. For production, swap
# _load_data() with a DB query (PostgreSQL/Redis cache) to handle concurrent
# users. The roadmap_summary here uses static templates for speed; the full
# AI-powered roadmap is available via GET /roadmap.

def get_dashboard(
    student_skills: List[str], target_role: str
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

    roadmap_summary: List[str] = []
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