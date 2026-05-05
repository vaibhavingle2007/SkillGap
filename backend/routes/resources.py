from typing import List
from fastapi import APIRouter, Query

from models.schemas import YouTubeSkillResource
from services.skill_service import get_youtube_resources

router = APIRouter()


@router.get("/youtube-resources", response_model=List[YouTubeSkillResource])
def youtube_resources(
    skills: List[str] = Query(..., description="Skill names to get resources for"),
):
    """Return YouTube learning resources for the given skills."""
    return get_youtube_resources(skills)