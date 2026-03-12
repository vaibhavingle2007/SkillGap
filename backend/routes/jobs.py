from fastapi import APIRouter

from models.schemas import JobRole
from services.skill_service import get_all_job_roles

router = APIRouter()


@router.get("/job-roles", response_model=list[JobRole])
def list_job_roles():
    """Return all available job roles with their required skills."""
    return get_all_job_roles()
