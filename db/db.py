import psycopg
from psycopg.rows import dict_row
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
