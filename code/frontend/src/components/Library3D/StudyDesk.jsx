import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

export function StudyDesk({ seat, isSelected, isDimmed, onSelect, position, rotation = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);
  const indicatorRef = useRef();
  
  const isAvailable = seat.status === 'Available';
  
  // Status Colors
  const colors = {
    Available: '#10B981', // green
    Occupied: '#EF4444', // red
    Away: '#F59E0B', // amber
    Reserved: '#3B82F6', // blue
    Maintenance: '#9CA3AF' // grey
  };
  const statusColor = colors[seat.status] || '#9CA3AF';

  // Subtle pulse animation for available marker
  useFrame(({ clock }) => {
    if (isAvailable && indicatorRef.current && !isDimmed) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.1;
      indicatorRef.current.scale.set(scale, scale, scale);
    }
  });

  const isFocus = isSelected || hovered;
  const chairLift = isFocus && !isDimmed ? 0.08 : 0;

  return (
    <group 
      position={position} 
      rotation={rotation}
      onPointerOver={(e) => {
        if (isDimmed) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        if (isDimmed) return;
        e.stopPropagation();
        onSelect(seat);
      }}
    >
      <group opacity={isDimmed ? 0.2 : 1} transparent={isDimmed}>
        
        {/* --- DESK GEOMETRY --- */}
        {/* Tabletop (Thin, elegant wood) */}
        <mesh position={[0, 0.75, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.03, 0.7]} />
          <meshStandardMaterial color="#D4A373" roughness={0.7} /> {/* Light warm wood */}
        </mesh>
        
        {/* Desk Legs (Thin dark metal) */}
        <mesh position={[-0.65, 0.375, -0.6]} castShadow><boxGeometry args={[0.03, 0.75, 0.03]} /><meshStandardMaterial color="#374151" metalness={0.6} /></mesh>
        <mesh position={[0.65, 0.375, -0.6]} castShadow><boxGeometry args={[0.03, 0.75, 0.03]} /><meshStandardMaterial color="#374151" metalness={0.6} /></mesh>
        <mesh position={[-0.65, 0.375, -0.05]} castShadow><boxGeometry args={[0.03, 0.75, 0.03]} /><meshStandardMaterial color="#374151" metalness={0.6} /></mesh>
        <mesh position={[0.65, 0.375, -0.05]} castShadow><boxGeometry args={[0.03, 0.75, 0.03]} /><meshStandardMaterial color="#374151" metalness={0.6} /></mesh>

        {/* Optional Power Outlet Detail */}
        {seat.hasPower && (
          <mesh position={[0.5, 0.77, -0.1]}>
            <boxGeometry args={[0.1, 0.02, 0.08]} />
            <meshStandardMaterial color="#1F2937" />
          </mesh>
        )}

        {/* --- CHAIR GEOMETRY (Modern, compact, neutral) --- */}
        <group position={[0, chairLift, 0.3]}>
          {/* Seat Cushion */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.05, 0.4]} />
            <meshStandardMaterial color="#4B5563" roughness={0.9} /> {/* Neutral grey/charcoal */}
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.75, 0.2]} castShadow receiveShadow rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.4, 0.3, 0.04]} />
            <meshStandardMaterial color="#4B5563" roughness={0.9} />
          </mesh>
          {/* Center Post / Base */}
          <mesh position={[0, 0.225, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#1F2937" metalness={0.8} />
          </mesh>
          {/* Legs (Star base approximation) */}
          <mesh position={[0, 0.02, 0]} castShadow rotation={[0, Math.PI/4, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#1F2937" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow rotation={[0, -Math.PI/4, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#1F2937" metalness={0.8} />
          </mesh>

          {/* --- HIGHLIGHT / SELECTION OUTLINE --- */}
          {isFocus && !isDimmed && (
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, 0.48, 32]} />
              <meshBasicMaterial color={statusColor} transparent opacity={isSelected ? 0.8 : 0.4} side={THREE.DoubleSide} />
            </mesh>
          )}

          {/* --- STATUS MARKER (Floating Orb) --- */}
          {!isDimmed && (
            <group position={[0, 1.1, 0]}>
              <mesh ref={indicatorRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={statusColor} />
              </mesh>
              {/* Subtle halo for selected or available */}
              {(isSelected || isAvailable) && (
                <mesh>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color={statusColor} transparent opacity={0.2} />
                </mesh>
              )}
            </group>
          )}

          {/* --- SMALL ID LABEL (Appears on Hover/Select) --- */}
          {!isDimmed && isFocus && (
            <Html position={[0, 1.4, 0]} center zIndexRange={[100, 0]} distanceFactor={10}>
              <div className="bg-white/95 backdrop-blur px-2.5 py-1.5 rounded shadow-lg border border-zinc-200 pointer-events-none flex flex-col items-center">
                <span className="font-mono font-bold text-zinc-900 text-sm leading-none">{seat.id}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: statusColor }}>
                  {seat.status}
                </span>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}
