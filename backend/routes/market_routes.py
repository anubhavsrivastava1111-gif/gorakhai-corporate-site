import feedparser
import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import re

router = APIRouter()

async def get_usd_inr() -> float:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get("https://open.er-api.com/v6/latest/USD")
            d = r.json()
            return float(d["rates"]["INR"])
    except Exception:
        return 94.0

async def get_metals_prices(usd_inr: float) -> dict:
    """Get gold and silver prices via metals.live (free, no key needed)"""
    gold_value = "Unavailable"
    silver_value = "Unavailable"
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get("https://api.metals.live/v1/spot")
            metals = r.json()
            for m in metals:
                if m.get("gold") and gold_value == "Unavailable":
                    gold_usd = float(m["gold"])
                    gold_inr_per_10g = (gold_usd * usd_inr / 31.1035) * 10
                    gold_value = f"₹{gold_inr_per_10g:,.0f}"
                if m.get("silver") and silver_value == "Unavailable":
                    silver_usd = float(m["silver"])
                    silver_inr_per_kg = silver_usd * usd_inr * 32.1507
                    silver_value = f"₹{silver_inr_per_kg:,.0f}"
    except Exception:
        pass
    return {"gold": gold_value, "silver": silver_value}

async def get_btc_price() -> dict:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true"
                }
            )
            d = r.json()
            btc_usd = d["bitcoin"]["usd"]
            btc_24h = d["bitcoin"].get("usd_24h_change", 0)
            return {
                "value": f"${btc_usd:,.0f}",
                "change": f"{btc_24h:+.2f}%",
                "isPositive": btc_24h >= 0,
            }
    except Exception:
        return {"value": "Unavailable", "change": "", "isPositive": True}

@router.get("/api/public/market-feed")
async def get_market_feed():
    now = datetime.now(timezone.utc)

    # Fetch all in sequence (Railway free tier — avoid parallel timeouts)
    usd_inr = await get_usd_inr()
    metals  = await get_metals_prices(usd_inr)
    btc     = await get_btc_price()

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
            "value": metals["gold"],
            "change": "",
            "changePercent": "Spot",
            "isPositive": True,
            "icon": "🥇",
            "category": "commodities",
            "updatedAt": now.isoformat(),
        },
        {
            "id": "silver",
            "symbol": "SILVER",
            "name": "Silver (kg)",
            "value": metals["silver"],
            "change": "",
            "changePercent": "Spot",
            "isPositive": True,
            "icon": "🥈",
            "category": "commodities",
            "updatedAt": now.isoformat(),
        },
        {
            "id": "btc",
            "symbol": "BTC",
            "name": "Bitcoin",
            "value": btc["value"],
            "change": btc["change"],
            "changePercent": btc["change"],
            "isPositive": btc["isPositive"],
            "icon": "₿",
            "category": "markets",
            "updatedAt": now.isoformat(),
        },
    ]

    return JSONResponse(content={
        "items": items,
        "updatedAt": now.isoformat(),
    })
