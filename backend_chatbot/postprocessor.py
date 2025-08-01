import re

input_file = "medlineplus_articles.txt"
output_file = "dataset/symptom_details.txt"  # Adjust path if needed

def extract_sections(text):
    cause = treatment = suggestion = "N/A"

    # Normalize
    text = re.sub(r'\n{2,}', '\n', text)
    
    # Try to find Cause, Treatment, and Suggestion sections using keywords
    cause_match = re.search(r'(?i)(cause[s]?|etiology)[\s:]*\n?(.*?)(\n[A-Z][a-z]+|\Z)', text, re.DOTALL)
    treatment_match = re.search(r'(?i)treatment[s]?[\s:]*\n?(.*?)(\n[A-Z][a-z]+|\Z)', text, re.DOTALL)
    suggestion_match = re.search(r'(?i)(self[- ]?care|recommendation[s]?|suggestion[s]?)[\s:]*\n?(.*?)(\n[A-Z][a-z]+|\Z)', text, re.DOTALL)

    if cause_match:
        cause = cause_match.group(2).strip()
    if treatment_match:
        treatment = treatment_match.group(1).strip()
    if suggestion_match:
        suggestion = suggestion_match.group(2).strip()

    return cause, treatment, suggestion

def process_articles():
    with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
        raw_articles = infile.read().split("=" * 80)

        for article in raw_articles:
            lines = article.strip().splitlines()
            if not lines or not lines[0].startswith("URL:"):
                continue

            url = lines[0].replace("URL:", "").strip()
            content = "\n".join(lines[1:]).strip()

            # Use the first non-empty line as the symptom name
            title = next((line for line in lines[1:] if line.strip()), "Unknown Symptom")
            symptom_name = title.split(":")[0].strip().lower()

            cause, treatment, suggestion = extract_sections(content)

            outfile.write(f"{symptom_name}:\n")
            outfile.write(f"  cause: {cause}\n")
            outfile.write(f"  treatment: {treatment}\n")
            outfile.write(f"  suggestion: {suggestion}\n\n")

    print(f"✅ Post-processing complete. Output saved to: {output_file}")

if __name__ == "__main__":
    process_articles()
