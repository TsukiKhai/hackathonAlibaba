from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    amount = Column(Float, nullable=False)
    category = Column(String, index=True)
    description = Column(String)

class Income(Base):
    __tablename__ = "incomes"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    amount = Column(Float, nullable=False)
    client = Column(String, index=True)
    description = Column(String)
