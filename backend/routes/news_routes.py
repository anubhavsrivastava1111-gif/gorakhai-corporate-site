import feedparser
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import hashlib
import time

router = APIRouter()

RSS_FEEDS = [
    # India Business & Economy
    {"url": "https://economictimes.indiatimes.com/rssfeedsdefault.cms", "category": "india"},
    {"url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", "category": "markets"},
    {"url": "https://www.livemint.com/rss/news", "category": "business"},
    {"url": "https://www.business-standard.com/rss/home_page_top_stories.rss", "category": "business"},
    # World News
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "category": "world"},
    {"url": "https://feeds.bbci.co.uk/news/business/rss.xml", "category": "business"},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "category": "world"},
    # AI & Tech
    {"url": "https://techcrunch.com/feed/", "category": "ai"},
    {"url": "https://feeds.feedburner.com/venturebeat/SZYF", "category": "ai"},
    {"url": "https://www.wired.com/feed/category/business/latest/rss", "category": "business"},
    # Trade & Commodities
    {"url": "https://feeds.bbci.co.uk/news/business/economy/rss.xml", "category": "world"},
]

CATEGORY_ICONS = {
    "india":    "🇮🇳",
    "business": "📈",
    "ai":       "🤖",
    "world":    "🌐",
    "markets":  "💹",
}

def score_impact(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["crash", "collapse", "war", "crisis", "ban", "sanction", "emergency", "recession", "default"]): return "critical"
    if any(k in t for k in ["rbi", "fed", "rate", "gdp", "inflation", "budget", "merger", "ipo", "acquisition", "tariff", "trade"]): return "high"
    if any(k in t for k in ["growth", "launch", "forecast", "quarter", "revenue", "ai", "openai", "google", "microsoft"]): return "medium"
    return "low"

def parse_date(entry) -> str:
    try:
        if entry.get("published_parsed"):
            ts = time.mktime(entry.published_parsed)
            return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    except Exception:
        pass
    return datetime.now(timezone.utc).isoformat()

def jaccard(a: str, b: str) -> float:
    sa = set(a.lower().split())
    sb = set(b.lower().split())
    if not sa or not sb: return 0
    return len(sa & sb) / len(sa | sb)

@router.get("/api/public/news-feed")
async def get_news_feed():
    items = []
    for feed_cfg in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_cfg["url"])
            for entry in feed.entries[:4]:
                title = (entry.get("title") or "").strip()
                if not title or len(title) < 10:
                    continue
                summary = (entry.get("summary") or entry.get("description") or "").strip()
                # Strip HTML tags from summary
                import re
                summary = re.sub(r'<[^>]+>', '', summary)[:300]
                cat = feed_cfg["category"]
                items.append({
                    "id": hashlib.md5(title.encode()).hexdigest()[:12],
                    "category": cat,
                    "headline": title,
                    "summary": summary or title,
                    "source": (feed.feed.get("title") or "News").strip(),
                    "publishedAt": parse_date(entry),
                    "impact": score_impact(title),
                    "icon": CATEGORY_ICONS.get(cat, "📰"),
                    "aiAnalysis": None,
                    "businessImpact": None,
                    "recommendedActions": [],
                    "affectedIndustries": [],
                    "relatedNews": [],
                })
        except Exception:
            continue

    # Sort by date
    items.sort(key=lambda x: x["publishedAt"], reverse=True)

    # Deduplicate by Jaccard similarity
    kept = []
    for item in items:
        if not any(jaccard(item["headline"], k["headline"]) > 0.6 for k in kept):
            kept.append(item)
        if len(kept) >= 15:
            break

    return JSONResponse(content={
        "items": kept,
        "updatedAt": datetime.now(timezone.utc).isoformat()
    })
