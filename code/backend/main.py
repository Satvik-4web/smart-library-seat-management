from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Smart Library Seat Management API")

class Seat(BaseModel):
    id: str
    status: str # available, occupied, temporarily_away

# Dummy database
seats_db = {
    "A1": Seat(id="A1", status="available"),
    "A2": Seat(id="A2", status="occupied"),
    "A3": Seat(id="A3", status="temporarily_away"),
}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Seat Management API"}

@app.get("/seats", response_model=List[Seat])
def get_seats():
    return list(seats_db.values())

@app.post("/seats/{seat_id}/occupy")
def occupy_seat(seat_id: str):
    if seat_id in seats_db:
        seats_db[seat_id].status = "occupied"
        return seats_db[seat_id]
    return {"error": "Seat not found"}

@app.post("/seats/{seat_id}/break")
def take_break(seat_id: str):
    if seat_id in seats_db:
        seats_db[seat_id].status = "temporarily_away"
        return seats_db[seat_id]
    return {"error": "Seat not found"}

@app.post("/seats/{seat_id}/release")
def release_seat(seat_id: str):
    if seat_id in seats_db:
        seats_db[seat_id].status = "available"
        return seats_db[seat_id]
    return {"error": "Seat not found"}
