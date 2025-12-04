from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Lightning McFilm - User Service")


# Crear tablas SOLO cuando FastAPI arranca
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========================
# DEPENDENCIA JWT
# ========================
def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    print(f"TOKEN RECIBIDO: {token}")  # ← AÑADE ESTO
    
    payload = auth.verify_token(token)
    print(f"PAYLOAD DECODIFICADO: {payload}")  # ← AÑADE ESTO
    
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
    user_id = int(payload.get("sub"))
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

# ========================
# AUTENTICACIÓN
# ========================

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    hashed = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "message": "Usuario creado exitosamente",
        "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email}
    }

@app.post("/login")
def login_json(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    access_token = auth.create_access_token({"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }


@app.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    """
    Logout del usuario
    No necesita token porque el frontend ya lo borra
    Solo devuelve un mensaje épico
    """
    return {
        "message": "Sesión cerrada con estilo",
        "detail": "¡Vuelve pronto!",
        "status": "success"
    }

# ========================
# LISTAS: FAVORITOS, VISTAS, PENDIENTES
# ========================

# --- AÑADIR / QUITAR FAVORITO ---
@app.post("/favorites", status_code=status.HTTP_201_CREATED)
def add_favorite(
    fav: schemas.FavoriteCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Si ya existe → lo borramos (toggle)
    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.imdbID == fav.imdbID
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Eliminado de favoritos"}

    # Si no existe → lo añadimos
    new_fav = models.Favorite(**fav.dict(), user_id=current_user.id)
    db.add(new_fav)
    db.commit()
    return {"message": "Añadido a favoritos"}

# --- AÑADIR / QUITAR VISTA ---
@app.post("/watched", status_code=status.HTTP_201_CREATED)
def add_watched(
    item: schemas.WatchedCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Watched).filter(
        models.Watched.user_id == current_user.id,
        models.Watched.imdbID == item.imdbID
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Eliminado de vistas"}
    
    new_watched = models.Watched(**item.dict(), user_id=current_user.id)
    db.add(new_watched)
    db.commit()
    return {"message": "Marcado como vista"}


# --- AÑADIR / QUITAR PENDIENTE ---
@app.post("/watchlist")        # ← ¡AÑADE ESTA LÍNEA, JODER!
def add_to_watchlist(
    item: schemas.WatchlistCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Watchlist).filter(
        models.Watchlist.user_id == current_user.id,
        models.Watchlist.imdbID == item.imdbID
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Eliminado de pendientes", "added": False}

    new_item = models.Watchlist(**item.dict(), user_id=current_user.id)
    db.add(new_item)
    db.commit()
    return {"message": "Añadido a pendientes", "added": True}

# --- OBTENER TODAS LAS LISTAS ---
@app.get("/my-lists")
def get_my_lists(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    favorites = db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()
    watched = db.query(models.Watched).filter(models.Watched.user_id == current_user.id).all()
    watchlist = db.query(models.Watchlist).filter(models.Watchlist.user_id == current_user.id).all()

    return {
        "favorites": [f.__dict__ for f in favorites],
        "watched": [w.__dict__ for w in watched],
        "watchlist": [wl.__dict__ for wl in watchlist],
    }

