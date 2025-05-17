import dashscope
from pdf2image import convert_from_path
import pytesseract
import os
import glob
from dashscope import Generation
import sqlite3
import json
import re
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel

load_dotenv()

dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")
dashscope.base_http_api_url = os.getenv("DASHSCOPE_URI")

app = FastAPI()

class ExtractRequest(BaseModel):
    pdf_path: str

def extract_text_from_image_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
    return text

def extract_metadata_with_qwen(payslip_text):
    prompt = f"""
The following is a payslip. Please extract the following metadata and return them in JSON format:
- base_salary
- bonuses
- deductions
- net_income
- pay_period_end

Payslip Content:
\"\"\"
{payslip_text}
\"\"\"
"""
    try:
        response = Generation.call(
            model="qwen-plus",
            prompt=prompt,
            result_format='message'
        )
        print("Response from DashScope: %s", response)

        output = response.get("output", {})

        if output.get("text") is None and "choices" in output:
            content = output["choices"][0]["message"]["content"]
            json_match = re.search(r"```json\n(.*?)\n```", content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            else:
                raise ValueError("Could not extract JSON from assistant's response.")

        return json.loads(output["text"])

    except Exception as e:
        import logging
        logging.error("Failed to extract metadata with Qwen: %s", e)
        return {}

def compute_taxable_income(total_annual_income: float, tax_deductibles: list[float]) -> float:
    """
    Calculate final taxable income after subtracting all tax deductible items.

    Args:
        total_annual_income (float): Gross annual income.
        tax_deductibles (list of float): List of deductible amounts.

    Returns:
        float: Final taxable income.
    """
    total_deductions = sum(tax_deductibles)
    taxable_income = total_annual_income - total_deductions
    return max(taxable_income, 0)
def aggregate_total_net_income(json_dir="extracted_income") -> float:
    """
    Iterate through all JSON files in the directory and sum their net_income.

    Args:
        json_dir (str): Directory containing income JSON files.

    Returns:
        float: Total aggregated net income.
    """
    total_net_income = 0.0
    for json_file in glob.glob(os.path.join(json_dir, "*.json")):
        try:
            with open(json_file, "r") as f:
                data = json.load(f)
                net_income = float(data.get("net_income", 0))
                total_net_income += net_income
        except Exception as e:
            print(f"Error reading {json_file}: {e}")
        
    print(total_net_income)
    return total_net_income

def write_db(metadata):
    conn = sqlite3.connect("payslips.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payslip_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            base_salary TEXT,
            bonuses TEXT,
            deductions TEXT,
            net_income TEXT
        )
    ''')

    cursor.execute('''
        INSERT INTO payslip_metadata (base_salary, bonuses, deductions, net_income)
        VALUES (?, ?, ?, ?)
    ''', (
        metadata.get("base_salary", ""),
        json.dumps(metadata.get("bonuses", {})),
        metadata.get("deductions", ""),
        metadata.get("net_income", "")
    ))

    conn.commit()
    conn.close()

# @app.post("/extract-taxable")
# async def extract_with_taxable(
#     file: UploadFile = File(...),
#     deductions: List[float] = Form(...)
# ):
#     if file.content_type != "application/pdf":
#         raise HTTPException(status_code=400, detail="File must be a PDF")

#     try:
#         # Save uploaded file temporarily
#         temp_file_path = f"/tmp/{file.filename}"
#         with open(temp_file_path, "wb") as buffer:
#             buffer.write(await file.read())

#         # Extract text and metadata
#         text = extract_text_from_image_pdf(temp_file_path)
#         metadata = extract_metadata_with_qwen(text)

#         os.remove(temp_file_path)

#         # Estimate annual income (from net_income * 12)
#         monthly_income = float(metadata.get("net_income", 0))
#         annual_income = monthly_income * 12

#         # Compute taxable income
#         final_taxable_income = compute_taxable_income(annual_income, deductions)

#         return {
#             "metadata": metadata,
#             "deductions": deductions,
#             "annual_income": round(annual_income, 2),
#             "final_taxable_income": round(final_taxable_income, 2)
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract")
async def extract_api(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    output_dir = "extracted_income"
    os.makedirs(output_dir, exist_ok=True)

    try:
        temp_file_path = f"/tmp/{file.filename}"
        basename = file.filename.split('.')[0]
        json_path = os.path.join(output_dir, f"{basename}.json")

        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())

        text = extract_text_from_image_pdf(temp_file_path)
        metadata = extract_metadata_with_qwen(text)
       
        print(metadata)

        aggregate_total_net_income()

        with open(json_path, "w") as json_file:
            json.dump(metadata, json_file, indent=4)

        os.remove(temp_file_path)

        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))