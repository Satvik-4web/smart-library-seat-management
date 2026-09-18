export const initialSeats = [
  // Floor 1 - Silent Zone
  ...Array.from({ length: 12 }).map((_, i) => {
    const id = `A${(i + 1).toString().padStart(2, '0')}`;
    return {
      id,
      floor: 1,
      zone: 'Silent Zone',
      status: i === 2 ? 'Occupied' : i === 7 ? 'Away' : i === 11 ? 'Maintenance' : 'Available',
      hasPower: i % 2 === 0,
      nearWindow: i < 6,
    };
  }),
  // Floor 1 - General Study Zone
  ...Array.from({ length: 18 }).map((_, i) => {
    const id = `B${(i + 1).toString().padStart(2, '0')}`;
    return {
      id,
      floor: 1,
      zone: 'General Study Zone',
      status: i === 5 ? 'Reserved' : i === 10 ? 'Occupied' : 'Available',
      hasPower: true,
      nearWindow: i > 12,
    };
  }),
  // Floor 2 - Collaborative Zone
  ...Array.from({ length: 10 }).map((_, i) => {
    const id = `C${(i + 1).toString().padStart(2, '0')}`;
    return {
      id,
      floor: 2,
      zone: 'Collaborative Zone',
      status: i % 3 === 0 ? 'Occupied' : 'Available',
      hasPower: true,
      nearWindow: false,
    };
  })
];
