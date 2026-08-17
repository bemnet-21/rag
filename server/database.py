import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(
            dsn=DATABASE_URL,
            ssl="require" if "neon.tech" in DATABASE_URL else None
        )
        print("Connected to PostgreSQL database")

    async def disconnect(self):
        if self.pool:
            await self.pool.close()

db = Database()

async def get_db():
    async with db.pool.acquire() as connection:
        yield connection
