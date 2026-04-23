from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import GenerateItineraryRequest, TripResponse
from app.services.recommender import recommend_pois
from app.services.itinerary import build_itinerary
from app.models.trip import Trip

router = APIRouter(prefix="/generate-itinerary", tags=["Itinerary"])


@router.post("/", response_model=TripResponse, status_code=201)
def generate_itinerary(payload: GenerateItineraryRequest, db: Session = Depends(get_db)):
    prefs = {
        "adventure": payload.adventure,
        "culture": payload.culture,
        "relaxation": payload.relaxation,
        "nightlife": payload.nightlife,
        "nature": payload.nature,
        "food": payload.food,
    }

    ranked = recommend_pois(db=db, city=payload.destination, **prefs)
    if not ranked:
        raise HTTPException(
            status_code=404,
            detail=f"No POIs found for destination '{payload.destination}'.",
        )

    itinerary = build_itinerary(
        destination=payload.destination,
        trip_length_days=payload.trip_length_days,
        budget_range=payload.budget_range,
        prefs=prefs,
        ranked_pois=ranked,
    )

    trip = Trip(
        destination=payload.destination,
        trip_length_days=payload.trip_length_days,
        budget_range=payload.budget_range,
        itinerary_json=itinerary,
        avg_match_score=itinerary["avg_match_score"],
        **prefs,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip
