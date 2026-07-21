import fitz
import re

def extract_text_from_pdf(file_path: str):
    document = fitz.open(file_path)
    text = ""
    for page in document:
        text += page.get_text()

    document.close()
    return text.strip()


def extract_section(text, headings):
    lines = text.split("\n")
    section = []
    capture = False

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if any(line.lower() == heading for heading in headings):
            capture = True
            continue

        if capture:
            # Stop when next heading starts
            if line.lower() in [
                "education",
                "skills",
                "projects",
                "experience",
                "certifications",
                "achievements",
                "languages",
                "summary"
            ]:
                break
            section.append(line)
    return section


def parse_resume(text):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    name = lines[0] if lines else ""
    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    email_match = re.search(email_pattern, text)
    email = email_match.group() if email_match else ""
    phone_pattern = r"(?:\+91[- ]?)?[6-9]\d{9}"
    phone_match = re.search(phone_pattern, text)
    phone = phone_match.group() if phone_match else ""
    education = extract_section(text, ["education"])
    projects = extract_section(text, ["projects"])
    experience = extract_section(text, ["experience", "work experience"])
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "education": education,
        "projects": projects,
        "experience": experience
    }