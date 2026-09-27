
# Tattva: AI SRE Guardian

## Overview
Tattva is an AI-assisted infrastructure incident detection, diagnosis, and safe remediation platform. It transforms standard cloud alerting into an intelligent, risk-aware system where an AI agent diagnoses root causes, safely auto-remediates low-risk issues, and requires strict human approval for high-risk anomalies.

## Architecture
* **Frontend:** React.js, Tailwind CSS, Recharts (Hosted on Vercel)
* **Backend:** FastAPI, Python, SQLite (Hosted on Railway)
* **AI Engine:** Google Gemini 3.5 Flash Lite (Structured JSON Inference)

## Key Features
* **Intelligent Diagnosis:** Gemini AI parses error logs to explain probable root causes.
* **Rule-Based Risk Engine:** Automatically categorizes incidents into `LOW_RISK` or `HIGH_RISK`.
* **Controlled Auto-Remediation:** Executes safe, predefined scripts for known low-risk alerts.
* **Engineer Approval Gate:** Halts high-risk incidents, requiring explicit manual sign-off via an interactive in-app terminal.
* **Recovery Verification:** Database logging to validate system recovery post-remediation.

## Live Project Links
* **Live Application:** [Insert your Vercel Link]
* **Backend API Docs:** [Insert your Railway Link]/docs

## Local Setup Instructions

### 1. Backend (FastAPI)
Navigate to the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
