from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS middleware
from sqlalchemy.orm import Session
from . import models, database, crud, schemas
from fastapi import File, UploadFile
from PIL import Image
import pytesseract
import io

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # This is where Vite runs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Freelance Expense Tracker API is running"}

@app.post("/expenses/")
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, expense)

@app.get("/expenses/")
def read_expenses(db: Session = Depends(get_db)):
    return crud.get_expenses(db)

@app.post("/income/")
def create_income(income: schemas.IncomeCreate, db: Session = Depends(get_db)):
    return crud.create_income(db, income)

@app.get("/income/")
def read_incomes(db: Session = Depends(get_db)):
    return crud.get_incomes(db)


@app.post("/ocr/")
async def run_ocr(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    text = pytesseract.image_to_string(image)
    return {"text": text}