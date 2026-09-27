from fastapi import FastAPI
from app.api import incidents, approvals

app = FastAPI(title="Tattva API", description="AI-Assisted Infrastructure Incident Response", version="1.0.0")

# Include the routers
app.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])
app.include_router(approvals.router, prefix="/incidents", tags=["Approvals"])

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "message": "Tattva backend is running"}
