from pydantic import BaseModel, Field
from typing import Optional, Any, List
from datetime import datetime


# ── Shared preference mixin ───────────────────────────────────────────────────

class PreferencesMixin(BaseModel):
    destination: str
    trip_length_days: int = Field(ge=1, le=30)
    adventure: float = Field(ge=0.0, le=1.0)
    culture: float = Field(ge=0.0, le=1.0)
    relaxation: float = Field(ge=0.0, le=1.0)
    nightlife: float = Field(ge=0.0, le=1.0)
    nature: float = Field(ge=0.0, le=1.0)
    food: float = Field(ge=0.0, le=1.0)
    budget_range: str = Field(pattern="^(budget|mid|luxury)$")


# ── POI ───────────────────────────────────────────────────────────────────────

class POIResponse(BaseModel):
    id: int
    name: str
    city: str
    category: str
    avg_cost: float
    duration_mins: int
    indoor_outdoor: str
    adventure_score: float
    culture_score: float
    relaxation_score: float
    nightlife_score: float
    nature_score: float
    food_score: float

    model_config = {"from_attributes": True}


# ── Recommend ─────────────────────────────────────────────────────────────────

class RecommendRequest(PreferencesMixin):
    pass


class RankedPOIResponse(POIResponse):
    match_score: float


class RecommendResponse(BaseModel):
    destination: str
    total_pois: int
    ranked_pois: List[RankedPOIResponse]


# ── Generate Itinerary ────────────────────────────────────────────────────────

class GenerateItineraryRequest(PreferencesMixin):
    pass


# ── Trip ──────────────────────────────────────────────────────────────────────

class TripCreate(PreferencesMixin):
    pass


class TripResponse(BaseModel):
    id: int
    destination: str
    trip_length_days: int
    adventure: float
    culture: float
    relaxation: float
    nightlife: float
    nature: float
    food: float
    budget_range: str
    itinerary_json: Optional[Any]
    avg_match_score: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}
