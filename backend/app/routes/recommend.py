from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import RecommendRequest, RecommendResponse, RankedPOIResponse
from app.services.recommender import recommend_pois

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.post("/", response_model=RecommendResponse)
def recommend(payload: RecommendRequest, db: Session = Depends(get_db)):
    ranked = recommend_pois(
        db=db,
        city=payload.destination,
        adventure=payload.adventure,
        culture=payload.culture,
        relaxation=payload.relaxation,
        nightlife=payload.nightlife,
        nature=payload.nature,
        food=payload.food,
    )

    if not ranked:
        raise HTTPException(
            status_code=404,
            detail=f"No POIs found for destination '{payload.destination}'. "
                   "Try: Paris, Tokyo, New York, Barcelona, Rome.",
        )

    ranked_response = [
        RankedPOIResponse(
            **{col: getattr(poi, col) for col in poi.__table__.columns.keys()},
            match_score=score,
        )
        for poi, score in ranked
    ]

    return RecommendResponse(
        destination=payload.destination,
        total_pois=len(ranked_response),
        ranked_pois=ranked_response,
    )
