from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models  # noqa: F401 — ensures models are registered before create_all
from app.routes import pois, trips, recommend, itinerary

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nomadis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pois.router)
app.include_router(trips.router)
app.include_router(recommend.router)
app.include_router(itinerary.router)


@app.get("/")
def root():
    return {"message": "Nomadis API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
