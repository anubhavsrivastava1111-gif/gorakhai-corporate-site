import feedparser
import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone

router = APIRouter()

async def get_exchange_rates() -> dict:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get("https://open.er-api.com/v6/latest/USD")
            d = r.json()
            rates = d.get("rates", {})
            return rates
    except Exception:
        return {}

async def get_btc_price() -> dict:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "bitcoin", "vs_currencies": "usd", "include_24hr_change": "true"}
            )
            d = r.json()
            btc_usd = d["bitcoin"]["usd"]
            btc_24h = d["bitcoin"].get("usd_24h_change", 0)
            return {"value": f"${btc_usd:,.0f}", "change": f"{btc_24h:+.2f}%", "isPositive": btc_24h >= 0}
    except Exception:
        return {"value": "Unavailable", "change": "", "isPositive": True}

async def get_gold_silver(usd_inr: float) -> dict:
    # Try frankfurter + XAU workaround via commodity ETF proxy
    gold_value = "Unavailable"
    silver_value = "Unavailable"
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            # Use commodity prices from a reliable free source
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "pax-gold,silver", "vs_currencies": "usd"}
            )
            d = r.json()
            if "pax-gold" in d:
                # PAXG = 1 troy oz of gold
                gold_usd = float(d["pax-gold"]["usd"])
                gold_inr_per_10g = (gold_usd * usd_inr / 31.1035) * 10
                gold_value = f"₹{gold_inr_per_10g:,.0f}"
    except Exception:
        pass

    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "silver", "vs_currencies": "usd"}
            )
            d = r.json()
            if "silver" in d:
                silver_usd = float(d["silver"]["usd"])
                silver_inr_per_kg = silver_usd * usd_inr * 32.1507
                silver_value = f"₹{silver_inr_per_kg:,.0f}"
    except Exception:
        pass

    return {"gold": gold_value, "silver": silver_value}

@router.get("/api/public/market-feed")
async def get_market_feed():
    now = datetime.now(timezone.utc)
    rates = await get_exchange_rates()
    usd_inr = float(rates.get("INR", 94.0))
    btc = await get_btc_price()
    metals = await get_gold_silver(usd_inr)

    def fx_item(symbol, name, icon, base_rate, category="markets"):
        if not base_rate:
            return None
        value = f"₹{base_rate:.2f}" if name != "EUR/INR" else f"₹{base_rate:.2f}"
        return {
            "id": symbol.lower(),
            "symbol": symbol,
            "name": name,
            "value": f"₹{base_rate:.2f}",
            "change": "",
            "changePercent": "Live",
            "isPositive": False,
            "icon": icon,
            "category": category,
            "updatedAt": now.isoformat(),
        }

    items = []

    # Major currencies vs INR
    currency_map = [
        ("USDINR", "USD/INR", "🇺🇸", rates.get("INR")),
        ("EURINR", "EUR/INR", "🇪🇺", rates.get("INR", 0) / rates.get("EUR", 1) if rates.get("EUR") else None),
        ("GBPINR", "GBP/INR", "🇬🇧", rates.get("INR", 0) / rates.get("GBP", 1) if rates.get("GBP") else None),
        ("JPYINR", "JPY/INR", "🇯🇵", rates.get("INR", 0) / rates.get("JPY", 1) if rates.get("JPY") else None),
        ("AEDINR", "AED/INR", "🇦🇪", rates.get("INR", 0) / rates.get("AED", 1) if rates.get("AED") else None),
        ("SGDINR", "SGD/INR", "🇸🇬", rates.get("INR", 0) / rates.get("SGD", 1) if rates.get("SGD") else None),
    ]

    for symbol, name, icon, rate in currency_map:
        if rate:
            items.append({
                "id": symbol.lower(),
                "symbol": symbol,
                "name": name,
                "value": f"₹{float(rate):.2f}",
                "change": "",
                "changePercent": "Live",
                "isPositive": False,
                "icon": icon,
                "category": "markets",
                "updatedAt": now.isoformat(),
            })

    # Commodities
    items.append({
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
    })
    items.append({
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
    })
    items.append({
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
    })

    return JSONResponse(content={"items": items, "updatedAt": now.isoformat()})
