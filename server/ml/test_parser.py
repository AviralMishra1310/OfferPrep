from parsers.resume_parser import extract_text_from_pdf, parse_resume
from utils.text_cleaner import clean_text
from extractors.skill_extractor import extract_skills
from utils.nlp import process_text

# Resume Path
file_path = "../uploads/your_resume.pdf"
# Step 1: Extract Text
text = extract_text_from_pdf(file_path)
# Step 2: Clean Text
cleaned_text = clean_text(text)
# Step 3: Parse Resume
profile = parse_resume(cleaned_text)
# Step 4: Extract Skills
profile["skills"] = extract_skills(cleaned_text)
# Step 5: Process using spaCy
doc = process_text(cleaned_text)
# ------------------------------
# Candidate Profile
# ------------------------------
print("\n========== Candidate Profile ==========\n")
for key, value in profile.items():
    print(f"{key}:")
    if isinstance(value, list):
        if len(value) == 0:
            print("  None")
        else:
            for item in value:
                print("  -", item)
    else:
        print(" ", value)
    print()
# ------------------------------
# Named Entities
# ------------------------------
print("\n========== Named Entities (spaCy) ==========\n")

if len(doc.ents) == 0:
    print("No entities found.")
else:
    for ent in doc.ents:
        print(f"{ent.text}  --->  {ent.label_}")