from fastapi import FastAPI
import db.db as db

app = FastAPI()


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
