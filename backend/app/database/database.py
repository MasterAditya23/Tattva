from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Creates a file named tattva.db in the root of the backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./tattva.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
