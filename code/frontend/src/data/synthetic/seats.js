export const syntheticSeats = [
  // Floor 2 - 40 seats total
  // Clean, architectural deterministic layout centered around (0,0)

  // Silent Study (10 seats) - Top Left
  // 2 rows of 5
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `S-${(i + 1).toString().padStart(2, '0')}`,
    floor: 2,
    zone: 'Silent Study',
    type: 'Individual',
    hasPower: true,
    nearWindow: i < 5, // Top row near window
    x: -9 + ((i % 5) * 2), // -9, -7, -5, -3, -1
    y: 0,
    z: -6 + (Math.floor(i / 5) * 2) // -6, -4
  })),

  // General Study (15 seats) - Top Right
  // 3 rows of 5
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `B-${(i + 1).toString().padStart(2, '0')}`,
    floor: 2,
    zone: 'General Study',
    type: 'Individual',
    hasPower: i % 2 === 0,
    nearWindow: i < 5,
    x: 2 + ((i % 5) * 2), // 2, 4, 6, 8, 10
    y: 0,
    z: -6 + (Math.floor(i / 5) * 2) // -6, -4, -2
  })),

  // Group Study (10 seats) - Bottom Left
  // 2 rows of 5 (Can represent 2 long collaborative tables)
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `G-${(i + 1).toString().padStart(2, '0')}`,
    floor: 2,
    zone: 'Group Study',
    type: 'Collaborative',
    hasPower: true,
    nearWindow: false,
    x: -9 + ((i % 5) * 2), // -9, -7, -5, -3, -1
    y: 0,
    z: 3 + (Math.floor(i / 5) * 2) // 3, 5
  })),

  // Reading Area (5 seats) - Bottom Right
  // 1 row of 5 comfortable lounge seats
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `R-${(i + 1).toString().padStart(2, '0')}`,
    floor: 2,
    zone: 'Reading Area',
    type: 'Lounge',
    hasPower: false,
    nearWindow: false,
    x: 2 + ((i % 5) * 2), // 2, 4, 6, 8, 10
    y: 0,
    z: 4 // 4
  }))
];
