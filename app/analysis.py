from fastapi import APIRouter
import random
from .models import Tarot

analysis_router = APIRouter(
    prefix="/analysis",
    tags=["analysis"]
)


@analysis_router.get("/tarot", response_model=Tarot)
async def tarot():
    try:
        card_num = random.randint(0, 21)
        card_file = open("db/cards.txt", "r")
        lines = card_file.readlines()
        for line in lines:
            if line.startswith(str(card_num)):
                card = line.split(":")
                tarot = Tarot(num=card_num, name=card[1], meaning=card[2])
                return tarot
    except Exception as e:
        return {"status": 500, "message": str(e)}
