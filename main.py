from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine  # Aapki database file se engine import ho raha hai
import routes  # Aapki saari tables aur routes isi mein hain

# 🔥 IMPORTANT FIX: Hum check kar rahe hain ki Base kahan se milega
# Agar Base database.py mein hai toh wahan se uthayega, agar routes mein hai toh wahan se.
try:
    from database import Base
except ImportError:
    from routes import Base

app = FastAPI()

#
Base.metadata.create_all(bind=engine)

# CORS setup (taaki aapka React frontend backend se bina error ke baat kar sake)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Aapka frontend localhost:5173 isme cover ho jayega
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Aapke saare endpoints/api routes ko load karne ke liye
app.include_router(routes.router)

@app.get("/")
def home():
    return {"message": "LMS Backend is running successfully on Railway!"}