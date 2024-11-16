import psycopg
from psycopg.rows import dict_row
import uuid
import os

DATABASE_URL = os.getenv("DATABASE_URL")


async def get_connection():
    return await psycopg.AsyncConnection.connect(DATABASE_URL, row_factory=dict_row)


async def execute_query(query: str, *args):
    async with await get_connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute(query, args)
            if cur.description:
                return await cur.fetchall()
            await conn.commit()
            return None


async def check_connection():
    query = "SELECT 1"
    return await execute_query(query)


async def create_tables():
    try:
        query = "CREATE TABLE IF NOT EXISTS teams (id UUID PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL);"
        await execute_query(query)
        query = "CREATE TABLE IF NOT EXISTS members (id SERIAL PRIMARY KEY, name VARCHAR(255), birthdate DATE NOT NULL, team_id UUID NOT NULL, FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE);"
        await execute_query(query)
    except Exception as e:
        print("Error while creating tables", e)


async def add_team(name: str):
    id = uuid.uuid4()
    query = "INSERT INTO teams (id, name) VALUES (%s, %s);"
    await execute_query(query, id, name)
    return id


async def add_member(name: str, birthdate: str, team_id: uuid):
    query = "INSERT INTO members (name, birthdate, team_id) VALUES (%s, %s, %s);"
    await execute_query(query, name, birthdate, team_id)
