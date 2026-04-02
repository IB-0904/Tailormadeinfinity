from fpdf import FPDF
import io

class HarvardResumePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        
    def header(self):
        pass # We'll do a custom header per document

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def sanitize(text: str) -> str:
    """Replace fancy AI unicode characters with standard keyboard equivalents."""
    if not isinstance(text, str):
        return ""
    
    replacements = {
        '\u2013': '-', # en dash
        '\u2014': '-', # em dash
        '\u2018': "'", # left single quote
        '\u2019': "'", # right single quote
        '\u201c': '"', # left double quote
        '\u201d': '"', # right double quote
        '\u2022': '-', # bullet
        '\u2026': '...', # ellipsis
        '\u00a0': ' ', # non-breaking space
    }
    
    for uni_char, ascii_char in replacements.items():
        text = text.replace(uni_char, ascii_char)
        
    # Fallback to strip out any remaining unsupported characters safely
    return text.encode('latin-1', 'ignore').decode('latin-1')

def generate_harvard_pdf(data: dict) -> bytes:
    """Generate a Harvard-style ATS-friendly resume PDF."""
    pdf = HarvardResumePDF()
    pdf.add_page()

    # --- Header (Name and Contact) ---
    pdf.set_font("Helvetica", style="B", size=14)
    name = sanitize(data.get("name", "Applicant Name")).upper()
    pdf.cell(0, 8, name, align="C", ln=True)

    pdf.set_font("Helvetica", size=10)
    contact = sanitize(data.get("contact_info", ""))
    if contact:
        pdf.cell(0, 5, contact, align="C", ln=True)
    pdf.ln(4)

    def section_header(title):
        pdf.set_font("Helvetica", style="B", size=11)
        pdf.cell(0, 6, sanitize(title).upper(), ln=True)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
        pdf.ln(2)

    # --- Summary ---
    summary = sanitize(data.get("summary", ""))
    if summary:
        section_header("Professional Summary")
        pdf.set_font("Helvetica", size=10)
        pdf.multi_cell(0, 5, summary)
        pdf.ln(4)

    # --- Experience ---
    experiences = data.get("experience", [])
    if experiences:
        section_header("Experience")
        for exp in experiences:
            pdf.set_font("Helvetica", style="B", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, sanitize(exp.get("company", "")), ln=False)
            
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, sanitize(exp.get("location", "")), align="R", ln=True)
            
            pdf.set_font("Helvetica", style="I", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, sanitize(exp.get("title", "")), ln=False)
            
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, sanitize(exp.get("dates", "")), align="R", ln=True)

            pdf.set_font("Helvetica", size=10)
            for bullet in exp.get("bullets", []):
                pdf.set_x(15)
                pdf.multi_cell(0, 5, f"-  {sanitize(bullet)}")
            pdf.ln(2)

    # --- Education ---
    education = data.get("education", [])
    if education:
        section_header("Education")
        for edu in education:
            pdf.set_font("Helvetica", style="B", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, sanitize(edu.get("institution", "")), ln=False)
            
            pdf.set_font("Helvetica", size=10)
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, sanitize(edu.get("location", "")), align="R", ln=True)

            pdf.set_font("Helvetica", style="I", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, sanitize(edu.get("degree", "")), ln=False)
            
            pdf.set_font("Helvetica", size=10)
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, sanitize(edu.get("dates", "")), align="R", ln=True)

            for bullet in edu.get("bullets", []):
                pdf.set_x(15)
                pdf.multi_cell(0, 5, f"-  {sanitize(bullet)}")
            pdf.ln(2)

    # --- Skills ---
    skills = sanitize(data.get("skills", ""))
    if skills:
        section_header("Skills & Additional Information")
        pdf.set_font("Helvetica", size=10)
        pdf.multi_cell(0, 5, skills)

    # Return as bytes. Streamlit requires strict `bytes`, not `bytearray`
    return bytes(pdf.output())
