"""
Generate POI data for the top 100 tourist destinations using GPT-3.5-turbo
and insert them into the pois table.

Usage:
    python backend/scripts/generate_pois.py              # run all missing cities
    python backend/scripts/generate_pois.py --dry-run    # print cities that would be processed
"""

import sys
import os
import json
import time
import argparse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from openai import OpenAI
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal, engine, Base
import app.models  # noqa: F401
from app.models.poi import POI

Base.metadata.create_all(bind=engine)

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# fmt: off
TOP_100_CITIES = [
    "Bangkok, Thailand",
    "London, UK",
    "Dubai, UAE",
    "Singapore",
    "Kuala Lumpur, Malaysia",
    "Istanbul, Turkey",
    "Hong Kong",
    "Antalya, Turkey",
    "Seoul, South Korea",
    "Phuket, Thailand",
    "Amsterdam, Netherlands",
    "Milan, Italy",
    "Vienna, Austria",
    "Prague, Czech Republic",
    "Budapest, Hungary",
    "Berlin, Germany",
    "Munich, Germany",
    "Lisbon, Portugal",
    "Madrid, Spain",
    "Athens, Greece",
    "Santorini, Greece",
    "Florence, Italy",
    "Venice, Italy",
    "Porto, Portugal",
    "Copenhagen, Denmark",
    "Stockholm, Sweden",
    "Dublin, Ireland",
    "Brussels, Belgium",
    "Zurich, Switzerland",
    "Interlaken, Switzerland",
    "Krakow, Poland",
    "Warsaw, Poland",
    "Dubrovnik, Croatia",
    "Split, Croatia",
    "Reykjavik, Iceland",
    "Edinburgh, UK",
    "Marrakech, Morocco",
    "Cairo, Egypt",
    "Cape Town, South Africa",
    "Mumbai, India",
    "Delhi, India",
    "Jaipur, India",
    "Agra, India",
    "Goa, India",
    "Colombo, Sri Lanka",
    "Beijing, China",
    "Shanghai, China",
    "Chengdu, China",
    "Xi'an, China",
    "Kyoto, Japan",
    "Osaka, Japan",
    "Bali, Indonesia",
    "Hanoi, Vietnam",
    "Ho Chi Minh City, Vietnam",
    "Hoi An, Vietnam",
    "Siem Reap, Cambodia",
    "Chiang Mai, Thailand",
    "Taipei, Taiwan",
    "Manila, Philippines",
    "Kathmandu, Nepal",
    "Maldives",
    "Abu Dhabi, UAE",
    "Doha, Qatar",
    "Muscat, Oman",
    "Petra, Jordan",
    "Amman, Jordan",
    "Tbilisi, Georgia",
    "Yerevan, Armenia",
    "Baku, Azerbaijan",
    "Rio de Janeiro, Brazil",
    "Buenos Aires, Argentina",
    "Santiago, Chile",
    "Lima, Peru",
    "Cusco, Peru",
    "Cartagena, Colombia",
    "Bogotá, Colombia",
    "Mexico City, Mexico",
    "Cancún, Mexico",
    "Havana, Cuba",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Montreal, Canada",
    "Los Angeles, USA",
    "San Francisco, USA",
    "Las Vegas, USA",
    "Miami, USA",
    "Chicago, USA",
    "Washington DC, USA",
    "New Orleans, USA",
    "Sydney, Australia",
    "Melbourne, Australia",
    "Auckland, New Zealand",
    "Queenstown, New Zealand",
    "Nairobi, Kenya",
    "Zanzibar, Tanzania",
    "Accra, Ghana",
    "Lagos, Nigeria",
    "Addis Ababa, Ethiopia",
]
# fmt: on

_SYSTEM_PROMPT = (
    "You are a travel data expert. Return only valid JSON with no extra commentary."
)

_USER_TEMPLATE = """\
Return a JSON object with a single key "pois" whose value is an array of exactly 8 POIs \
for {city}. Choose diverse POIs across different categories. Make scores realistic \
and clearly differentiated — avoid giving every POI similar scores.

Each POI must have these exact fields:
  name          — string, official or well-known name
  city          — string, exactly "{city}"
  category      — string, one of: Landmark, Museum, Park, Temple, Beach, Market, \
Historic Site, Neighbourhood, Entertainment, Food & Drink, Nightlife, \
Theme Park, Art, Nature, Tour
  avg_cost      — number, typical entry cost in USD (0 if free)
  duration_mins — integer, typical visit duration in minutes
  indoor_outdoor — string, exactly one of: indoor, outdoor, both
  adventure_score   — float 0.0–1.0
  culture_score     — float 0.0–1.0
  relaxation_score  — float 0.0–1.0
  nightlife_score   — float 0.0–1.0
  nature_score      — float 0.0–1.0
  food_score        — float 0.0–1.0
"""

_REQUIRED_FIELDS = {
    "name", "city", "category", "avg_cost", "duration_mins",
    "indoor_outdoor", "adventure_score", "culture_score",
    "relaxation_score", "nightlife_score", "nature_score", "food_score",
}

_SCORE_FIELDS = {
    "adventure_score", "culture_score", "relaxation_score",
    "nightlife_score", "nature_score", "food_score",
}

_VALID_INDOOR_OUTDOOR = {"indoor", "outdoor", "both"}


def _clamp(v: float) -> float:
    return max(0.0, min(1.0, float(v)))


def _validate_poi(raw: dict, city: str) -> dict | None:
    """Return a cleaned POI dict or None if it cannot be salvaged."""
    missing = _REQUIRED_FIELDS - raw.keys()
    if missing:
        print(f"    [skip] missing fields: {missing}")
        return None

    try:
        poi = {
            "name":          str(raw["name"])[:255],
            "city":          city,
            "category":      str(raw["category"])[:100],
            "avg_cost":      max(0.0, float(raw["avg_cost"])),
            "duration_mins": max(1, int(raw["duration_mins"])),
            "indoor_outdoor": str(raw["indoor_outdoor"]).lower().strip(),
        }
    except (ValueError, TypeError) as e:
        print(f"    [skip] type error: {e}")
        return None

    if poi["indoor_outdoor"] not in _VALID_INDOOR_OUTDOOR:
        poi["indoor_outdoor"] = "both"

    for field in _SCORE_FIELDS:
        try:
            poi[field] = _clamp(raw[field])
        except (ValueError, TypeError):
            poi[field] = 0.5

    return poi


def _fetch_pois_for_city(city: str, retries: int = 3) -> list[dict]:
    """Call the OpenAI API and return a list of validated POI dicts."""
    for attempt in range(1, retries + 1):
        try:
            response = _client.chat.completions.create(
                model="gpt-3.5-turbo",
                response_format={"type": "json_object"},
                temperature=0.7,
                messages=[
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user",   "content": _USER_TEMPLATE.format(city=city)},
                ],
            )
            raw_json = response.choices[0].message.content
            data = json.loads(raw_json)

            pois_raw = data.get("pois") or data.get("POIs") or []
            if not isinstance(pois_raw, list):
                raise ValueError("'pois' key is not a list")

            validated = []
            for p in pois_raw:
                clean = _validate_poi(p, city)
                if clean:
                    validated.append(clean)

            if not validated:
                raise ValueError("no valid POIs in response")

            return validated

        except Exception as e:
            wait = 2 ** attempt
            print(f"    [attempt {attempt}/{retries}] error: {e}. Retrying in {wait}s…")
            time.sleep(wait)

    print(f"    [fail] giving up on {city} after {retries} attempts")
    return []


def _get_existing_cities(db) -> set[str]:
    rows = db.query(POI.city).distinct().all()
    return {r[0] for r in rows}


def run(dry_run: bool = False) -> None:
    db = SessionLocal()
    try:
        existing = _get_existing_cities(db)
        print(f"Cities already in DB ({len(existing)}): {', '.join(sorted(existing))}\n")

        pending = [c for c in TOP_100_CITIES if c not in existing]
        print(f"{len(pending)} cities to generate. {len(TOP_100_CITIES) - len(pending)} skipped.\n")

        if dry_run:
            print("Dry-run mode — no data will be inserted.\n")
            for c in pending:
                print(f"  Would generate: {c}")
            return

        total_inserted = 0
        total_failed  = 0

        for idx, city in enumerate(pending, start=1):
            print(f"[{idx:>3}/{len(pending)}] {city}")
            pois = _fetch_pois_for_city(city)

            if not pois:
                print(f"    [skip] no POIs generated")
                total_failed += 1
                time.sleep(1)
                continue

            inserted = 0
            try:
                for p in pois:
                    db.add(POI(**p))
                db.commit()
                inserted = len(pois)
                total_inserted += inserted
                print(f"    ✓ inserted {inserted} POIs")
            except SQLAlchemyError as e:
                db.rollback()
                print(f"    [db error] {e}")
                total_failed += 1

            # Respect OpenAI rate limits (~3 RPM for free tier, 60 RPM for paid)
            time.sleep(1)

        print(f"\nDone. {total_inserted} POIs inserted across {len(pending) - total_failed} cities.")
        if total_failed:
            print(f"       {total_failed} cities failed — re-run the script to retry them.")

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate POIs via GPT-3.5-turbo")
    parser.add_argument("--dry-run", action="store_true", help="List pending cities without calling the API")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
