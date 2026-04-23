"""Seed the pois table with 50+ realistic POIs across 5 cities."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, engine, Base
import app.models  # noqa: F401
from app.models.poi import POI

Base.metadata.create_all(bind=engine)

POIS = [
    # ── PARIS (10 POIs) ───────────────────────────────────────────────────────
    {"name": "Eiffel Tower", "city": "Paris", "category": "Landmark",
     "avg_cost": 28.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.4, "culture_score": 0.9, "relaxation_score": 0.3,
     "nightlife_score": 0.1, "nature_score": 0.2, "food_score": 0.1},

    {"name": "Louvre Museum", "city": "Paris", "category": "Museum",
     "avg_cost": 22.0, "duration_mins": 180, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.4,
     "nightlife_score": 0.0, "nature_score": 0.0, "food_score": 0.1},

    {"name": "Montmartre & Sacré-Cœur", "city": "Paris", "category": "Neighbourhood",
     "avg_cost": 0.0, "duration_mins": 150, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 0.8, "relaxation_score": 0.5,
     "nightlife_score": 0.2, "nature_score": 0.3, "food_score": 0.4},

    {"name": "Palace of Versailles", "city": "Paris", "category": "Historic Site",
     "avg_cost": 20.0, "duration_mins": 240, "indoor_outdoor": "both",
     "adventure_score": 0.2, "culture_score": 1.0, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.5, "food_score": 0.1},

    {"name": "Seine River Cruise", "city": "Paris", "category": "Tour",
     "avg_cost": 15.0, "duration_mins": 75, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 0.7, "relaxation_score": 0.8,
     "nightlife_score": 0.2, "nature_score": 0.4, "food_score": 0.0},

    {"name": "Musée d'Orsay", "city": "Paris", "category": "Museum",
     "avg_cost": 16.0, "duration_mins": 150, "indoor_outdoor": "indoor",
     "adventure_score": 0.0, "culture_score": 0.95, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.0, "food_score": 0.1},

    {"name": "Le Marais District", "city": "Paris", "category": "Neighbourhood",
     "avg_cost": 10.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.7, "relaxation_score": 0.4,
     "nightlife_score": 0.5, "nature_score": 0.1, "food_score": 0.8},

    {"name": "Moulin Rouge Show", "city": "Paris", "category": "Entertainment",
     "avg_cost": 110.0, "duration_mins": 120, "indoor_outdoor": "indoor",
     "adventure_score": 0.3, "culture_score": 0.6, "relaxation_score": 0.3,
     "nightlife_score": 1.0, "nature_score": 0.0, "food_score": 0.4},

    {"name": "Bois de Boulogne", "city": "Paris", "category": "Park",
     "avg_cost": 0.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.5, "culture_score": 0.2, "relaxation_score": 0.9,
     "nightlife_score": 0.1, "nature_score": 0.9, "food_score": 0.1},

    {"name": "Café de Flore & Saint-Germain", "city": "Paris", "category": "Food & Drink",
     "avg_cost": 20.0, "duration_mins": 90, "indoor_outdoor": "both",
     "adventure_score": 0.1, "culture_score": 0.6, "relaxation_score": 0.7,
     "nightlife_score": 0.4, "nature_score": 0.1, "food_score": 0.95},

    # ── TOKYO (10 POIs) ───────────────────────────────────────────────────────
    {"name": "Senso-ji Temple", "city": "Tokyo", "category": "Temple",
     "avg_cost": 0.0, "duration_mins": 90, "indoor_outdoor": "both",
     "adventure_score": 0.2, "culture_score": 1.0, "relaxation_score": 0.6,
     "nightlife_score": 0.0, "nature_score": 0.3, "food_score": 0.5},

    {"name": "Shibuya Crossing & District", "city": "Tokyo", "category": "Neighbourhood",
     "avg_cost": 5.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.5, "culture_score": 0.7, "relaxation_score": 0.2,
     "nightlife_score": 0.9, "nature_score": 0.0, "food_score": 0.7},

    {"name": "Tokyo DisneySea", "city": "Tokyo", "category": "Theme Park",
     "avg_cost": 85.0, "duration_mins": 480, "indoor_outdoor": "both",
     "adventure_score": 0.95, "culture_score": 0.3, "relaxation_score": 0.2,
     "nightlife_score": 0.3, "nature_score": 0.2, "food_score": 0.5},

    {"name": "Tsukiji Outer Market", "city": "Tokyo", "category": "Food & Drink",
     "avg_cost": 25.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.6, "relaxation_score": 0.3,
     "nightlife_score": 0.1, "nature_score": 0.1, "food_score": 1.0},

    {"name": "Shinjuku Gyoen Garden", "city": "Tokyo", "category": "Park",
     "avg_cost": 2.5, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.5, "relaxation_score": 0.95,
     "nightlife_score": 0.0, "nature_score": 1.0, "food_score": 0.1},

    {"name": "Akihabara Electric Town", "city": "Tokyo", "category": "Shopping",
     "avg_cost": 30.0, "duration_mins": 150, "indoor_outdoor": "indoor",
     "adventure_score": 0.3, "culture_score": 0.7, "relaxation_score": 0.2,
     "nightlife_score": 0.5, "nature_score": 0.0, "food_score": 0.3},

    {"name": "teamLab Borderless", "city": "Tokyo", "category": "Art",
     "avg_cost": 32.0, "duration_mins": 120, "indoor_outdoor": "indoor",
     "adventure_score": 0.4, "culture_score": 0.8, "relaxation_score": 0.6,
     "nightlife_score": 0.3, "nature_score": 0.2, "food_score": 0.0},

    {"name": "Mount Fuji Day Trip", "city": "Tokyo", "category": "Nature",
     "avg_cost": 60.0, "duration_mins": 480, "indoor_outdoor": "outdoor",
     "adventure_score": 1.0, "culture_score": 0.5, "relaxation_score": 0.4,
     "nightlife_score": 0.0, "nature_score": 1.0, "food_score": 0.1},

    {"name": "Kabuki-za Theatre", "city": "Tokyo", "category": "Entertainment",
     "avg_cost": 45.0, "duration_mins": 180, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.4,
     "nightlife_score": 0.2, "nature_score": 0.0, "food_score": 0.1},

    {"name": "Omoide Yokocho (Memory Lane)", "city": "Tokyo", "category": "Food & Drink",
     "avg_cost": 20.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.7, "relaxation_score": 0.4,
     "nightlife_score": 0.9, "nature_score": 0.0, "food_score": 0.95},

    # ── NEW YORK (10 POIs) ────────────────────────────────────────────────────
    {"name": "Central Park", "city": "New York", "category": "Park",
     "avg_cost": 0.0, "duration_mins": 180, "indoor_outdoor": "outdoor",
     "adventure_score": 0.5, "culture_score": 0.4, "relaxation_score": 0.9,
     "nightlife_score": 0.1, "nature_score": 0.9, "food_score": 0.3},

    {"name": "Metropolitan Museum of Art", "city": "New York", "category": "Museum",
     "avg_cost": 25.0, "duration_mins": 210, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.1, "food_score": 0.2},

    {"name": "Times Square", "city": "New York", "category": "Landmark",
     "avg_cost": 0.0, "duration_mins": 60, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 0.5, "relaxation_score": 0.1,
     "nightlife_score": 1.0, "nature_score": 0.0, "food_score": 0.5},

    {"name": "Statue of Liberty & Ellis Island", "city": "New York", "category": "Historic Site",
     "avg_cost": 24.0, "duration_mins": 240, "indoor_outdoor": "both",
     "adventure_score": 0.3, "culture_score": 0.95, "relaxation_score": 0.3,
     "nightlife_score": 0.0, "nature_score": 0.4, "food_score": 0.1},

    {"name": "Brooklyn Bridge Walk", "city": "New York", "category": "Landmark",
     "avg_cost": 0.0, "duration_mins": 60, "indoor_outdoor": "outdoor",
     "adventure_score": 0.4, "culture_score": 0.6, "relaxation_score": 0.5,
     "nightlife_score": 0.1, "nature_score": 0.3, "food_score": 0.0},

    {"name": "Broadway Show", "city": "New York", "category": "Entertainment",
     "avg_cost": 120.0, "duration_mins": 150, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.3,
     "nightlife_score": 0.7, "nature_score": 0.0, "food_score": 0.1},

    {"name": "High Line Park", "city": "New York", "category": "Park",
     "avg_cost": 0.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.6, "relaxation_score": 0.7,
     "nightlife_score": 0.1, "nature_score": 0.6, "food_score": 0.3},

    {"name": "Chelsea Market & Food Hall", "city": "New York", "category": "Food & Drink",
     "avg_cost": 20.0, "duration_mins": 90, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 0.5, "relaxation_score": 0.4,
     "nightlife_score": 0.2, "nature_score": 0.0, "food_score": 1.0},

    {"name": "Museum of Modern Art (MoMA)", "city": "New York", "category": "Museum",
     "avg_cost": 30.0, "duration_mins": 150, "indoor_outdoor": "indoor",
     "adventure_score": 0.0, "culture_score": 1.0, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.0, "food_score": 0.1},

    {"name": "Rooftop Bars — Lower East Side", "city": "New York", "category": "Nightlife",
     "avg_cost": 40.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.3, "relaxation_score": 0.4,
     "nightlife_score": 1.0, "nature_score": 0.1, "food_score": 0.5},

    # ── BARCELONA (10 POIs) ───────────────────────────────────────────────────
    {"name": "Sagrada Família", "city": "Barcelona", "category": "Landmark",
     "avg_cost": 26.0, "duration_mins": 120, "indoor_outdoor": "both",
     "adventure_score": 0.2, "culture_score": 1.0, "relaxation_score": 0.4,
     "nightlife_score": 0.0, "nature_score": 0.2, "food_score": 0.0},

    {"name": "Park Güell", "city": "Barcelona", "category": "Park",
     "avg_cost": 10.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 0.8, "relaxation_score": 0.7,
     "nightlife_score": 0.0, "nature_score": 0.8, "food_score": 0.1},

    {"name": "Las Ramblas & Boqueria Market", "city": "Barcelona", "category": "Food & Drink",
     "avg_cost": 15.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.7, "relaxation_score": 0.4,
     "nightlife_score": 0.4, "nature_score": 0.1, "food_score": 1.0},

    {"name": "Gothic Quarter Walk", "city": "Barcelona", "category": "Neighbourhood",
     "avg_cost": 0.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.9, "relaxation_score": 0.5,
     "nightlife_score": 0.5, "nature_score": 0.1, "food_score": 0.6},

    {"name": "Barceloneta Beach", "city": "Barcelona", "category": "Beach",
     "avg_cost": 5.0, "duration_mins": 180, "indoor_outdoor": "outdoor",
     "adventure_score": 0.6, "culture_score": 0.2, "relaxation_score": 0.9,
     "nightlife_score": 0.5, "nature_score": 0.7, "food_score": 0.3},

    {"name": "Casa Batlló", "city": "Barcelona", "category": "Historic Site",
     "avg_cost": 35.0, "duration_mins": 90, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.4,
     "nightlife_score": 0.0, "nature_score": 0.1, "food_score": 0.0},

    {"name": "Picasso Museum", "city": "Barcelona", "category": "Museum",
     "avg_cost": 14.0, "duration_mins": 120, "indoor_outdoor": "indoor",
     "adventure_score": 0.0, "culture_score": 0.95, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.0, "food_score": 0.1},

    {"name": "Tablao Flamenco Show", "city": "Barcelona", "category": "Entertainment",
     "avg_cost": 55.0, "duration_mins": 90, "indoor_outdoor": "indoor",
     "adventure_score": 0.2, "culture_score": 0.9, "relaxation_score": 0.3,
     "nightlife_score": 0.8, "nature_score": 0.0, "food_score": 0.5},

    {"name": "Montjuïc Hill & Castle", "city": "Barcelona", "category": "Landmark",
     "avg_cost": 9.0, "duration_mins": 150, "indoor_outdoor": "outdoor",
     "adventure_score": 0.4, "culture_score": 0.7, "relaxation_score": 0.7,
     "nightlife_score": 0.1, "nature_score": 0.7, "food_score": 0.1},

    {"name": "El Born Cocktail Bars", "city": "Barcelona", "category": "Nightlife",
     "avg_cost": 30.0, "duration_mins": 120, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 0.4, "relaxation_score": 0.4,
     "nightlife_score": 1.0, "nature_score": 0.0, "food_score": 0.5},

    # ── ROME (10 POIs) ────────────────────────────────────────────────────────
    {"name": "Colosseum & Roman Forum", "city": "Rome", "category": "Historic Site",
     "avg_cost": 18.0, "duration_mins": 180, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 1.0, "relaxation_score": 0.3,
     "nightlife_score": 0.0, "nature_score": 0.2, "food_score": 0.0},

    {"name": "Vatican Museums & Sistine Chapel", "city": "Rome", "category": "Museum",
     "avg_cost": 20.0, "duration_mins": 210, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.3,
     "nightlife_score": 0.0, "nature_score": 0.1, "food_score": 0.0},

    {"name": "Trevi Fountain & Surrounds", "city": "Rome", "category": "Landmark",
     "avg_cost": 0.0, "duration_mins": 60, "indoor_outdoor": "outdoor",
     "adventure_score": 0.1, "culture_score": 0.8, "relaxation_score": 0.5,
     "nightlife_score": 0.2, "nature_score": 0.2, "food_score": 0.3},

    {"name": "Borghese Gallery", "city": "Rome", "category": "Museum",
     "avg_cost": 15.0, "duration_mins": 120, "indoor_outdoor": "both",
     "adventure_score": 0.0, "culture_score": 0.95, "relaxation_score": 0.6,
     "nightlife_score": 0.0, "nature_score": 0.5, "food_score": 0.0},

    {"name": "Trastevere Neighbourhood", "city": "Rome", "category": "Neighbourhood",
     "avg_cost": 10.0, "duration_mins": 120, "indoor_outdoor": "outdoor",
     "adventure_score": 0.2, "culture_score": 0.7, "relaxation_score": 0.6,
     "nightlife_score": 0.7, "nature_score": 0.2, "food_score": 0.9},

    {"name": "Pantheon", "city": "Rome", "category": "Historic Site",
     "avg_cost": 5.0, "duration_mins": 60, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 1.0, "relaxation_score": 0.5,
     "nightlife_score": 0.0, "nature_score": 0.0, "food_score": 0.0},

    {"name": "Campo de' Fiori Market", "city": "Rome", "category": "Food & Drink",
     "avg_cost": 12.0, "duration_mins": 90, "indoor_outdoor": "outdoor",
     "adventure_score": 0.1, "culture_score": 0.6, "relaxation_score": 0.5,
     "nightlife_score": 0.6, "nature_score": 0.1, "food_score": 0.95},

    {"name": "Villa d'Este Day Trip (Tivoli)", "city": "Rome", "category": "Historic Site",
     "avg_cost": 14.0, "duration_mins": 240, "indoor_outdoor": "outdoor",
     "adventure_score": 0.3, "culture_score": 0.9, "relaxation_score": 0.8,
     "nightlife_score": 0.0, "nature_score": 0.8, "food_score": 0.1},

    {"name": "Piazza Navona Evening Stroll", "city": "Rome", "category": "Landmark",
     "avg_cost": 0.0, "duration_mins": 60, "indoor_outdoor": "outdoor",
     "adventure_score": 0.1, "culture_score": 0.7, "relaxation_score": 0.7,
     "nightlife_score": 0.5, "nature_score": 0.1, "food_score": 0.5},

    {"name": "Aperitivo & Wine Bars — Pigneto", "city": "Rome", "category": "Nightlife",
     "avg_cost": 18.0, "duration_mins": 120, "indoor_outdoor": "indoor",
     "adventure_score": 0.1, "culture_score": 0.4, "relaxation_score": 0.5,
     "nightlife_score": 1.0, "nature_score": 0.0, "food_score": 0.8},
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(POI).count()
        if existing >= len(POIS):
            print(f"Database already has {existing} POIs — skipping seed.")
            return

        db.query(POI).delete()
        for data in POIS:
            db.add(POI(**data))
        db.commit()
        print(f"Seeded {len(POIS)} POIs across 5 cities.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
