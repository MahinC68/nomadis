from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.poi import POI
from app.schemas import POIResponse

router = APIRouter(prefix="/pois", tags=["POIs"])


@router.get("/", response_model=List[POIResponse])
def list_pois(
    city: Optional[str] = Query(None, description="Filter by city name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db),
):
    query = db.query(POI)
    if city:
        query = query.filter(POI.city.ilike(f"%{city}%"))
    if category:
        query = query.filter(POI.category.ilike(f"%{category}%"))
    return query.order_by(POI.city, POI.name).all()


@router.get("/{poi_id}", response_model=POIResponse)
def get_poi(poi_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    poi = db.query(POI).filter(POI.id == poi_id).first()
    if not poi:
        raise HTTPException(status_code=404, detail="POI not found")
    return poi
