import unicodedata
import re

def normalize_text(text: str) -> str:
    """
    Convert Vietnamese text to lowercase, remove accents & unsafe wildcards
    """
    if not text:
        return ""

    text = text.lower()
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("utf-8")

    # Escape SQL wildcards
    text = text.replace("%", "\\%").replace("_", "\\_")

    return text
