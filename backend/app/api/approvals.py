from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.models import IncidentResponse, IncidentDB
from app.database.database import get_db
from app.actions.executor import execute_remediation
from app.verification.recovery import check_health

router = APIRouter()

@router.post("/{incident_id}/approve", response_model=IncidentResponse)
def approve_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(IncidentDB).filter(IncidentDB.id == incident_id).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if incident.status != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Incident is not pending approval")
    
    success = execute_remediation(incident.recommended_action, incident.resource_id)
    
    if success:
        incident.status = "EXECUTING"
        db.commit()
        
        final_status = check_health(incident.resource_id)
        incident.status = final_status
    else:
        incident.status = "FAILED"
        
    db.commit()
    db.refresh(incident)
    return incident

@router.post("/{incident_id}/reject", response_model=IncidentResponse)
def reject_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(IncidentDB).filter(IncidentDB.id == incident_id).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if incident.status != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Incident is not pending approval")
    
    incident.status = "REJECTED"
    db.commit()
    db.refresh(incident)
    return incident
