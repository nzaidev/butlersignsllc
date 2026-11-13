#!/usr/bin/env python3
"""Extract CSS, gallery items, and unique image URLs from the exported HTML."""

from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGES = ROOT / "pages"
OUT = ROOT / "_extracted"
OUT.mkdir(exist_ok=True)

IMG_RE = re.compile(
    r"https://zdzxammcjnnhnksdkvln\.supabase\.co/storage/v1/render/image/public/[^\"'?\s]+(?:\?[^\"'\s]*)?"
)
GALLERY_ITEM_RE = re.compile(
    r'<a class="gallery-item([^"]*)" data-category="([^"]+)" href="([^"]+)">\s*'
    r'<img src="[^"]+" alt="([^"]*)"[^>]*>',
    re.S,
)


def unwrap_scope(css: str) -> str:
    css = css.strip()
    css = re.sub(r"^@scope\s*\([^)]+\)\s*\{", "", css, count=1)
    css = css.rstrip()
    if css.endswith("}"):
        # drop the @scope closer
        css = css[:-1].rstrip()
    return css


def extract_style_blocks(html: str) -> list[str]:
    return re.findall(r"<style>(.*?)</style>", html, re.S)


def local_name(url: str) -> str:
    path = unescape(url).split("?")[0]
    return Path(path).name


def main() -> None:
    home = (PAGES / "home.html").read_text(encoding="utf-8", errors="replace")
    story = (PAGES / "our-story.html").read_text(encoding="utf-8", errors="replace")
    work = (PAGES / "we-deliver.html").read_text(encoding="utf-8", errors="replace")
    book = (PAGES / "book.html").read_text(encoding="utf-8", errors="replace")

    home_styles = extract_style_blocks(home)
    story_styles = extract_style_blocks(story)
    work_styles = extract_style_blocks(work)

    tokens = home_styles[1] if len(home_styles) > 1 else home_styles[0]
    # First meaningful block is html/body/:root; skip tiny reset
    for block in home_styles:
        if ":root" in block and "html" in block:
            tokens = block
            break

    def scoped(blocks: list[str]) -> str:
        for block in blocks:
            if "@scope" in block and len(block) > 2000:
                return unwrap_scope(block)
        return ""

    home_css = scoped(home_styles)
    story_css = scoped(story_styles)
    work_css = scoped(work_styles)

    def from_marker(css: str, marker: str) -> str:
        idx = css.find(marker)
        return css[idx:] if idx >= 0 else ""

    story_only = from_marker(story_css, ".story-hero")
    work_only = from_marker(work_css, ".deliver-hero")

    extra_hero = """
/* Stacked billboard headline used on the homepage hero */
.banner-h1 {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.banner-h1 .line {
  display: block;
}
.banner-h1 .line-red {
  color: var(--red);
}
.banner-h1 .line-blue {
  color: var(--blue);
}
.banner-h1 .line-script {
  margin-top: 8px;
  font-size: 0.42em;
  line-height: 1.1;
}
.banner-h1 .line-script em.thick {
  font-weight: 700;
  color: var(--ink);
}

/* Book page */
.book-page {
  background: var(--cream);
  padding: clamp(48px, 8vw, 96px) 0;
}
.book-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: start;
}
.book-copy h1 {
  font-size: clamp(48px, 8vw, 96px);
  margin-bottom: 16px;
}
.book-copy .lede {
  margin-bottom: 32px;
}
.book-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.book-card h3 {
  font-size: 18px;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
  text-transform: uppercase;
}
.book-card ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.book-card li {
  display: flex;
  gap: 10px;
  font-size: 15px;
  color: var(--ink-2);
}
.book-card .check {
  color: var(--red);
  font-weight: 700;
}
.book-expect {
  margin-top: 20px;
  border-color: var(--red);
}
.book-form {
  display: grid;
  gap: 18px;
}
.book-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}
.book-form input,
.book-form textarea {
  width: 100%;
  border: 1px solid var(--line-2);
  border-radius: 8px;
  padding: 12px 14px;
  background: var(--paper);
}
.book-form input:focus,
.book-form textarea:focus {
  outline: 2px solid var(--red);
  outline-offset: 1px;
}
.book-form .row-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
.book-note {
  font-size: 12px;
  color: var(--ink-mute);
}
.book-success {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--cream-2);
}
@media (min-width: 700px) {
  .book-form .row-2 {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 960px) {
  .book-grid {
    grid-template-columns: 1fr 1.1fr;
    gap: 64px;
  }
}
"""

    combined = "\n\n".join(
        [
            "/* Tokens */",
            tokens,
            "/* Shared + home */",
            home_css,
            extra_hero,
            "/* Our Story */",
            story_only,
            "/* Our Work */",
            work_only,
        ]
    )
    (OUT / "site.css").write_text(combined, encoding="utf-8")

    urls: dict[str, str] = {}
    for html in (home, story, work, book):
        for match in IMG_RE.findall(html):
            url = unescape(match.replace("&amp;", "&"))
            name = local_name(url)
            urls[name] = url.split("?")[0] + "?quality=65&format=origin"

    items = []
    for match in GALLERY_ITEM_RE.finditer(work):
        extra_class, category, href, alt = match.groups()
        filename = local_name(unescape(href.replace("&amp;", "&")))
        classes = extra_class.strip()
        items.append(
            {
                "src": f"/images/{filename}",
                "alt": unescape(alt) or "Butler Signs work",
                "category": category,
                "span2": "span-2" in classes,
            }
        )

    (OUT / "images.json").write_text(json.dumps(urls, indent=2), encoding="utf-8")
    (OUT / "gallery.json").write_text(json.dumps(items, indent=2), encoding="utf-8")
    print(f"css bytes: {len(combined)}")
    print(f"unique images: {len(urls)}")
    print(f"gallery items: {len(items)}")
    for name in sorted(urls):
        print(name)


if __name__ == "__main__":
    main()
