from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy

nlp = spacy.load("en_core_web_sm")

deduction_rules = [
    {"keywords": ["laptop", "computer", "tablet", "phone"], "category": "Lifestyle Expenses", "max_amount": 2500, "note": "Eligible under lifestyle expenses for electronic devices"},
    {"keywords": ["online course", "graphic design", "education", "training"], "category": "Education Fees (Self)", "max_amount": 7000, "note": "For approved self-enhancement or professional courses"},
    {"keywords": ["health insurance", "medical insurance"], "category": "Education and Medical Insurance", "max_amount": 3000, "note": "Medical and education insurance premiums"},
    {"keywords": ["prs", "private retirement", "retirement scheme"], "category": "Private Retirement Scheme (PRS)", "max_amount": 3000, "note": "Contributions to PRS are deductible"},
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenseInput(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Welcome to Freelance Tracker API"}

@app.post("/analyze")
async def analyze_expense(data: ExpenseInput):
    text = data.text.lower()
    suggestions = []

    for rule in deduction_rules:
        if any(keyword in text for keyword in rule["keywords"]):
            if rule not in suggestions:
                suggestions.append(rule)

    return {"suggestions": suggestions}
