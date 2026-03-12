from pydantic import BaseModel, Field


class Skill(BaseModel):
    name: str
    proficiency: str = Field(
        ..., pattern="^(beginner|intermediate|advanced)$"
    )


class JobRole(BaseModel):
    id: str
    title: str
    description: str
    required_skills: list[Skill]


class SkillAnalysisRequest(BaseModel):
    user_skills: list[Skill]
    target_role_id: str


class SkillGap(BaseModel):
    skill_name: str
    required_proficiency: str
    current_proficiency: str | None = None
    gap_level: str  # "missing", "needs_improvement", "met"


class SkillAnalysisResponse(BaseModel):
    target_role: str
    match_percentage: float
    skill_gaps: list[SkillGap]
    met_skills: list[SkillGap]


class SkillGapDetectionRequest(BaseModel):
    student_skills: list[str]
    target_role: str


class FrontendSkillInput(BaseModel):
    name: str
    level: int = 50


class FrontendAnalysisRequest(BaseModel):
    """Accepts the payload format sent by the Next.js frontend."""
    skills: list[FrontendSkillInput]
    target_role: str


class SkillGapDetectionResponse(BaseModel):
    missing_skills: list[str]
    matched_skills: list[str]
    skill_gap_score: float


class LearningRoadmapRequest(BaseModel):
    """Accepts the payload format sent by the frontend for roadmap generation."""
    skills: list[FrontendSkillInput] = []
    target_role: str


class RoadmapStep(BaseModel):
    step_number: int
    description: str


class SkillRoadmap(BaseModel):
    skill_name: str
    current_level: str | None
    target_level: str
    duration_weeks: int
    steps: list[RoadmapStep]


class RoadmapResponse(BaseModel):
    target_role: str
    total_duration_weeks: int
    skill_roadmaps: list[SkillRoadmap]


class AIRoadmapSkill(BaseModel):
    skill: str
    learning_steps: list[str]
    estimated_time: str


class AIRoadmapResponse(BaseModel):
    roadmap: list[AIRoadmapSkill]


class DashboardResponse(BaseModel):
    skill_gap_score: float
    matched_skills: list[str]
    missing_skills: list[str]
    roadmap_summary: list[str]


class YouTubeLink(BaseModel):
    title: str
    url: str


class YouTubeSkillResource(BaseModel):
    skill: str
    youtube_links: list[YouTubeLink]
