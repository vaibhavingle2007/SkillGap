"""Vercel serverless function entry point.

Vercel's @vercel/python runtime looks for an ASGI `app` variable.
We add the project root to sys.path so the existing FastAPI app
and all its sub-packages (routes, services, models) are importable.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app  # noqa: E402, F401
