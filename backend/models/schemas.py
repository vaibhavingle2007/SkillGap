from typing import List, Optional
from pydantic import BaseModel, Field


class Skill(BaseModel):
    name: str
    proficiency: str = Field(
        ..., pattern="^(beginner|intermediate|advanced)$"
    )


class JobRole(BaseModel):
    id: str
    title: str
    category: str = ""
    avgSalary: str = ""
    demand: str = ""
    description: str
    required_skills: List[Skill]


class SkillAnalysisRequest(BaseModel):
    user_skills: List[Skill]
    target_role_id: str


class SkillGap(BaseModel):
    skill_name: str
    required_proficiency: str
    current_proficiency: Optional[str] = None
    gap_level: str  # "missing", "needs_improvement", "met"


class SkillAnalysisResponse(BaseModel):
    target_role: str
    match_percentage: float
    skill_gaps: List[SkillGap]
    met_skills: List[SkillGap]


class SkillGapDetectionRequest(BaseModel):
    student_skills: List[str]
    target_role: str


class FrontendSkillInput(BaseModel):
    name: str
    level: int = 50


class FrontendAnalysisRequest(BaseModel):
    """Accepts the payload format sent by the Next.js frontend."""
    skills: List[FrontendSkillInput]
    target_role: str


class SkillGapDetectionResponse(BaseModel):
    missing_skills: List[str]
    matched_skills: List[str]
    skill_gap_score: float
    match_percentage: float = 0.0


class LearningRoadmapRequest(BaseModel):
    """Accepts the payload format sent by the frontend for roadmap generation."""
    skills: List[FrontendSkillInput] = []
    target_role: str


class RoadmapStep(BaseModel):
    step_number: int
    description: str


class SkillRoadmap(BaseModel):
    skill_name: str
    current_level: Optional[str]
    target_level: str
    duration_weeks: int
    steps: List[RoadmapStep]


class RoadmapResponse(BaseModel):
    target_role: str
    total_duration_weeks: int
    skill_roadmaps: List[SkillRoadmap]


class AIYoutubeVideo(BaseModel):
    title: str
    video_id: str
    thumbnail: Optional[str] = None


class AIRoadmapSkill(BaseModel):
    skill: str
    learning_steps: List[str]
    estimated_time: str
    youtube_videos: List[AIYoutubeVideo] = []


class AIRoadmapResponse(BaseModel):
    roadmap: List[AIRoadmapSkill]


class DashboardResponse(BaseModel):
    skill_gap_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    roadmap_summary: List[str]


class YouTubeLink(BaseModel):
    title: str
    url: str


class YouTubeSkillResource(BaseModel):
    skill: str
    youtube_links: List[YouTubeLink]