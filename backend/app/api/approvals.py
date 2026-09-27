from fastapi import APIRouter, HTTPException
from app.database.models import IncidentResponse

# We import fake_db from incidents so they share the same memory
from app.api.incidents import fake_db

router = APIRouter()

@router.post("/{incident_id}/approve", response_model=IncidentResponse)
def approve_incident(incident_id: str):
    if incident_id not in fake_db:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident = fake_db[incident_id]
    if incident["status"] != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Incident is not pending approval")
    
    incident["status"] = "APPROVED"
    # Future Step: This is where we will trigger the Action Executor!
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
