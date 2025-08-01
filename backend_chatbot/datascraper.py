import requests
from bs4 import BeautifulSoup
import time

BASE_URL = "https://medlineplus.gov/ency/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Referer": "https://www.google.com/",
}

def get_letter_pages():
    url = "https://medlineplus.gov/encyclopedia.html"
    res = requests.get(url, headers=HEADERS)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    ul = soup.find("ul", class_="alpha-links")
    if not ul:
        print("❌ Could not find letter links list on main page.")
        return []
    links = []
    for a in ul.find_all("a", href=True):
        href = a["href"]
        full_url = "https://medlineplus.gov/" + href.lstrip("/")
        links.append(full_url)
    return links

def get_article_links(letter_url):
    print(f"Fetching letter page: {letter_url}")
    res = requests.get(letter_url, headers=HEADERS)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")

    article_links = []
    ul_index = soup.find("ul", id="index")
    if not ul_index:
        print(f"❌ No article list found on {letter_url}")
        return []

    for a in ul_index.find_all("a", href=True):
        href = a["href"]
        if href.startswith("article/"):
            full_url = BASE_URL + href
            article_links.append(full_url)

    print(f"Found {len(article_links)} articles on {letter_url}")
    return article_links

def extract_article_content(article_url):
    print(f"Extracting: {article_url}")
    res = requests.get(article_url, headers=HEADERS)
    if res.status_code != 200:
        print(f"⚠️ Failed to fetch {article_url}")
        return None
    soup = BeautifulSoup(res.text, "html.parser")

    # Try common content containers
    content_div = soup.find("div", class_="ency_text")
    if not content_div:
        content_div = soup.find("div", class_="body-content")
    if not content_div:
        content_div = soup.find("article")

    if not content_div:
        print(f"⚠️ No content found for {article_url}")
        return None

    text = content_div.get_text(separator="\n", strip=True)
    return text

def main():
    letter_pages = get_letter_pages()
    all_article_links = []
    for letter_url in letter_pages:
        articles = get_article_links(letter_url)
        all_article_links.extend(articles)
        time.sleep(1)

    print(f"✅ Total article links found: {len(all_article_links)}")

    with open("medlineplus_articles.txt", "w", encoding="utf-8") as f:
        for link in all_article_links:
            content = extract_article_content(link)
            if content:
                f.write(f"URL: {link}\n")
                f.write(content + "\n")
                f.write("="*80 + "\n")
            time.sleep(0.5)

if __name__ == "__main__":
    main()
