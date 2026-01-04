from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class FavoriteCreate(BaseModel):
    imdbID: str
    title: str
    year: str
    poster: str

class UserLogin(BaseModel):
    email: str
    password: str

class FavoriteCreate(BaseModel):
    imdbID: str
    title: str
    year: str
    poster: str

class WatchedCreate(BaseModel):
    imdbID: str
    title: str
    year: str
    poster: str

class WatchlistCreate(BaseModel):
    imdbID: str
    title: str
    year: str
    poster: str