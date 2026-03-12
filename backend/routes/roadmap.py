from fastapi import APIRouter, Query

from models.schemas import (
    AIRoadmapResponse,
    LearningRoadmapRequest,
    SkillGapDetectionRequest,
)
from services.ai_service import generate_ai_roadmap
from services.skill_service import detect_skill_gaps

router = APIRouter()


@router.get("/roadmap", response_model=AIRoadmapResponse)
def get_roadmap(
    target_role: str = Query(..., description="Target job role (e.g., 'Backend Developer')"),
    missing_skills: list[str] = Query(..., description="Skills the student is missing"),
):
    """Generate an AI-powered learning roadmap for missing skills using Nebius API."""
    result = generate_ai_roadmap(target_role, missing_skills)
    return result


@router.post("/learning-roadmap", response_model=AIRoadmapResponse)
def post_learning_roadmap(request: LearningRoadmapRequest):
    """Generate an AI-powered learning roadmap.

    Accepts the frontend format: {skills: [{name, level}], target_role}.
    First detects missing skills, then generates a roadmap for them.
    """
    # Detect skill gaps to find missing skills
    gap_request = SkillGapDetectionRequest(
        student_skills=[s.name for s in request.skills],
        target_role=request.target_role,
    )
    gap_result = detect_skill_gaps(gap_request)

    if not gap_result.missing_skills:
        return AIRoadmapResponse(roadmap=[])

    result = generate_ai_roadmap(request.target_role, gap_result.missing_skills)
    return result
