from typing import Dict, Any
import json
from openai import AsyncOpenAI
from app.core.config import settings
from .base import AIProvider

class OpenAIProvider(AIProvider):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze_report(self, report_text: str) -> Dict[str, Any]:
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a crime analyst. Analyze the following report and return a JSON object with keys: 'summary' (short summary), 'classification' (crime type), 'severity' (Low, Medium, High), and 'safety_tips' (advice)."},
                    {"role": "user", "content": report_text}
                ],
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"OpenAI Error: {e}")
            return {"summary": "Error analyzing report", "classification": "Unknown", "severity": "Unknown", "safety_tips": "Error"}

    async def explain_threat(self, threat_type: str) -> Dict[str, Any]:
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                 messages=[
                    {"role": "system", "content": "Explain the threat and provide prevention. Return JSON with 'explanation' and 'prevention'."},
                    {"role": "user", "content": threat_type}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception:
            return {"explanation": "Error", "prevention": "Error"}

    async def chat(self, message: str, history: list[dict]) -> str:
        try:
            formatted_history = [{"role": "system", "content": "You are a public safety assistant for Suraksha Setu. Help users with safety tips, incident reporting guidance, emergency procedures, and community safety information. Be concise, calm, and helpful."}]
            for msg in history:
                role = "assistant" if msg.get("role") == "model" else "user"
                formatted_history.append({"role": role, "content": msg.get("parts", "")})
            formatted_history.append({"role": "user", "content": message})
            
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=formatted_history
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Chat Error: {e}")
            return "Sorry, I am unable to respond right now."
