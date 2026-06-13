from typing import List, Optional
from fastapi import APIRouter, Query

from models.schemas import (
    AIRoadmapResponse,
    AIYoutubeVideo,
    LearningRoadmapRequest,
    SkillGapDetectionRequest,
)
from services.skill_service import detect_skill_gaps, get_static_roadmap, get_youtube_resources

router = APIRouter()


@router.get("/roadmap", response_model=AIRoadmapResponse)
def get_roadmap(
    target_role: str = Query(..., description="Target job role (e.g., 'Backend Developer')"),
    missing_skills: Optional[List[str]] = Query(None, description="Skills the student is missing"),
):
    """Generate a static learning roadmap from curated skill roadmaps."""
    result = get_static_roadmap(missing_skills)
    result = _attach_youtube_videos(result)
    return result


def _extract_video_id(url: str) -> str:
    """Extract YouTube video ID from a URL, or return the URL as-is."""
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    if "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    return url


def _attach_youtube_videos(result: dict) -> dict:
    """Attach YouTube videos from the backend data to each roadmap skill."""
    roadmap = result.get("roadmap", [])
    if not roadmap:
        return result

    skill_names = [item["skill"] for item in roadmap]
    yt_resources = get_youtube_resources(skill_names)

    yt_map = {}
    for resource in yt_resources:
        videos = []
        for link in resource.youtube_links:
            vid = _extract_video_id(link.url)
            videos.append(AIYoutubeVideo(
                title=link.title,
                video_id=vid,
            ))
        yt_map[resource.skill] = videos

    for item in roadmap:
        item["youtube_videos"] = [v.model_dump() for v in yt_map.get(item["skill"], [])]

    return result


@router.post("/learning-roadmap", response_model=AIRoadmapResponse)
def post_learning_roadmap(request: LearningRoadmapRequest):
    """Generate a static learning roadmap from curated skill templates.

    Accepts the frontend format: {skills: [{name, level}], target_role}.
    First detects missing skills, then generates a roadmap for them.
    """
    gap_request = SkillGapDetectionRequest(
        student_skills=[s.name for s in request.skills],
        target_role=request.target_role,
    )
    gap_result = detect_skill_gaps(gap_request)

    if not gap_result.missing_skills:
        return AIRoadmapResponse(roadmap=[])

    result = get_static_roadmap(gap_result.missing_skills)
    result = _attach_youtube_videos(result)
    return result