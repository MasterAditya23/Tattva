import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_incident(problem_description: str) -> dict:
    try:
        # Using the specific model you selected from Google AI Studio
        model = genai.GenerativeModel('gemini-3.5-flash-lite')
        
        prompt = f"""
        You are an expert DevOps AI assistant. Analyze this server issue: "{problem_description}"
        Diagnose the core problem and recommend ONE specific remediation action from this exact list:
        [RESTART_SERVICE, RESTART_PROCESS, CLEAR_DISK_SPACE, MANUAL_INVESTIGATION]
        
        Respond ONLY with a valid JSON object in this exact format, with no extra text:
        {{"diagnosis": "your short diagnosis here", "action": "THE_ACTION_HERE"}}
        """
        
        response = model.generate_content(prompt)
        
        text_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text_response)
        
    except Exception as e:
        print(f"--> [AI ERROR] {e}")
        return {
            "diagnosis": "Failed to connect to AI. Requires manual review.",
            "action": "MANUAL_INVESTIGATION"
        }
