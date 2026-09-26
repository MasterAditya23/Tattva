from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IncidentBase(BaseModel):
    resource_id: str
    problem_description: str

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: str
    status: str
    risk_level: str
    created_at: datetime
    ai_diagnosis: Optional[str] = None
    recommended_action: Optional[str] = None

    class Config:
        from_attributes = True
