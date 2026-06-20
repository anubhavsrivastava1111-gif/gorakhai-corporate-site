import feedparser
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import hashlib

router = APIRouter()

RSS_FEEDS = [
    {"url": "https://economictimes.indiatimes.com/rssfeedsdefault.cms", "category": "india"},
    {"url": "https://www.livemint.com/rss/news", "category": "business"},
    {"url": "https://feeds.feedburner.com/ndtvnews-business", "category": "business"},
    {"url": "https://feeds.feedburner.com/TechCrunch", "category": "ai"},
    {"url": "https://www.thehindu.com/business/Economy/feeder/default.rss", "category": "india"},
    {"url": "http://feeds.reuters.com/reuters/businessNews", "category": "world"},
]

CATEGORY_ICONS = {
    "india":    "🇮🇳",
    "business": "📈",
    "ai":       "🤖",
    "world":    "🌐",
    "markets":  "💹",
}

def score_impact(title: str) -> str:
    title_lower = title.lower()
    critical_kw = ["crash", "collapse", "emergency", "ban", "war", "crisis", "sanction", "recession"]
    high_kw = ["rate", "rbi", "fed", "gdp", "inflation", "budget", "merger", "acquisition", "ipo"]
    medium_kw = ["growth", "launch", "report", "forecast", "data", "quarter", "revenue"]
    if any(k in title_lower for k in critical_kw): return "critical"
    if any(k in title_lower for k in high_kw):     return "high"
    if any(k in title_lower for k in medium_kw):   return "medium"
    return "low"

def dedupe(items: list) -> list:
    seen = set()
    result = []
    for item in items:
        key = hashlib.md5(item["headline"][:60].lower().encode()).hexdigest()
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result

@router.get("/api/public/news-feed")
async def get_news_feed():
    items = []
    for feed_cfg in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_cfg["url"])
            for entry in feed.entries[:3]:
                title = entry.get("title", "").strip()
                summary = entry.get("summary", entry.get("description", "")).strip()
                published = entry.get("published", entry.get("updated", ""))
                if not title:
                    continue
                # Parse published date
                try:
                    if entry.get("published_parsed"):
                        import time
                        ts = time.mktime(entry.published_parsed)
                        pub_iso = datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
                    else:
                        pub_iso = datetime.now(timezone.utc).isoformat()
                except Exception:
                    pub_iso = datetime.now(timezone.utc).isoformat()

                cat = feed_cfg["category"]
                items.append({
                    "id": hashlib.md5(title.encode()).hexdigest()[:12],
                    "category": cat,
                    "headline": title,
                    "summary": summary[:300] if summary else title,
                    "source": feed.feed.get("title", "News"),
                    "publishedAt": pub_iso,
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
    items = dedupe(items)[:10]
    return JSONResponse(content={"items": items, "updatedAt": datetime.now(timezone.utc).isoformat()})
