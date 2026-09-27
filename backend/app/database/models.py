from sqlalchemy import Column, String, DateTime
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.database.database import Base

# --- SQLALCHEMY MODEL (Database Table) ---
class IncidentDB(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    resource_id = Column(String, index=True)
    problem_description = Column(String)
    status = Column(String)
    risk_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_diagnosis = Column(String, nullable=True)
    recommended_action = Column(String, nullable=True)

# --- PYDANTIC MODELS (Data Validation) ---
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
