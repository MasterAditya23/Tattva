from fastapi import APIRouter, HTTPException
from app.database.models import IncidentResponse
from app.api.incidents import fake_db

# Import our new Executor and Verifier
from app.actions.executor import execute_remediation
from app.verification.recovery import check_health

router = APIRouter()

@router.post("/{incident_id}/approve", response_model=IncidentResponse)
def approve_incident(incident_id: str):
    if incident_id not in fake_db:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident = fake_db[incident_id]
    if incident["status"] != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Incident is not pending approval")
    
    # 1. Trigger Action Executor
    success = execute_remediation(incident["recommended_action"], incident["resource_id"])
    
    if success:
        incident["status"] = "EXECUTING"
        
        # 2. Trigger Recovery Verification
        final_status = check_health(incident["resource_id"])
        incident["status"] = final_status
    else:
        incident["status"] = "FAILED"
        
    return incident

@router.post("/{incident_id}/reject", response_model=IncidentResponse)
def reject_incident(incident_id: str):
    if incident_id not in fake_db:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident = fake_db[incident_id]
    if incident["status"] != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Incident is not pending approval")
    
    incident["status"] = "REJECTED"
    return incident
