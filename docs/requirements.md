# System Requirements

## Core User Flow
Every student must scan their college ID card before entering the library.
After scanning the ID:
1. The system identifies/authenticates the student.
2. The student can see the current library occupancy.
3. The student can view an interactive map/floor plan of the library.
4. Every seat on the map has a live status.
5. The student can select an available seat.
6. The selected seat becomes associated with that student's active library session.
7. The student studies normally.
8. If the student needs to temporarily leave, they can activate a **Temporary Away / Break Permit**.
9. The temporary-away period has a configurable maximum duration (initially **30 minutes**).
10. The student receives a countdown and warning before the permit expires.
11. If the student returns within the allowed period, they can continue using the seat.
12. If the time expires, the system can automatically release the seat according to library policy.
13. When the student leaves the library permanently, they scan their ID at the exit and their session ends.
14. Their seat is released and becomes available to other students.

## Seat States
* 🟢 **Available**
* 🔴 **Occupied** (Identity hidden from other students)
* 🟡 **Temporarily Away**
* 🔵 **Reserved**
* ⚫ **Unavailable / Maintenance**

## Features

### Temporary Away / Lunch System
Students can select "Take a Break" to lock their seat for a short configurable time (e.g., 30 mins) with a countdown timer. 

### No-Show Protection
Short check-in window (e.g., 5 mins) to confirm the seat. If they fail to check in, the reservation expires.

### Smart Seat Finder
Users can specify preferences (quiet area, power outlet, window) and get AI-ranked recommendations.

### Group Seating
Request multiple seats together (e.g., "Find 4 seats together").

### Waitlist
Join a waitlist for full zones and get notified when seats become available.

### Personal Library Dashboard
View past usage, total study time, favorite zones, etc.

### Admin / Librarian Dashboard
Live overview of total/occupied/available seats. Manage policies, maintenance tickets, and view analytics.

### Analytics & Occupancy Prediction
Collect usage data (peak hours, seat utilization). Use historical data to predict future occupancy.

### Fairness & Resource Allocation
Prevent monopolizing of prime seats.

### Abandoned Seat Detection & Maintenance
Release seats automatically if marked away too long. Students can report maintenance issues (broken chairs, etc.).

## Future Scope
- **IoT Integration**: Physical occupancy sensors to check against digital status.
- **Digital Twin**: 3D interactive model of the library.
