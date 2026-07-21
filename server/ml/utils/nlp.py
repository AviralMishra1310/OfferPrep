import spacy

nlp = spacy.load("en_core_web_sm")

def process_text(text: str):
    return nlp(text)