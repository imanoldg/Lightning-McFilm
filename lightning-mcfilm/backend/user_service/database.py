from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

# Docker Compose debe proveer explícitamente esta variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("ERROR: DATABASE_URL no está definido en el entorno")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True  # <- evita errores de "connection refused" temporales
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
