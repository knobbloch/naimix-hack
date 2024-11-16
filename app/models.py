from pydantic import BaseModel
from typing import Optional
from datetime import date


class Member(BaseModel):
    name: Optional[str] = None
    birthdate: date


class Tarot(BaseModel):
    num: int
    name: str
    meaning: str
