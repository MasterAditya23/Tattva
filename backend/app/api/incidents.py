from fastapi import APIRouter
from typing import List
from datetime import datetime
import uuid
from app.database.models import IncidentCreate, IncidentResponse
from app.ai.diagnosis import analyze_incident
from app.rules.risk_engine import evaluate_risk

router = APIRouter()

# Temporary in-memory database
fake_db = {}

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate):
    incident_id = f"INC-{str(uuid.uuid4())[:8].upper()}"
    
    # 1. AI Analyzes the Problem
    ai_result = analyze_incident(incident.problem_description)
    diagnosis = ai_result["diagnosis"]
    action = ai_result["action"]
    
    # 2. Rule Engine Evaluates Risk
    risk = evaluate_risk(action)
    
    # 3. Determine Status based on Risk
    if risk == "HIGH_RISK":
        status = "PENDING_APPROVAL"
    elif risk == "LOW_RISK":
        status = "APPROVED" # Ready for auto-execution
    else:
        status = "MANUAL_REVIEW"
        
    new_incident = {
        "id": incident_id,
        "resource_id": incident.resource_id,
        "problem_description": incident.problem_description,
        "status": status,
        "risk_level": risk,
        "created_at": datetime.utcnow(),
        "ai_diagnosis": diagnosis,
        "recommended_action": action
    }
    
    fake_db[incident_id] = new_incident
    return new_incident

@router.get("/", response_model=List[IncidentResponse])
def get_all_incidents():
    return list(fake_db.values())
