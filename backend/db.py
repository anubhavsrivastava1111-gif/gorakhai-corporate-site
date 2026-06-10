import os
from motor.motor_asyncio import AsyncIOMotorClient

_client: AsyncIOMotorClient = None
_db = None


def init_db():
    global _client, _db
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    _client = AsyncIOMotorClient(mongo_url)
    _db = _client[db_name]


def get_db():
    return _db


def close_db():
    if _client:
        _client.close()
