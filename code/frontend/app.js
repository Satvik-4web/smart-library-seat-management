const API_URL = "http://localhost:8000";

async function fetchSeats() {
    try {
        const response = await fetch(`${API_URL}/seats`);
        if (!response.ok) throw new Error("API not reachable");
        const seats = await response.json();
        renderSeats(seats);
    } catch (error) {
        console.error("Error fetching seats, using fallback mock data.");
        // Fallback mock data if backend isn't running
        renderSeats([
            {id: "A1", status: "available"},
            {id: "A2", status: "occupied"},
            {id: "A3", status: "temporarily_away"}
        ]);
    }
}

function renderSeats(seats) {
    const map = document.getElementById("seat-map");
    map.innerHTML = "";
    seats.forEach(seat => {
        const div = document.createElement("div");
        div.className = `seat ${seat.status}`;
        div.innerText = `${seat.id}\n(${seat.status.replace('_', ' ')})`;
        if (seat.status === "available") {
            div.onclick = () => occupySeat(seat.id);
        } else if (seat.status === "temporarily_away") {
            div.onclick = () => releaseSeat(seat.id);
        }
        map.appendChild(div);
    });
}

async function occupySeat(id) {
    try {
        await fetch(`${API_URL}/seats/${id}/occupy`, {method: "POST"});
    } catch(e) {}
    fetchSeats();
}

async function releaseSeat(id) {
    try {
        await fetch(`${API_URL}/seats/${id}/release`, {method: "POST"});
    } catch(e) {}
    fetchSeats();
}

// Initial load
fetchSeats();
