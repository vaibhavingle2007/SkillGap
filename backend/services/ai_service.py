import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import HTTPException

load_dotenv(override=True)

NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY", "")
NEBIUS_MODEL = os.getenv("NEBIUS_MODEL", "meta-llama/Llama-3.3-70B-Instruct")
NEBIUS_BASE_URL = "https://api.studio.nebius.com/v1/"


def _get_client() -> OpenAI:
    if not NEBIUS_API_KEY or NEBIUS_API_KEY == "your-nebius-api-key-here":
        raise HTTPException(
            status_code=503,
            detail="Nebius API key not configured. Set NEBIUS_API_KEY in .env",
        )
    return OpenAI(base_url=NEBIUS_BASE_URL, api_key=NEBIUS_API_KEY)


def generate_ai_roadmap(target_role: str, missing_skills: list[str]) -> dict:
    client = _get_client()
    # Re-read model at call time so .env changes are picked up on reload
    load_dotenv(override=True)
    model = os.getenv("NEBIUS_MODEL", "meta-llama/Llama-3.3-70B-Instruct")

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
        response_format={"type": "json_object"},
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
