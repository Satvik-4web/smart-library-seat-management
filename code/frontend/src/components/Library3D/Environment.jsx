import React from 'react';

export function Bookshelf({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wood Frame */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.5, 2.5, 3]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>
      
      {/* Shelves */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.55, 0.05, 2.9]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.55, 0.05, 2.9]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[0.55, 0.05, 2.9]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>

      {/* Some fake books */}
      <mesh position={[0.1, 0.8, -0.5]}>
        <boxGeometry args={[0.3, 0.5, 0.8]} />
        <meshStandardMaterial color="#A52A2A" />
      </mesh>
      <mesh position={[0.1, 1.55, 0.5]}>
        <boxGeometry args={[0.3, 0.5, 1.2]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.1, 0.8, 0.8]}>
        <boxGeometry args={[0.3, 0.5, 0.4]} />
        <meshStandardMaterial color="#DAA520" />
      </mesh>
    </group>
  );
}

export function Plant({ position }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 1.2, 0.2]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#3CB371" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function WindowPanel({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Window Frame */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 4]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.05, 2.8, 3.8]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}
