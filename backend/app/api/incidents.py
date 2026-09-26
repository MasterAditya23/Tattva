from fastapi import APIRouter
from typing import List
from datetime import datetime
import uuid
from app.database.models import IncidentCreate, IncidentResponse

router = APIRouter()

# Temporary in-memory database
fake_db = {}

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate):
    incident_id = f"INC-{str(uuid.uuid4())[:8].upper()}"
    
    new_incident = {
        "id": incident_id,
        "resource_id": incident.resource_id,
        "problem_description": incident.problem_description,
        "status": "DETECTED",
        "risk_level": "UNKNOWN",
        "created_at": datetime.utcnow()
    }
    
    fake_db[incident_id] = new_incident
    return new_incident

@router.get("/", response_model=List[IncidentResponse])
def get_all_incidents():
    return list(fake_db.values())
