SYSTEM_PROMPT = """You are FinAssist AI, a professional multilingual banking assistant.
Answer only banking, payments, cards, KYC, fraud-awareness, loan, insurance, savings, documents, and account-service questions.
Be clear, concise, polite, and safety-first. Never ask for OTP, PIN, CVV, passwords, net-banking credentials, or full card/account numbers.
For emergencies such as fraud, tell the user to immediately block cards/accounts through official bank channels and contact the bank helpline."""

BANKING_FAQS = [
    {
        "topic": "documents",
        "keywords": ["documents", "required documents", "paper", "paperwork", "checklist"],
        "answer": (
            "Common banking document checklist: identity proof, address proof, PAN or tax ID, recent photograph, mobile/email verification, "
            "and a signed application or KYC form. For loans, add income proof, bank statements, employment or business proof, and property or collateral documents if applicable."
        ),
    },
    {
        "topic": "fraud",
        "keywords": ["fraud", "scam", "otp", "phishing", "unauthorized", "suspicious", "dispute"],
        "answer": (
            "If you suspect fraud, immediately block the affected card or account from your bank app, call the official bank helpline, "
            "change passwords, and raise a dispute. Keep transaction details, screenshots or SMS alerts, complaint reference numbers, and any police/cyber complaint receipt if required. "
            "Do not share OTP, PIN, CVV, UPI PIN, or remote-screen access with anyone."
        ),
    },
    {
        "topic": "loan",
        "keywords": ["loan", "emi", "eligibility", "interest", "personal loan", "home loan"],
        "answer": (
            "Loan eligibility usually depends on income, credit score, employment stability, existing EMIs, age, and documentation. "
            "Keep identity proof, address proof, PAN or tax ID, income proof, salary slips or ITR, bank statements, employment or business proof, photographs, and collateral/property documents if the loan is secured."
        ),
    },
    {
        "topic": "kyc",
        "keywords": ["kyc", "documents", "verification", "pan", "aadhaar", "address"],
        "answer": (
            "For KYC, banks commonly ask for identity proof, current address proof, a recent photo, PAN or tax ID, mobile/email verification, and a signed KYC declaration or update form. "
            "Use only official bank branches, apps, or websites for document submission."
        ),
    },
    {
        "topic": "card",
        "keywords": ["atm", "card", "blocked", "debit", "credit", "pin"],
        "answer": (
            "For a blocked or lost card, block it immediately through the official mobile app, net banking, or helpline. "
            "For replacement, banks may ask for identity proof, customer ID or account reference, a card blocking reference, and a replacement request form. "
            "You can usually request a replacement card and reset your PIN through secure bank channels."
        ),
    },
    {
        "topic": "account",
        "keywords": ["open account", "savings", "current account", "minimum balance", "account opening"],
        "answer": (
            "To open a savings account, compare fees, minimum balance, digital banking features, debit card benefits, and branch access. "
            "You will normally need identity proof, address proof, PAN or tax ID, passport-size photo, contact details, nominee details, signed application form, and an initial deposit if required."
        ),
    },
    {
        "topic": "insurance",
        "keywords": ["insurance", "claim", "policy", "coverage"],
        "answer": (
            "For bank-linked insurance, keep identity proof, address proof, policy or proposal form, nominee details, income proof if required, and medical documents for health/life products. "
            "For claims, add claim form, policy number, bank details, medical or incident records, and nominee documents when applicable."
        ),
    },
]


def retrieve_banking_context(query: str) -> str:
    lowered = query.lower()
    matches = [item["answer"] for item in BANKING_FAQS if any(keyword in lowered for keyword in item["keywords"])]
    if not matches:
        matches = [item["answer"] for item in BANKING_FAQS[:3]]
    return "\n".join(f"- {match}" for match in matches)


def fallback_answer(query: str) -> str:
    context = retrieve_banking_context(query)
    return (
        f"{context}\n\n"
        "Recommended next step: use your bank's official app, website, branch, or verified helpline for account-specific action. "
        "I can explain the process and document checklist, but I cannot verify private account details here."
    )
