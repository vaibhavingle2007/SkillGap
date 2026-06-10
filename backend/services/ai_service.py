"""AI roadmap generation via NVIDIA NIM API.
Replaced by static roadmaps in backend/data/roadmaps.json via skill_service.get_static_roadmap().
Kept for optional premium mode if dynamic AI-generated content is needed in the future.
"""

import json
import os
from typing import List

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import HTTPException

load_dotenv(override=True)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-ultra-550b-a55b")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"


def _get_client() -> OpenAI:
    if not NVIDIA_API_KEY or NVIDIA_API_KEY == "your-nvidia-api-key-here":
        raise HTTPException(
            status_code=503,
            detail="NVIDIA API key not configured. Set NVIDIA_API_KEY in .env",
        )
    return OpenAI(base_url=NVIDIA_BASE_URL, api_key=NVIDIA_API_KEY)


def generate_ai_roadmap(target_role: str, missing_skills: List[str]) -> dict:
    client = _get_client()
    # Re-read model at call time so .env changes are picked up on reload
    load_dotenv(override=True)
    model = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-ultra-550b-a55b")

    skills_str = ", ".join(missing_skills)
    prompt = f"""You are a career development expert. Generate a learning roadmap for someone targeting the role of "{target_role}" who is missing the following skills: {skills_str}.

For each missing skill, provide:
- The skill name
- A list of 3-5 concrete learning steps (actionable, specific)
- Estimated time to learn (e.g., "2 weeks", "1 month")

Respond ONLY with valid JSON in this exact format, no other text:
{{
  "roadmap": [
    {{
      "skill": "skill name",
      "learning_steps": ["step 1", "step 2", "step 3"],
      "estimated_time": "X weeks"
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that only responds with valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=2048,
    )

    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="AI returned invalid JSON response",
        )
