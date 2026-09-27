from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from app.database.models import IncidentCreate, IncidentResponse, IncidentDB
from app.database.database import get_db
from app.ai.diagnosis import analyze_incident
from app.rules.risk_engine import evaluate_risk
from app.actions.executor import execute_remediation
from app.verification.recovery import check_health

router = APIRouter()

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    incident_id = f"INC-{str(uuid.uuid4())[:8].upper()}"
    
    # 1. AI Analyzes
    ai_result = analyze_incident(incident.problem_description)
    diagnosis = ai_result["diagnosis"]
    action = ai_result["action"]
    
    # 2. Rules Evaluate Risk
    risk = evaluate_risk(action)
    
    # 3. Automation Routing
    if risk == "HIGH_RISK":
        status = "PENDING_APPROVAL"
    elif risk == "LOW_RISK":
        success = execute_remediation(action, incident.resource_id)
        if success:
            status = check_health(incident.resource_id)
        else:
            status = "FAILED"
    else:
        status = "MANUAL_REVIEW"
        
    # Create database record
    db_incident = IncidentDB(
        id=incident_id,
        resource_id=incident.resource_id,
        problem_description=incident.problem_description,
        status=status,
        risk_level=risk,
        created_at=datetime.utcnow(),
        ai_diagnosis=diagnosis,
        recommended_action=action
    )
    
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    
    return db_incident

@router.get("/", response_model=List[IncidentResponse])
def get_all_incidents(db: Session = Depends(get_db)):
    return db.query(IncidentDB).all()
