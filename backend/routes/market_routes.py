import feedparser
import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone

router = APIRouter()

async def get_usd_inr() -> float:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get("https://open.er-api.com/v6/latest/USD")
            d = r.json()
            return float(d["rates"]["INR"])
    except Exception:
        return 84.0  # fallback

async def get_gold_price_inr(usd_inr: float) -> dict:
    try:
        # Gold RSS from Economic Times
        feed = feedparser.parse("https://economictimes.indiatimes.com/markets/commodities/rss")
        for entry in feed.entries[:10]:
            title = entry.get("title", "").lower()
            if "gold" in title:
                summary = entry.get("summary", "")
                return {"available": True, "source": "ET Markets", "headline": entry.get("title", "")}
    except Exception:
        pass

    try:
        # Fallback: metals-api free tier via open.er-api (XAU)
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get("https://open.er-api.com/v6/latest/XAU")
            d = r.json()
            if d.get("rates", {}).get("INR"):
                # XAU rate = INR per troy ounce of gold
                # 1 troy ounce = 31.1035g
                # Indian retail price is per 10g
                price_per_troy_oz_inr = float(d["rates"]["INR"])
                price_per_10g = (price_per_troy_oz_inr / 31.1035) * 10
                # Add ~5% making charges + GST approximation for retail price
                retail_price = price_per_10g * 1.05
                return {
                    "available": True,
                    "value": f"₹{retail_price:,.0f}",
                    "source": "Live Rate",
                }
    except Exception:
        pass

    return {"available": False}

async def get_nifty_sensex() -> dict:
    try:
        feed = feedparser.parse("https://economictimes.indiatimes.com/markets/stocks/rss")
        nifty = None
        sensex = None
        for entry in feed.entries[:15]:
            title = entry.get("title", "").lower()
            if "nifty" in title and not nifty:
                nifty = {"headline": entry.get("title", ""), "available": True}
            if "sensex" in title and not sensex:
                sensex = {"headline": entry.get("title", ""), "available": True}
            if nifty and sensex:
                break
        return {"nifty": nifty, "sensex": sensex}
    except Exception:
        return {"nifty": None, "sensex": None}

@router.get("/api/public/market-feed")
async def get_market_feed():
    now = datetime.now(timezone.utc)
    usd_inr = await get_usd_inr()

    # Get gold
    gold = await get_gold_price_inr(usd_inr)

    # Get silver via XAG
    silver_value = "Unavailable"
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get("https://open.er-api.com/v6/latest/XAG")
            d = r.json()
            if d.get("rates", {}).get("INR"):
                # XAG = INR per troy ounce of silver
                # Indian silver quoted per kg = 1000g
                # 1 troy oz = 31.1035g → 1kg = 32.1507 troy oz
                price_per_troy_oz_inr = float(d["rates"]["INR"])
                price_per_kg = price_per_troy_oz_inr * 32.1507
                silver_value = f"₹{price_per_kg:,.0f}"
    except Exception:
        pass

    # Get BTC/USD
    btc_value = "Unavailable"
    btc_change = ""
    btc_positive = True
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "bitcoin", "vs_currencies": "usd", "include_24hr_change": "true"},
                timeout=5
            )
            d = r.json()
            btc_usd = d["bitcoin"]["usd"]
            btc_24h = d["bitcoin"].get("usd_24h_change", 0)
            btc_value = f"${btc_usd:,.0f}"
            btc_change = f"{btc_24h:+.2f}%"
            btc_positive = btc_24h >= 0
    except Exception:
        pass

    # Get crude oil via RSS
    crude_value = "Unavailable"
    try:
        feed = feedparser.parse("https://economictimes.indiatimes.com/markets/commodities/rss")
        for entry in feed.entries[:10]:
            if "crude" in entry.get("title", "").lower() or "oil" in entry.get("title", "").lower():
                crude_value = entry.get("title", "Check ET Markets")
                break
    except Exception:
        pass

    items = [
        {
            "id": "usdinr",
            "symbol": "USDINR",
            "name": "USD/INR",
            "value": f"₹{usd_inr:.2f}",
            "change": "",
            "changePercent": "Live",
            "isPositive": False,
            "icon": "💱",
            "category": "markets",
            "updatedAt": now.isoformat(),
        },
        {
            "id": "gold",
            "symbol": "GOLD",
            "name": "Gold (10g)",
            "value": gold.get("value", "Unavailable") if gold.get("available") else "Unavailable",
            "change": "",
            "changePercent": "MCX Est.",
            "isPositive": True,
            "icon": "🥇",
            "category": "commodities",
            "updatedAt": now.isoformat(),
        },
        {
            "id": "silver",
            "symbol": "SILVER",
            "name": "Silver (kg)",
            "value": silver_value,
            "change": "",
            "changePercent": "MCX Est.",
            "isPositive": True,
            "icon": "🥈",
            "category": "commodities",
            "updatedAt": now.isoformat(),
        },
        {
            "id": "btc",
            "symbol": "BTC",
            "name": "Bitcoin",
            "value": btc_value,
            "change": btc_change,
            "changePercent": btc_change,
            "isPositive": btc_positive,
            "icon": "₿",
            "category": "markets",
            "updatedAt": now.isoformat(),
        },
    ]

    return JSONResponse(content={
        "items": items,
        "updatedAt": now.isoformat(),
    })
