import feedparser
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import hashlib
import time
import re

router = APIRouter()

RSS_FEEDS = [
    {"url": "https://economictimes.indiatimes.com/rssfeedsdefault.cms", "category": "india"},
    {"url": "https://www.livemint.com/rss/news", "category": "india"},
    {"url": "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms", "category": "business"},
    {"url": "https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1695679047.cms", "category": "business"},
    {"url": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", "category": "business"},
    {"url": "https://www.business-standard.com/rss/home_page_top_stories.rss", "category": "business"},
    {"url": "https://feeds.bbci.co.uk/news/business/rss.xml", "category": "business"},
    {"url": "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms", "category": "markets"},
    {"url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", "category": "markets"},
    {"url": "https://www.livemint.com/rss/markets", "category": "markets"},
    {"url": "https://www.moneycontrol.com/rss/marketreports.xml", "category": "markets"},
    {"url": "https://economictimes.indiatimes.com/markets/commodities/rssfeeds/1368296.cms", "category": "commodities"},
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "category": "world"},
    {"url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "category": "world"},
    {"url": "https://feeds.skynews.com/feeds/rss/world.xml", "category": "world"},
    {"url": "https://techcrunch.com/feed/", "category": "ai"},
    {"url": "https://feeds.feedburner.com/venturebeat/SZYF", "category": "ai"},
    {"url": "https://feeds.bbci.co.uk/news/technology/rss.xml", "category": "ai"},
    {"url": "https://cointelegraph.com/rss", "category": "markets"},
]

CATEGORY_ICONS = {
    "india": "🇮🇳",
    "business": "📊",
    "ai": "🤖",
    "world": "🌐",
    "markets": "📈",
    "commodities": "🛢️",
}

def score_impact(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["crash", "collapse", "war", "crisis", "ban", "sanction", "emergency", "recession", "default", "attack", "record high", "record low", "circuit breaker"]):
        return "critical"
    if any(k in t for k in ["rbi", "fed", "rate", "gdp", "inflation", "budget", "merger", "ipo", "acquisition", "tariff", "nifty", "sensex", "rupee", "dollar", "gold", "oil", "sebi", "scheme", "policy", "government", "gst", "income tax", "fdi", "msme", "subsidy", "rally", "correction"]):
        return "high"
    if any(k in t for k in ["growth", "launch", "forecast", "quarter", "revenue", "ai", "openai", "google", "microsoft", "profit", "loss", "earnings", "investment", "startup", "shares", "stock", "mutual fund", "dividend"]):
        return "medium"
    return "low"

def clean_html(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text or '').strip()

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
    if not sa or not sb:
        return 0
    return len(sa & sb) / len(sa | sb)

@router.get("/api/public/news-feed")
async def get_news_feed():
    items = []
    for feed_cfg in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_cfg["url"])
            for entry in feed.entries[:3]:
                title = clean_html(entry.get("title") or "").strip()
                if not title or len(title) < 15:
                    continue
                summary = clean_html(entry.get("summary") or entry.get("description") or "")[:400]
                cat = feed_cfg["category"]
                items.append({
                    "id": hashlib.md5(title.encode()).hexdigest()[:12],
                    "category": cat,
                    "headline": title,
                    "summary": summary or title,
                    "source": clean_html(feed.feed.get("title") or "News")[:60],
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

    items.sort(key=lambda x: x["publishedAt"], reverse=True)

    kept = []
    for item in items:
        if not any(jaccard(item["headline"], k["headline"]) > 0.6 for k in kept):
            kept.append(item)
        if len(kept) >= 20:
            break

    return JSONResponse(content={
        "items": kept,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(kept),
    })
