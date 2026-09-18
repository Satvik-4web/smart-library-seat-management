import React from 'react';
import { Text } from '@react-three/drei';
import { StudyDesk } from './StudyDesk';

function ArchitecturalSign({ text, position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 0.6]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.9} />
      </mesh>
      <Text 
        position={[0, 0.03, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#4B5563"
        fontWeight="bold"
        letterSpacing={0.1}
      >
        {text}
      </Text>
    </group>
  );
}

function PottedPlant({ position }) {
  return (
    <group position={position}>
      {/* Sleek modern planter */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.6, 32]} />
        <meshStandardMaterial color="#374151" roughness={0.7} />
      </mesh>
      {/* Stylized geometric foliage */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Bookshelf({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation} castShadow receiveShadow>
      {/* Wood Frame */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[3, 2.8, 0.6]} />
        <meshStandardMaterial color="#D4A373" roughness={0.9} />
      </mesh>
      {/* Dark interior / books block */}
      <mesh position={[0, 1.4, 0.25]}>
        <boxGeometry args={[2.8, 2.6, 0.2]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function LibraryFloor({ positionedSeats, selectedSeatId, onSelectSeat, isMatch, hasActiveFilters }) {
  return (
    <group>
      {/* --- ARCHITECTURE --- */}
      
      {/* Main Floor (Light Warm Stone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color="#FAFAF9" roughness={0.8} />
      </mesh>

      {/* Subtle Zone Flooring (Carpets) */}
      {/* Silent Study */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.01, -5]} receiveShadow>
        <planeGeometry args={[11, 4]} />
        <meshStandardMaterial color="#F5F5F4" roughness={1.0} />
      </mesh>
      {/* General Study */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, -4]} receiveShadow>
        <planeGeometry args={[11, 6]} />
        <meshStandardMaterial color="#F5F5F4" roughness={1.0} />
      </mesh>
      {/* Group Study */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.01, 4]} receiveShadow>
        <planeGeometry args={[11, 4]} />
        <meshStandardMaterial color="#F5F5F4" roughness={1.0} />
      </mesh>
      {/* Reading Area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, 4]} receiveShadow>
        <planeGeometry args={[11, 4]} />
        <meshStandardMaterial color="#F5F5F4" roughness={1.0} />
      </mesh>

      {/* --- WALLS --- */}
      {/* Low Left Wall */}
      <mesh position={[-13, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 2, 18]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.9} />
      </mesh>
      {/* Low Bottom Wall with Entrance Gap */}
      <mesh position={[-7.5, 1, 9]} receiveShadow castShadow>
        <boxGeometry args={[11.4, 2, 0.4]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.9} />
      </mesh>
      <mesh position={[7.5, 1, 9]} receiveShadow castShadow>
        <boxGeometry args={[11.4, 2, 0.4]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[13, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 2, 18]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.9} />
      </mesh>
      
      {/* Top Window Wall (Large vertical panels, soft blue glass) */}
      <group position={[0, 1.5, -9]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[26, 3, 0.2]} />
          <meshStandardMaterial color="#BAE6FD" transparent opacity={0.3} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Window Frames */}
        {[-13, -8, -3, 2, 7, 13].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.2, 3, 0.3]} />
            <meshStandardMaterial color="#9CA3AF" />
          </mesh>
        ))}
      </group>

      {/* --- ENVIRONMENT / DECOR --- */}
      
      {/* Entrance Check-in (Bottom Center Gap) */}
      <mesh position={[0, 0.6, 8.5]} castShadow>
        <boxGeometry args={[2.5, 1.2, 0.6]} />
        <meshStandardMaterial color="#4B5563" roughness={0.7} />
      </mesh>

      {/* Plants (Sparse, strategic) */}
      <PottedPlant position={[-12, 0, -8]} /> {/* Top Left Corner */}
      <PottedPlant position={[12, 0, -8]} /> {/* Top Right Corner */}
      <PottedPlant position={[12, 0, 8]} /> {/* Bottom Right Corner */}
      <PottedPlant position={[-3, 0, 0]} /> {/* Near central walkway */}

      {/* Bookshelves in Reading Area (Right wall) */}
      <Bookshelf position={[12, 0, 4]} rotation={[0, -Math.PI/2, 0]} />
      <Bookshelf position={[12, 0, 1]} rotation={[0, -Math.PI/2, 0]} />

      {/* --- ARCHITECTURAL SIGNAGE --- */}
      <ArchitecturalSign text="SILENT STUDY" position={[-5, 0, -7.5]} />
      <ArchitecturalSign text="GENERAL STUDY" position={[6, 0, -7.5]} />
      <ArchitecturalSign text="GROUP STUDY" position={[-5, 0, 1.5]} />
      <ArchitecturalSign text="READING AREA" position={[6, 0, 1.5]} />

      {/* --- SEATS --- */}
      {positionedSeats.map(seat => {
        const matchesFilter = !hasActiveFilters || isMatch(seat);
        const shouldDim = hasActiveFilters && !matchesFilter;

        // Group study logic: 
        // Desks in group study (Z=3, Z=5) face each other
        let rot = [0, 0, 0]; 
        if (seat.zone === 'Group Study') {
          if (seat.z === 3) rot = [0, 0, 0]; // Face South (away from center)
          if (seat.z === 5) rot = [0, Math.PI, 0]; // Face North (towards Z=3)
        } else if (seat.zone === 'Reading Area') {
          rot = [0, Math.PI/2, 0]; // Face left towards center walkway
        } else if (seat.zone === 'Silent Study') {
          rot = [0, Math.PI, 0]; // Face North (towards windows)
        }

        return (
          <StudyDesk 
            key={seat.id}
            seat={seat}
            position={seat.layoutPos}
            rotation={rot}
            isSelected={selectedSeatId === seat.id}
            isDimmed={shouldDim}
            onSelect={onSelectSeat}
          />
        );
      })}
    </group>
  );
}
