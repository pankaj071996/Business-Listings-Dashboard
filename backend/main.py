
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, Base, get_db
from models import Listing
from schemas import BulkListingCreate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Business Listings API",
    description="Business Listings Dashboard Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Business Listings API is running"}

@app.post("/api/listings/bulk")
def bulk_insert(payload: BulkListingCreate, db: Session = Depends(get_db)):
    try:
        if not payload.listings:
            raise HTTPException(status_code=400, detail="No listings provided")

        records = [Listing(**item.model_dump()) for item in payload.listings]
        db.add_all(records)
        db.commit()

        return {
            "message": "Listings inserted successfully",
            "inserted_count": len(records)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    return {
        "total_businesses": db.query(Listing).count(),
        "total_cities": db.query(func.count(func.distinct(Listing.city))).scalar(),
        "total_categories": db.query(func.count(func.distinct(Listing.category))).scalar(),
        "total_sources": db.query(func.count(func.distinct(Listing.source))).scalar()
    }

@app.get("/api/dashboard/city-wise")
def city_wise(db: Session = Depends(get_db)):
    results = (
        db.query(Listing.city, func.count(Listing.id).label("count"))
        .filter(Listing.city.isnot(None))
        .group_by(Listing.city)
        .order_by(func.count(Listing.id).desc())
        .all()
    )
    return [{"city": row.city, "count": row.count} for row in results]

@app.get("/api/dashboard/category-wise")
def category_wise(db: Session = Depends(get_db)):
    results = (
        db.query(Listing.category, func.count(Listing.id).label("count"))
        .filter(Listing.category.isnot(None))
        .group_by(Listing.category)
        .order_by(func.count(Listing.id).desc())
        .all()
    )
    return [{"category": row.category, "count": row.count} for row in results]

@app.get("/api/dashboard/source-wise")
def source_wise(db: Session = Depends(get_db)):
    results = (
        db.query(Listing.source, func.count(Listing.id).label("count"))
        .filter(Listing.source.isnot(None))
        .group_by(Listing.source)
        .order_by(func.count(Listing.id).desc())
        .all()
    )
    return [{"source": row.source, "count": row.count} for row in results]

@app.get("/api/listings")
def get_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    limit = min(max(limit, 1), 500)
    return (
        db.query(Listing)
        .order_by(Listing.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
