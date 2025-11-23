from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, auth
from .database import SessionLocal, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lightning McFilm - User Service")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(400, "Email ya registrado")
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return schemas.UserOut(id=db_user.id, name=db_user.name, email=db_user.email)

@app.post("/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not auth.verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/favorites")
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