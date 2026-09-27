def evaluate_risk(action: str) -> str:
    # Define exact actions that require human approval
    high_risk_actions = [
        "RESTART_SERVER", 
        "DELETE_DATA", 
        "MANUAL_INVESTIGATION", 
        "CLEAR_DISK_SPACE",
        "SHUTDOWN_SYSTEM"
    ]
    
    # Define actions safe for autonomous execution
    low_risk_actions = [
        "RESTART_SERVICE", 
        "RESTART_PROCESS", 
        "CLEAR_TEMP_FILES",
        "RELOAD_CONFIG"
    ]
    
    # Normalize the action string to avoid case-sensitivity bugs
    safe_action = action.upper().strip() if action else ""
    
    if safe_action in high_risk_actions:
        return "HIGH_RISK"
    elif safe_action in low_risk_actions:
        return "LOW_RISK"
    else:
        # FAIL-SAFE: If the AI suggests a brand new action we haven't whitelisted,
        # we lock it down and force human approval.
        return "HIGH_RISK"
