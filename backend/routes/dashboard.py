from fastapi import APIRouter, Query

from models.schemas import DashboardResponse
from services.skill_service import get_dashboard

router = APIRouter()


# Scalability: For high traffic, cache dashboard results per (student_skills,
# target_role) pair using Redis with a short TTL. The current implementation
# is stateless and horizontally scalable behind a load balancer.

@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    target_role: str = Query(..., description="Target job role ID"),
    student_skills: list[str] = Query(
        ..., description="Student's current skill names"
    ),
):
    """Unified dashboard: skill gap score, matched/missing skills, and roadmap summary."""
    return get_dashboard(student_skills, target_role)
