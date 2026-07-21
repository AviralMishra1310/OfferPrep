TECH_SKILLS = {
    "java",
    "python",
    "c",
    "c++",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "github",
    "linux",
    "rest api",
    "jwt",
    "numpy",
    "pandas",
    "scikit-learn",
    "tensorflow",
    "pytorch"
}


def extract_skills(text: str):
    text = text.lower()
    skills = []
    for skill in TECH_SKILLS:
        if skill in text:
            skills.append(skill)

    return sorted(set(skills))