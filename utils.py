import PyPDF2
from docx import Document
import io

def extract_text_from_file(uploaded_file):
    """
    Extract text from an uploaded file based on its extension.
    Supports PDF, DOCX, and TXT.
    """
    if uploaded_file is None:
        return ""
        
    file_type = uploaded_file.name.split('.')[-1].lower()
    
    try:
        if file_type == 'pdf':
            return _extract_text_from_pdf(uploaded_file)
        elif file_type == 'docx':
            return _extract_text_from_docx(uploaded_file)
        elif file_type == 'txt':
            return _extract_text_from_txt(uploaded_file)
        else:
            raise ValueError(f"Unsupported file format: {file_type}")
    except Exception as e:
        raise Exception(f"Error reading file: {str(e)}")

def _extract_text_from_pdf(uploaded_file):
    """Extract text from a PDF file."""
    pdf_reader = PyPDF2.PdfReader(uploaded_file)
    text = ""
    for page in pdf_reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text.strip()

def _extract_text_from_docx(uploaded_file):
    """Extract text from a DOCX file."""
    doc = Document(uploaded_file)
    text = ""
    for paragraph in doc.paragraphs:
        if paragraph.text:
            text += paragraph.text + "\n"
    return text.strip()

def _extract_text_from_txt(uploaded_file):
    """Extract text from a TXT file."""
    # Read as bytes and decode
    content = uploaded_file.read()
    # Reset file pointer so it can be read again if needed
    uploaded_file.seek(0)
    
    try:
        return content.decode('utf-8')
    except UnicodeDecodeError:
        # Fallback to other encodings if utf-8 fails
        return content.decode('latin-1')
