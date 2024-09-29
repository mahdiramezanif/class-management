from sqlalchemy import create_engine, Column, String, Integer, Date
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from datetime import date
from pydantic import BaseModel

db_url = "postgresql://root:OKaitVPJFl73zKwYMO2sY8Xz@lessen:5432/postgres"
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
class QueryModel(BaseModel):
    message: str
    name: str
    good: int
    start: date
    end: date

class UserBaseModel(BaseModel):
    name: str
    password: str

class NoteBaseModel(BaseModel):
    message: str
    good: int
    data: date
    name: str

class user(Base):
    __tablename__ = "users"
    name = Column(String, primary_key=True)
    password = Column(String)

class note(Base):
    __tablename__ = "note"
    message = Column(String, primary_key=True)
    good = Column(Integer)
    data = Column(Date, primary_key=True)
    name = Column(String, primary_key=True)