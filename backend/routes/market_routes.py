import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime, timezone

router = APIRouter()

async def get_all_rates() -> dict:
    """Get all FX rates from USD base — single call covers everything."""
    try:
        async with httpx.AsyncClient(timeout=6) as client:
            r = await client.get("https://open.er-api.com/v6/latest/USD")
            return r.json().get("rates", {})
    except Exception:
        return {}

async def get_crypto() -> dict:
    """BTC + ETH in one call."""
    try:
        async with httpx.AsyncClient(timeout=6) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin,ethereum,pax-gold",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                }
            )
            return r.json()
    except Exception:
        return {}

def inr_rate(rates: dict, currency: str) -> float | None:
    """Convert any currency to INR via USD base rates."""
    inr = rates.get("INR")
    if not inr:
        return None
    if currency == "USD":
        return float(inr)
    target = rates.get(currency)
    if not target or float(target) == 0:
        return None
    return float(inr) / float(target)

def make_fx(id, symbol, name, icon, value_inr, category="markets", ts=""):
    if value_inr is None:
        return None
    return {
        "id":            id,
        "symbol":        symbol,
        "name":          name,
        "value":         f"₹{value_inr:.2f}",
        "change":        "",
        "changePercent": "Live",
        "isPositive":    False,
        "icon":          icon,
        "category":      category,
        "updatedAt":     ts,
    }

def make_crypto(id, symbol, name, icon, data: dict, category="markets", ts=""):
    if not data:
        return None
    usd = data.get("usd")
    chg = data.get("usd_24h_change", 0) or 0
    if not usd:
        return None
    return {
        "id":            id,
        "symbol":        symbol,
        "name":          name,
        "value":         f"${float(usd):,.0f}",
        "change":        f"{chg:+.2f}%",
        "changePercent": f"{chg:+.2f}%",
        "isPositive":    chg >= 0,
        "icon":          icon,
        "category":      category,
        "updatedAt":     ts,
    }

@router.get("/api/public/market-feed")
async def get_market_feed():
    now = datetime.now(timezone.utc).isoformat()

    rates  = await get_all_rates()
    crypto = await get_crypto()

    usd_inr = inr_rate(rates, "USD") or 94.0

    items = []

    # ── CURRENCIES ────────────────────────────────────────
    fx_pairs = [
        ("usdinr", "USDINR", "USD/INR",  "🇺🇸", "USD"),
        ("eurinr", "EURINR", "EUR/INR",  "🇪🇺", "EUR"),
        ("gbpinr", "GBPINR", "GBP/INR",  "🇬🇧", "GBP"),
        ("jpyinr", "JPYINR", "JPY/INR",  "🇯🇵", "JPY"),
        ("aedinr", "AEDINR", "AED/INR",  "🇦🇪", "AED"),
        ("sgdinr", "SGDINR", "SGD/INR",  "🇸🇬", "SGD"),
        ("chfinr", "CHFINR", "CHF/INR",  "🇨🇭", "CHF"),
        ("cadinr", "CADINR", "CAD/INR",  "🇨🇦", "CAD"),
        ("audinr", "AUDINR", "AUD/INR",  "🇦🇺", "AUD"),
    ]
    for id_, sym, name, icon, cur in fx_pairs:
        val = inr_rate(rates, cur)
        item = make_fx(id_, sym, name, icon, val, "markets", now)
        if item:
            items.append(item)

    # ── GOLD via PAXG (1 PAXG = 1 troy oz gold) ──────────
    paxg = crypto.get("pax-gold")
    if paxg and paxg.get("usd"):
        gold_usd_per_oz  = float(paxg["usd"])
        gold_inr_per_10g = (gold_usd_per_oz * usd_inr / 31.1035) * 10
        chg = paxg.get("usd_24h_change", 0) or 0
        items.append({
            "id":            "gold",
            "symbol":        "GOLD",
            "name":          "Gold (10g)",
            "value":         f"₹{gold_inr_per_10g:,.0f}",
            "change":        f"{chg:+.2f}%",
            "changePercent": f"{chg:+.2f}%",
            "isPositive":    chg >= 0,
            "icon":          "🥇",
            "category":      "commodities",
            "updatedAt":     now,
        })
    else:
        items.append({
            "id": "gold", "symbol": "GOLD", "name": "Gold (10g)",
            "value": "Unavailable", "change": "", "changePercent": "",
            "isPositive": True, "icon": "🥇",
            "category": "commodities", "updatedAt": now,
        })

    # ── SILVER via fixed ratio to gold (~1:80 ratio) ──────
    # Silver spot not on CoinGecko free. Use XAG/USD approximation:
    # silver_usd ≈ gold_usd / 80 (current gold:silver ratio ~80:1)
    if paxg and paxg.get("usd"):
        silver_usd_per_oz  = float(paxg["usd"]) / 80.0
        silver_inr_per_kg  = silver_usd_per_oz * usd_inr * 32.1507
        items.append({
            "id":            "silver",
            "symbol":        "SILVER",
            "name":          "Silver (kg)",
            "value":         f"₹{silver_inr_per_kg:,.0f}",
            "change":        "",
            "changePercent": "Est.",
            "isPositive":    True,
            "icon":          "🥈",
            "category":      "commodities",
            "updatedAt":     now,
        })

    # ── CRUDE OIL (WTI via free API) ──────────────────────
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                "https://api.api-ninjas.com/v1/commodityprice",
                params={"name": "crude_oil"},
                headers={"X-Api-Key": ""},  # works without key for basic
            )
            d = r.json()
            if isinstance(d, dict) and d.get("price"):
                crude_usd = float(d["price"])
                items.append({
                    "id": "crude", "symbol": "CRUDE", "name": "Crude (WTI)",
                    "value": f"${crude_usd:.2f}",
                    "change": "", "changePercent": "USD/bbl",
                    "isPositive": True, "icon": "🛢️",
                    "category": "commodities", "updatedAt": now,
                })
    except Exception:
        pass

    # ── CRYPTO ────────────────────────────────────────────
    btc = make_crypto("btc", "BTC", "Bitcoin",  "₿",  crypto.get("bitcoin"),  "markets", now)
    eth = make_crypto("eth", "ETH", "Ethereum", "Ξ",  crypto.get("ethereum"), "markets", now)
    if btc: items.append(btc)
    if eth: items.append(eth)

    return JSONResponse(content={
        "items":     items,
        "updatedAt": now,
        "count":     len(items),
    })
