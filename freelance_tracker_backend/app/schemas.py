from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpenseCreate(BaseModel):
    date: date
    amount: float
    category: str
    description: Optional[str] = None

class IncomeCreate(BaseModel):
    date: date
    amount: float
    client: str  # stored as category
    description: Optional[str] = None
