import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from typing import List, Tuple

from app.models.poi import POI

_FEATURE_COLS = [
    "adventure_score", "culture_score", "relaxation_score",
    "nightlife_score", "nature_score", "food_score",
]


def recommend_pois(
    db: Session,
    city: str,
    adventure: float,
    culture: float,
    relaxation: float,
    nightlife: float,
    nature: float,
    food: float,
) -> List[Tuple[POI, float]]:
    """Return POIs ranked by cosine similarity to user preference vector.

    Match scores are returned as floats in [0, 100].
    """
    pois = db.query(POI).filter(POI.city.ilike(f"%{city}%")).all()
    if not pois:
        return []

    user_vec = np.array([[adventure, culture, relaxation, nightlife, nature, food]])
    poi_matrix = np.array([
        [getattr(p, col) for col in _FEATURE_COLS]
        for p in pois
    ])

    # Handle all-zero user vector (no preferences set) gracefully
    if user_vec.sum() == 0:
        scores = [50.0] * len(pois)
    else:
        raw = cosine_similarity(user_vec, poi_matrix)[0]
        scores = (np.clip(raw, 0, 1) * 100).round(1).tolist()

    ranked = sorted(zip(pois, scores), key=lambda x: x[1], reverse=True)
    return ranked
