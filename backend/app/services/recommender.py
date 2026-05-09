import numpy as np
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
    """Return POIs ranked by weighted preference match.

    Match scores are returned as floats in [0, 100], where 100 = best
    available POI for this user's preference vector.
    """
    pois = db.query(POI).filter(POI.city.ilike(f"%{city}%")).all()
    if not pois:
        return []

    user_vec = np.array([adventure, culture, relaxation, nightlife, nature, food])
    poi_matrix = np.array([
        [getattr(p, col) for col in _FEATURE_COLS]
        for p in pois
    ])

    # Handle all-zero user vector (no preferences set) gracefully
    if user_vec.sum() == 0:
        scores = [50.0] * len(pois)
    else:
        # Weighted dot product normalised by sum(user_prefs) gives the fraction
        # of each user preference that a POI satisfies.  Then we scale relative
        # to the best POI in the result set so the top match reads near 100%.
        # Cosine similarity was penalising specialised POIs (e.g. a pure culture
        # museum scoring 66% with all-prefs-maxed) because it rewards a uniform
        # score distribution rather than raw quality on the dimensions you care about.
        dot = poi_matrix @ user_vec
        raw = dot / user_vec.sum()
        best = raw.max()
        if best > 0:
            scores = (raw / best * 100).clip(0, 100).round(1).tolist()
        else:
            scores = [0.0] * len(pois)

    ranked = sorted(zip(pois, scores), key=lambda x: x[1], reverse=True)
    return ranked
