from typing import Dict, Any
import json
from app.core.config import settings
from .base import AIProvider

from google import genai
from google.genai import types

class GeminiProvider(AIProvider):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-2.5-flash'
        self.system_instruction = "You are a public safety assistant for Suraksha Setu. Help users with safety tips, incident reporting guidance, and community safety. When appropriate, rigorously use Google Search to find real-time, relevant solutions or up-to-date information before answering. Be concise, calm, and helpful."

    async def analyze_report(self, report_text: str) -> Dict[str, Any]:
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=f"Analyze this crime report. Return a valid JSON object with keys: 'summary', 'classification', 'severity', 'safety_tips'. Report: {report_text}"
            )
            # Gemini might return markdown ```json ... ```, need to clean
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Error: {e}")
            return {"summary": "Error analyzing report", "classification": "Unknown", "severity": "Unknown", "safety_tips": "Error"}

    async def explain_threat(self, threat_type: str) -> Dict[str, Any]:
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=f"Explain the threat '{threat_type}' and provide prevention. Return valid JSON with keys 'explanation' and 'prevention'."
            )
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                 text = text.split("```")[1].split("```")[0]
            return json.loads(text)
        except Exception:
            return {"explanation": "Error", "prevention": "Error"}

    async def chat(self, message: str, history: list[dict]) -> str:
        try:
            formatted_history = []
            for msg in history:
                role = msg.get("role", "user")
                parts = msg.get("parts", "")
                if isinstance(parts, list):
                    parts = parts[0]
                formatted_history.append(
                    types.Content(role=role, parts=[types.Part.from_text(text=parts)])
                )

            chat_session = self.client.aio.chats.create(
                model=self.model_name,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    tools=[{'google_search': {}}]
                ),
                history=formatted_history
            )
            response = await chat_session.send_message(message)
            return response.text
        except Exception as e:
            print(f"Gemini Chat Error: {e}")
            return "Sorry, I am unable to respond right now."
