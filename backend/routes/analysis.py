from fastapi import APIRouter

from models.schemas import (
    SkillAnalysisRequest,
    SkillAnalysisResponse,
    SkillGapDetectionRequest,
    SkillGapDetectionResponse,
    FrontendAnalysisRequest,
)
from services.skill_service import analyze_skills, detect_skill_gaps

router = APIRouter()


@router.post("/analyze-skills", response_model=SkillGapDetectionResponse)
def analyze(request: FrontendAnalysisRequest):
    """Compare student skills against a target job role and return gap detection.

    Accepts the frontend format: {skills: [{name, level}], target_role}.
    """
    gap_request = SkillGapDetectionRequest(
        student_skills=[s.name for s in request.skills],
        target_role=request.target_role,
    )
    return detect_skill_gaps(gap_request)


@router.post("/analyze-skills/detailed", response_model=SkillAnalysisResponse)
def analyze_detailed(request: SkillAnalysisRequest):
    """Detailed skill analysis with proficiency-level comparison."""
    return analyze_skills(request)
