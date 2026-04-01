import streamlit as st
import google.generativeai as genai
import json
from utils import extract_text_from_file
from pdf_generator import generate_harvard_pdf

def configure_gemini(api_key):
    try:
        genai.configure(api_key=api_key)
        # Using gemini-2.5-flash as it is supported by the new key
        model = genai.GenerativeModel('gemini-2.5-flash')
        return model
    except Exception as e:
        st.error(f"Error configuring Gemini API: {str(e)}")
        return None

def generate_tailored_resume(model, resume_text, job_description):
    prompt = f"""
    You are an expert resume writer and ATS optimization specialist. 
    I have a base resume and a job description. 
    Please tailor the base resume to perfectly match the job description.
    Focus on highlighting the most relevant skills, experiences, and achievements.
    Optimize the keywords to pass ATS (Applicant Tracking Systems).
    Keep the professional format clear and easy to read.
    
    Return the tailored resume ONLY as a raw, valid JSON object with exactly this schema:
    {{
        "name": "Full Name",
        "job_title": "The specific Job Title you are tailoring this for",
        "contact_info": "Phone | Email | LinkedIn",
        "summary": "Professional summary paragraph...",
        "experience": [
            {{
                "company": "Company Name",
                "title": "Job Title",
                "location": "City, State",
                "dates": "Month Year - Month Year",
                "bullets": ["Bullet point 1", "Bullet point 2"]
            }}
        ],
        "education": [
            {{
                "institution": "University Name",
                "degree": "Degree Name",
                "location": "City, State",
                "dates": "Graduation Date",
                "bullets": ["Honors, GPA, etc."]
            }}
        ],
        "skills": "Comma separated list of skills"
    }}

    Do not include any markdown formatting like ```json in the output, just the raw JSON text.
    
    Job Description:
    {job_description}
    
    Base Resume:
    {resume_text}
    """
    
    # We use lower temperature for more deterministic JSON output
    response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(temperature=0.2))
    
    # Clean up the response in case the model added markdown blocks
    text = response.text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
        
    return json.loads(text.strip())

def generate_cover_letter(model, resume_text, job_description):
    prompt = f"""
    You are an expert career coach and professional writer.
    Write a compelling, professional cover letter based on the provided resume and job description.
    The cover letter should clearly connect the candidate's past experience with the requirements of the job.
    Make it engaging, confident, and free of grammatical errors.
    
    Job Description:
    {job_description}
    
    Base Resume:
    {resume_text}
    
    Cover Letter:
    """
    
    response = model.generate_content(prompt)
    return response.text

def main():
    st.set_page_config(page_title="Tailor Made Infinity", page_icon="📄", layout="wide")
    
    st.title("📄 LetMeApply Clone - AI Resume & Cover Letter Generator")
    st.markdown("Tailor your resume and generate cover letters using Google's Gemini AI.")

    # Sidebar for API Key
    with st.sidebar:
        st.header("Settings")
        api_key = st.text_input("Enter your Gemini API Key:", type="password")
        st.markdown("[Get your free Gemini API key here](https://aistudio.google.com/app/apikey)")
        st.markdown("---")
        st.markdown("### About")
        st.markdown("This is a Personnel project Created by Issac for personal use, powered by Google's Gemini Pro.")

    # Main Area
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("1. Upload Resume")
        uploaded_resume = st.file_uploader("Upload your base resume (PDF, DOCX, TXT)", type=["pdf", "docx", "txt"])

    with col2:
        st.subheader("2. Job Description")
        job_description = st.text_area("Paste the job description here:", height=200)

    st.markdown("---")
    st.subheader("3. Generate Application Materials")
    
    col3, col4 = st.columns(2)
    
    with col3:
        tailor_resume_btn = st.button("🚀 Tailor Resume to Job Description", use_container_width=True)
    
    with col4:
        generate_cl_btn = st.button("📝 Generate Cover Letter", use_container_width=True)

    # Results section
    st.markdown("### Results")

    if tailor_resume_btn or generate_cl_btn:
        if not api_key:
            st.error("Please enter your Gemini API Key in the sidebar.")
        elif not uploaded_resume:
            st.error("Please upload your base resume.")
        elif not job_description:
            st.error("Please paste the job description.")
        else:
            with st.spinner("Processing..."):
                try:
                    # Initialize Gemini
                    model = configure_gemini(api_key)
                    if model:
                        # Extract text from the uploaded file
                        resume_text = extract_text_from_file(uploaded_resume)
                        
                        if tailor_resume_btn:
                            st.subheader("Your Tailored Resume")
                            
                            # The AI returns JSON now
                            resume_data = generate_tailored_resume(model, resume_text, job_description)
                            
                            # Display it nicely in markdown for the user to review
                            st.markdown(f"**{resume_data.get('name', '')}**")
                            st.markdown(f"*{resume_data.get('contact_info', '')}*")
                            
                            if resume_data.get('summary'):
                                st.markdown("### Professional Summary")
                                st.markdown(resume_data['summary'])
                            
                            if resume_data.get('experience'):
                                st.markdown("### Experience")
                                for exp in resume_data['experience']:
                                    st.markdown(f"**{exp.get('title')}** at {exp.get('company')} ({exp.get('dates')})")
                                    for bullet in exp.get('bullets', []):
                                        st.markdown(f"- {bullet}")
                            
                            if resume_data.get('education'):
                                st.markdown("### Education")
                                for edu in resume_data['education']:
                                    st.markdown(f"**{edu.get('degree')}** from {edu.get('institution')} ({edu.get('dates')})")
                            
                            if resume_data.get('skills'):
                                st.markdown("### Skills")
                                st.markdown(resume_data['skills'])
                            
                            # Generate and offer the PDF download
                            pdf_bytes = generate_harvard_pdf(resume_data)
                            
                            # Format filename based on job title
                            safe_job_title = resume_data.get('job_title', 'Tailored').replace(' ', '_').replace('/', '-')
                            filename = f"{safe_job_title}_Resume.pdf"
                            
                            st.success(f"Resume tailored successfully! You can download it as a Harvard-formatted PDF below.")
                            st.download_button(
                                label=f"📥 Download Harvard Resume ({filename})",
                                data=pdf_bytes,
                                file_name=filename,
                                mime="application/pdf",
                                use_container_width=True
                            )
                            
                        elif generate_cl_btn:
                            st.subheader("Your Cover Letter")
                            cover_letter = generate_cover_letter(model, resume_text, job_description)
                            st.markdown(cover_letter)
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()