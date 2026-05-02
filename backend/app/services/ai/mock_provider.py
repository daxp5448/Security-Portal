from typing import Dict, Any
from .base import AIProvider

class MockAIProvider(AIProvider):
    async def analyze_report(self, report_text: str) -> Dict[str, Any]:
        return {
            "summary": f"Mock summary for: {report_text[:50]}...",
            "classification": "Theft",
            "severity": "Low",
            "safety_tips": "Ensure meaningful locks are used."
        }

    async def explain_threat(self, threat_type: str) -> Dict[str, Any]:
        return {
            "explanation": f"Mock explanation for {threat_type}.",
            "prevention": "Mock prevention steps."
        }

    async def chat(self, message: str, history: list[dict]) -> str:
        return "This is a mock response from the safety assistant."
