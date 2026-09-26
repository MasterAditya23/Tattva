from fastapi import FastAPI

app = FastAPI(title="Tattva API", description="AI-Assisted Infrastructure Incident Response", version="1.0.0")

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "message": "Tattva backend is running"}
