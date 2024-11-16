from fastapi import FastAPI
from contextlib import asynccontextmanager
import db.db as db
from .team import team_router
from .analysis import analysis_router
from fastapi.middleware.cors import CORSMiddleware




@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.create_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(team_router)
app.include_router(analysis_router)

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=['*'],
	allow_headers=['*'],
)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}


@app.get("/check")
async def check_connection():
    res = await db.check_connection()
    if res is not None:
        return {"message": "Database is connected"}
    else:
        return {"message": "Database is not connected"}
    


