from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, nullable=False)
    trip_length_days = Column(Integer, nullable=False)
    adventure = Column(Float, nullable=False)
    culture = Column(Float, nullable=False)
    relaxation = Column(Float, nullable=False)
    nightlife = Column(Float, nullable=False)
    nature = Column(Float, nullable=False)
    food = Column(Float, nullable=False)
    budget_range = Column(String, nullable=False)  # "budget" | "mid" | "luxury"
    itinerary_json = Column(JSON, nullable=True)
    avg_match_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
