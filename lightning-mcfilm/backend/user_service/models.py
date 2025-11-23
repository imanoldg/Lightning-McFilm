from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import SessionLocal, engine, Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    favorites = relationship("Favorite", back_populates="user")

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    imdbID = Column(String(20), nullable=False)
    title = Column(String(200))
    year = Column(String(10))
    poster = Column(String(500))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="favorites")