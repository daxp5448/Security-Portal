from abc import ABC, abstractmethod
from typing import Dict, Any

class AIProvider(ABC):
    @abstractmethod
    async def analyze_report(self, report_text: str) -> Dict[str, Any]:
        """Analyze a crime report to extract summary, classification, and severity."""
        pass
    
    @abstractmethod
    async def explain_threat(self, threat_type: str) -> Dict[str, Any]:
        """Explain a threat and provide preventive measures."""
        pass

    @abstractmethod
    async def chat(self, message: str, history: list[dict]) -> str:
        """Handle conversational chatbot interactions."""
        pass
