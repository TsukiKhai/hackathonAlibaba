import dashscope
from pdf2image import convert_from_path
import pytesseract
import os
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

@app.post("/extract")
async def extract_api(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())

        text = extract_text_from_image_pdf(temp_file_path)
        metadata = extract_metadata_with_qwen(text)
        
        print(metadata)

        os.remove(temp_file_path)

        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))