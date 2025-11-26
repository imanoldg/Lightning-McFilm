from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models
import schemas
import auth
from database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lightning McFilm - User Service")

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

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Registro simple con JSON - devuelve 201 con datos del usuario
    """
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(400, "Email ya registrado")
    
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # ✅ Devuelve solo el objeto, el status_code se define en el decorador
    return {
        "message": "Usuario creado exitosamente",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

@app.post("/login")
def login_json(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    
    access_token = auth.create_access_token({"sub": str(user.id)})
    
    # ✅ Solo devuelve el objeto
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }

@app.post("/favorites", status_code=status.HTTP_201_CREATED)
def add_favorite(fav: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    # Aquí más adelante pondremos JWT para saber quién es el usuario
    # Por ahora, lo añadimos al usuario 1 (pruebas)
    db_fav = models.Favorite(**fav.dict(), user_id=1)
    db.add(db_fav)
    db.commit()
    return {"message": "Añadido a favoritos"}

@app.get("/favorites")
def get_favorites(db: Session = Depends(get_db)):
    favs = db.query(models.Favorite).filter(models.Favorite.user_id == 1).all()
    return favs