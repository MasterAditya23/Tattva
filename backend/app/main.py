from fastapi import FastAPI
from app.api import incidents

app = FastAPI(title="Tattva API", description="AI-Assisted Infrastructure Incident Response", version="1.0.0")

# Include the incidents router
app.include_router(incidents.router, prefix="/incidents", tags=["Incidents"])

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "message": "Tattva backend is running"}
