import streamlit as st
import google.generativeai as genai
import json
from utils import extract_text_from_file
from pdf_generator import generate_harvard_pdf
from docx_generator import generate_harvard_docx

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
    
    response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(temperature=0.2))
    text = response.text.strip()
    if text.startswith('```json'): text = text[7:]
    if text.startswith('```'): text = text[3:]
    if text.endswith('```'): text = text[:-3]
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
    st.set_page_config(page_title="LetMeApply AI", page_icon="✨", layout="wide", initial_sidebar_state="expanded")
    
    # Custom CSS for a slight UI lift
    st.markdown("""
    <style>
    .stButton>button {
        border-radius: 8px;
        font-weight: bold;
    }
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0px;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #6B7280;
        margin-bottom: 2rem;
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown('<p class="main-header">✨ LetMeApply AI</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Instantly tailor your resume and generate cover letters to beat the ATS.</p>', unsafe_allow_html=True)

    # Sidebar for API Key
    with st.sidebar:
        st.image("https://cdn-icons-png.flaticon.com/512/3135/3135679.png", width=80)
        st.header("⚙️ Configuration")
        api_key = st.text_input("Gemini API Key:", type="password", help="Required to connect to Google's AI models.")
        st.caption("[Get a free API key here](https://aistudio.google.com/app/apikey)")
        st.markdown("---")
        st.markdown("### 💡 Tips")
        st.info("- Make sure your base resume has all your possible history.\n- Paste the full job description.")
        st.markdown("---")
        st.caption("Free LetMeApply clone for personal use.")

    # Main Area Layout
    st.markdown("### 1. Provide Your Details")
    
    col1, col2 = st.columns(2, gap="large")

    with col1:
        with st.container(border=True):
            st.subheader("📄 Base Resume")
            uploaded_resume = st.file_uploader("Upload your current resume", type=["pdf", "docx", "txt"])

    with col2:
        with st.container(border=True):
            st.subheader("🎯 Job Description")
            job_description = st.text_area("Paste the job posting text here:", height=150, placeholder="We are looking for a highly motivated Software Engineer...")

    st.markdown("---")
    st.markdown("### 2. Generate Application Materials")
    
    action_col1, action_col2 = st.columns(2)
    
    with action_col1:
        tailor_resume_btn = st.button("🚀 Tailor Resume to Job Description", use_container_width=True, type="primary")
    
    with action_col2:
        generate_cl_btn = st.button("📝 Generate Custom Cover Letter", use_container_width=True)

    st.write("") # spacer

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
                            # The AI returns JSON now
                            resume_data = generate_tailored_resume(model, resume_text, job_description)
                            
                            st.balloons()
                            
                            # Interactive Tabs for viewing vs downloading
                            tab1, tab2 = st.tabs(["📥 Download Options", "👀 Preview Content"])
                            
                            with tab1:
                                st.success("🎉 Resume tailored successfully!")
                                st.write("Your ATS-optimized resume is ready. Choose a format to download below.")
                                
                                # Generate files
                                pdf_bytes = generate_harvard_pdf(resume_data)
                                docx_bytes = generate_harvard_docx(resume_data)
                                
                                # Format filename based on job title
                                safe_job_title = resume_data.get('job_title', 'Tailored').replace(' ', '_').replace('/', '-')
                                pdf_filename = f"{safe_job_title}_Resume.pdf"
                                docx_filename = f"{safe_job_title}_Resume.docx"
                                
                                d_col1, d_col2 = st.columns(2)
                                with d_col1:
                                    st.download_button(
                                        label=f"📥 Download PDF Document",
                                        data=pdf_bytes,
                                        file_name=pdf_filename,
                                        mime="application/pdf",
                                        use_container_width=True,
                                        type="primary"
                                    )
                                with d_col2:
                                    st.download_button(
                                        label=f"📝 Download Word Document",
                                        data=docx_bytes,
                                        file_name=docx_filename,
                                        mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                        use_container_width=True
                                    )

                            with tab2:
                                with st.container(border=True):
                                    # Display it nicely in markdown for the user to review
                                    st.markdown(f"### {resume_data.get('name', '')}")
                                    st.caption(f"{resume_data.get('contact_info', '')}")
                                    st.divider()
                                    
                                    if resume_data.get('summary'):
                                        st.markdown("**Professional Summary**")
                                        st.write(resume_data['summary'])
                                    
                                    if resume_data.get('experience'):
                                        st.markdown("**Experience**")
                                        for exp in resume_data['experience']:
                                            st.markdown(f"**{exp.get('title')}** at {exp.get('company')} *( {exp.get('dates')} )*")
                                            for bullet in exp.get('bullets', []):
                                                st.markdown(f"- {bullet}")
                                    
                                    if resume_data.get('education'):
                                        st.markdown("**Education**")
                                        for edu in resume_data['education']:
                                            st.markdown(f"**{edu.get('degree')}** from {edu.get('institution')} *( {edu.get('dates')} )*")
                                    
                                    if resume_data.get('skills'):
                                        st.markdown("**Skills**")
                                        st.write(resume_data['skills'])
                                        
                        elif generate_cl_btn:
                            st.balloons()
                            st.success("🎉 Cover Letter generated successfully!")
                            with st.container(border=True):
                                cover_letter = generate_cover_letter(model, resume_text, job_description)
                                st.markdown(cover_letter)
                except Exception as e:
                    st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
