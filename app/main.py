from fastapi import FastAPI
from contextlib import asynccontextmanager
import db.db as db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.create_tables()
    yield

app = FastAPI(lifespan=lifespan)


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
