from fpdf import FPDF
import io

class HarvardResumePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        
    def header(self):
        pass # Custom header per document

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def generate_harvard_pdf(data: dict) -> bytes:
    """Generate a Harvard-style ATS-friendly resume PDF."""
    pdf = HarvardResumePDF()
    pdf.add_page()

    # --- Header (Name and Contact) ---
    pdf.set_font("Helvetica", style="B", size=14)
    name = data.get("name", "Applicant Name").upper()
    pdf.cell(0, 8, name, align="C", ln=True)

    pdf.set_font("Helvetica", size=10)
    contact = data.get("contact_info", "")
    if contact:
        pdf.cell(0, 5, contact, align="C", ln=True)
    pdf.ln(4)

    def section_header(title):
        pdf.set_font("Helvetica", style="B", size=11)
        pdf.cell(0, 6, title.upper(), ln=True)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
        pdf.ln(2)

    # --- Summary ---
    summary = data.get("summary", "")
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
            pdf.cell(100, 5, exp.get("company", ""), ln=False)
            
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, exp.get("location", ""), align="R", ln=True)
            
            pdf.set_font("Helvetica", style="I", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, exp.get("title", ""), ln=False)
            
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, exp.get("dates", ""), align="R", ln=True)

            pdf.set_font("Helvetica", size=10)
            for bullet in exp.get("bullets", []):
                pdf.set_x(15)
                pdf.multi_cell(0, 5, f"-  {bullet}")
            pdf.ln(2)

    # --- Education ---
    education = data.get("education", [])
    if education:
        section_header("Education")
        for edu in education:
            pdf.set_font("Helvetica", style="B", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, edu.get("institution", ""), ln=False)
            
            pdf.set_font("Helvetica", size=10)
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, edu.get("location", ""), align="R", ln=True)

            pdf.set_font("Helvetica", style="I", size=10)
            x_start, y_start = pdf.get_x(), pdf.get_y()
            pdf.cell(100, 5, edu.get("degree", ""), ln=False)
            
            pdf.set_font("Helvetica", size=10)
            pdf.set_xy(x_start, y_start)
            pdf.cell(0, 5, edu.get("dates", ""), align="R", ln=True)

            for bullet in edu.get("bullets", []):
                pdf.set_x(15)
                pdf.multi_cell(0, 5, f"-  {bullet}")
            pdf.ln(2)

    # --- Skills ---
    skills = data.get("skills", "")
    if skills:
        section_header("Skills & Additional Information")
        pdf.set_font("Helvetica", size=10)
        pdf.multi_cell(0, 5, skills)

    return bytes(pdf.output())