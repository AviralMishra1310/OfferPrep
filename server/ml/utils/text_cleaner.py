import re
def clean_text(text: str):
    text = text.replace("\t", " ")

    text = re.sub(r" +", " ", text)

    text = re.sub(r"\n+", "\n", text)

    text = text.strip()
    return text