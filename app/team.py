from fastapi import APIRouter
import db.db as db
from .models import Member

team_router = APIRouter(
    prefix="/team",
    tags=["team"]
)


@team_router.post("/create_team")
async def create_team(name: str, members: list[Member]):
    try:
        team_id = await db.add_team(name)
        for member in members:
            await db.add_member(team_id=team_id, name=member.name, birthdate=member.birthdate)
        return {"status": 200, "team_id": team_id}
    except Exception as e:
        return {"status": 500, "message": str(e)}
