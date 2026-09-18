import { syntheticSeats } from '../data/synthetic/seats';
import { syntheticSessions } from '../data/synthetic/sessions';
import { syntheticReservations } from '../data/synthetic/reservations';
import { syntheticMaintenance } from '../data/synthetic/maintenance';

/**
 * Initializes the seat state by merging the base seats with the relations.
 * This should ONLY be called when localStorage is empty, or when "Reset Demo" is triggered.
 */
export function initializeLibraryState() {
  // Deep clone to avoid mutating the base module arrays
  const seats = JSON.parse(JSON.stringify(syntheticSeats));

  seats.forEach(seat => {
    // 1. Check Maintenance
    const maintenance = syntheticMaintenance.find(m => m.seatId === seat.id);
    if (maintenance) {
      seat.status = 'Maintenance';
      return; // Skip further checks
    }

    // 2. Check Reservations
    const reservation = syntheticReservations.find(r => r.seatId === seat.id && r.status === 'active');
    if (reservation) {
      seat.status = 'Reserved';
      return;
    }

    // 3. Check Sessions
    const session = syntheticSessions.find(s => s.seatId === seat.id);
    if (session) {
      if (session.status === 'active') {
        seat.status = 'Occupied';
      } else if (session.status === 'away') {
        seat.status = 'Away';
      }
      seat.studentId = session.studentId;
      seat.startTime = session.startTime;
      seat.breakEndTime = session.breakEndTime;
      return;
    }

    // Default
    seat.status = 'Available';
  });

  return seats;
}
