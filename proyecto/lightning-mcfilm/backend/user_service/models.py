from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# ========================================
# MODELOS DE USUARIO Y LISTAS
# ========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Relaciones (opcional, para futuro)
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    watched = relationship("Watched", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = {'extend_existing': True}  # ESTO ES LA CLAVE

    id = Column(Integer, primary_key=True, index=True)
    imdbID = Column(String(20), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    year = Column(String(10))
    poster = Column(String(1000))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="favorites")


class Watched(Base):
    __tablename__ = "watched"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    imdbID = Column(String(20), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    year = Column(String(10))
    poster = Column(String(1000))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="watched")


class Watchlist(Base):
    __tablename__ = "watchlist"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    imdbID = Column(String(20), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    year = Column(String(10))
    poster = Column(String(1000))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="watchlist")