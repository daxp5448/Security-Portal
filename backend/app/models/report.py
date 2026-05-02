from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class ReportBase(BaseModel):
    title: str = Field(...)
    description: str = Field(...)
    location: str = Field(...)
    lat: Optional[float] = None
    long: Optional[float] = None
    crime_type: Optional[str] = None
    severity: Optional[str] = None
    risk_score: Optional[float] = None
    status: str = "open" # open, investigating, resolved, closed
    created_by: Optional[int] = None
    image_url: Optional[str] = None
    
    # AI Analysis fields
    summary: Optional[str] = None
    ai_classification: Optional[str] = None
    safety_tips: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(ReportBase):
    pass

class Report(ReportBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
