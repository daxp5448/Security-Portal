from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any, List
from app.services.ai.factory import get_ai_provider
from app.services.ai.base import AIProvider
from app.api.deps import CurrentUser

router = APIRouter()

@router.post("/analyze-report")
async def analyze_report(
    report_text: str = Body(..., embed=True),
    ai_provider: AIProvider = Depends(get_ai_provider)
):
    try:
        return await ai_provider.analyze_report(report_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain-threat")
async def explain_threat(
    threat_type: str = Body(..., embed=True),
    ai_provider: AIProvider = Depends(get_ai_provider)
):
    try:
        return await ai_provider.explain_threat(threat_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(
    message: str = Body(..., embed=True),
    history: List[Dict[str, Any]] = Body(default=[], embed=True),
    ai_provider: AIProvider = Depends(get_ai_provider)
):
    try:
        reply = await ai_provider.chat(message, history)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
