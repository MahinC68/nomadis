from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class POI(Base):
    __tablename__ = "pois"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    category = Column(String, nullable=False)
    avg_cost = Column(Float, nullable=False)
    duration_mins = Column(Integer, nullable=False)
    indoor_outdoor = Column(String, nullable=False)  # "indoor" | "outdoor" | "both"
    adventure_score = Column(Float, nullable=False)
    culture_score = Column(Float, nullable=False)
    relaxation_score = Column(Float, nullable=False)
    nightlife_score = Column(Float, nullable=False)
    nature_score = Column(Float, nullable=False)
    food_score = Column(Float, nullable=False)
