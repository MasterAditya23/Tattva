def analyze_incident(problem_description: str) -> dict:
    description_lower = problem_description.lower()
    
    if "cpu" in description_lower:
        return {
            "diagnosis": "Possible runaway process consuming excessive resources.",
            "action": "RESTART_PROCESS"
        }
    elif "stopped" in description_lower or "down" in description_lower:
        return {
            "diagnosis": "Service unexpectedly terminated.",
            "action": "RESTART_SERVICE"
        }
    else:
        return {
            "diagnosis": "Unknown anomaly detected in infrastructure.",
            "action": "MANUAL_INVESTIGATION"
        }
