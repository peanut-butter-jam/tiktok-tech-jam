from typing import List
import PyPDF2
from fastapi import UploadFile

def read_pdf(file_bytes: UploadFile) -> str:
    """Reads a PDF and returns the full text as a string."""
    text = ""
    reader = PyPDF2.PdfReader(file_bytes.file)
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

