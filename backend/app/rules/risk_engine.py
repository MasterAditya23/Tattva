def evaluate_risk(proposed_action: str) -> str:
    # Our strict allowlist of safe, automatable actions
    SAFE_ACTIONS = ["RESTART_SERVICE"]
    
    # High-risk actions that require a human to click 'APPROVE'
    HIGH_RISK_ACTIONS = ["RESTART_PROCESS"]
    
    if proposed_action in SAFE_ACTIONS:
        return "LOW_RISK"
    elif proposed_action in HIGH_RISK_ACTIONS:
        return "HIGH_RISK"
    else:
        return "UNKNOWN_RISK"
