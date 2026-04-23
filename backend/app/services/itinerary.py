import os
import json
from typing import List, Tuple

from dotenv import load_dotenv
from openai import OpenAI

from app.models.poi import POI

load_dotenv()

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

_POIS_PER_DAY = 3


def _assign_days(
    ranked_pois: List[Tuple[POI, float]],
    trip_length_days: int,
) -> List[dict]:
    """Slice top POIs and distribute evenly across days."""
    total_needed = trip_length_days * _POIS_PER_DAY
    top = ranked_pois[:total_needed]

    days = []
    for day_num in range(1, trip_length_days + 1):
        start = (day_num - 1) * _POIS_PER_DAY
        chunk = top[start : start + _POIS_PER_DAY]
        days.append({"day": day_num, "activities": chunk})
    return days


def _build_prompt(
    destination: str,
    trip_length_days: int,
    budget_range: str,
    prefs: dict,
    days: List[dict],
) -> str:
    pref_lines = "\n".join(
        f"  - {k.capitalize()}: {int(v * 100)}%" for k, v in prefs.items()
    )

    day_lines = []
    for d in days:
        acts = "\n".join(
            f"    • {poi.name} ({poi.category}, ${poi.avg_cost:.0f}, "
            f"{poi.duration_mins}min) — {score:.0f}% match"
            for poi, score in d["activities"]
        )
        day_lines.append(f"  Day {d['day']}:\n{acts}")

    activity_block = "\n".join(day_lines)

    return f"""You are an enthusiastic, knowledgeable travel expert crafting a highly personalised itinerary.

Destination: {destination}
Trip length: {trip_length_days} day(s)
Budget tier: {budget_range}

Traveller preference profile (0% = no interest, 100% = top priority):
{pref_lines}

Planned activities — already assigned to days based on compatibility scores:
{activity_block}

Write a warm, engaging, day-by-day itinerary narrative. For EACH day:
1. Open with a creative theme title (e.g. "Day 1 — Art & Ancient Stones").
2. For every activity explain in 1-2 sentences WHY it specifically matches this traveller's profile.
3. Add one practical tip per day (best time to visit, what to eat nearby, etc.).

After all days, write a short "Your Trip at a Glance" paragraph summarising the overall experience.

Keep the tone personal — refer to the traveller as "you". Do not include costs or durations in the narrative."""


def build_itinerary(
    destination: str,
    trip_length_days: int,
    budget_range: str,
    prefs: dict,
    ranked_pois: List[Tuple[POI, float]],
) -> dict:
    """Call OpenAI and assemble the structured itinerary_json dict."""
    days_raw = _assign_days(ranked_pois, trip_length_days)

    prompt = _build_prompt(destination, trip_length_days, budget_range, prefs, days_raw)

    response = _client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a travel expert. You create vivid, personalised itinerary "
                    "narratives that explain exactly why each activity suits the traveller."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=2000,
        temperature=0.75,
    )

    narrative_text: str = response.choices[0].message.content.strip()

    # Build structured itinerary_json
    all_scores = [score for _, score in ranked_pois[:trip_length_days * _POIS_PER_DAY]]
    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0

    days_structured = []
    for d in days_raw:
        days_structured.append({
            "day": d["day"],
            "activities": [
                {
                    "poi_id": poi.id,
                    "name": poi.name,
                    "category": poi.category,
                    "avg_cost": poi.avg_cost,
                    "duration_mins": poi.duration_mins,
                    "indoor_outdoor": poi.indoor_outdoor,
                    "match_score": score,
                }
                for poi, score in d["activities"]
            ],
        })

    return {
        "destination": destination,
        "trip_length_days": trip_length_days,
        "budget_range": budget_range,
        "days": days_structured,
        "narrative": narrative_text,
        "avg_match_score": avg_score,
    }
