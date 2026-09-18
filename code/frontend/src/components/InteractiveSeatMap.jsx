import React, { Suspense, useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';

// ============================================================================
// 1. SceneLighting Component (Photorealistic Shadows)
// ============================================================================
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight 
        position={[20, 40, 20]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
    </>
  );
}

// ============================================================================
// 2. LibraryArchitecture Component (Premium Diorama Base)
// ============================================================================
function LibraryArchitecture() {
  return (
    <group>
      {/* Centered Main Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
      </mesh>

      {/* Ultra-thin Zone Rugs (Subtle visual separation) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.01, -4.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#d4d4d4" roughness={1.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, -4.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#d4d4d4" roughness={1.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.01, 3.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#d4d4d4" roughness={1.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.01, 3.5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#d4d4d4" roughness={1.0} />
      </mesh>

      {/* Low-poly Half Walls (Height 1.5, to prevent clipping) */}
      <mesh position={[-13, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.5, 18]} />
        <meshStandardMaterial color="#fafaf9" />
      </mesh>
      <mesh position={[13, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.5, 18]} />
        <meshStandardMaterial color="#fafaf9" />
      </mesh>
      <mesh position={[0, 0.75, 9]} receiveShadow castShadow>
        <boxGeometry args={[26, 1.5, 0.4]} />
        <meshStandardMaterial color="#fafaf9" />
      </mesh>
      <mesh position={[0, 0.75, -9]} receiveShadow castShadow>
        <boxGeometry args={[26, 1.5, 0.4]} />
        <meshStandardMaterial color="#fafaf9" />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3. SeatNode Component (Premium Desks + UI HTML Badges)
// ============================================================================
function SeatNode({ seat, isSelected, isDimmed, onSelect }) {
  const isAvailable = seat.status === 'Available';
  const isOccupied = seat.status === 'Occupied';
  
  let badgeColors = "bg-emerald-500/80 text-white border-emerald-400";
  let statusIcon = "✓";
  if (isOccupied) {
    badgeColors = "bg-red-500/80 text-white border-red-400";
    statusIcon = "👤";
  } else if (seat.status === 'Away') {
    badgeColors = "bg-amber-500/80 text-white border-amber-400";
    statusIcon = "⏱";
  } else if (seat.status === 'Reserved') {
    badgeColors = "bg-blue-500/80 text-white border-blue-400";
    statusIcon = "🔒";
  } else if (seat.status === 'Maintenance') {
    badgeColors = "bg-zinc-500/80 text-white border-zinc-400";
    statusIcon = "🔧";
  }

  // Handle group study desk rotation logic based on the dataset coordinates
  let rot = [0, 0, 0]; 
  if (seat.zone === 'Group Study') {
    if (seat.z === 3) rot = [0, 0, 0];
    if (seat.z === 5) rot = [0, Math.PI, 0];
  } else if (seat.zone === 'Reading Area') {
    rot = [0, Math.PI/2, 0];
  } else if (seat.zone === 'Silent Study') {
    rot = [0, Math.PI, 0];
  }

  // Ensure feet touch ground precisely
  return (
    <group 
      position={[seat.x, 0, seat.z]} 
      rotation={rot}
      onClick={(e) => {
        if (isDimmed) return;
        e.stopPropagation();
        onSelect(seat);
      }}
      onPointerOver={(e) => {
        if (isDimmed) return;
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      <group opacity={isDimmed ? 0.2 : 1} transparent={isDimmed}>
        
        {/* Floating HTML UI Badge */}
        {!isDimmed && (
          <Html position={[0, 2.5, 0]} center zIndexRange={[100, 0]} distanceFactor={15}>
            <div className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg border transition-transform cursor-pointer",
              badgeColors,
              isSelected ? "ring-4 ring-white/50 scale-110" : "hover:scale-110"
            )}>
              <span className="text-xs font-bold shadow-sm">{statusIcon}</span>
              <span className="font-mono font-bold text-xs tracking-wide">{seat.id}</span>
            </div>
          </Html>
        )}

        {/* Premium Desk (Rich wood tone) */}
        <mesh position={[0, 0.75, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.05, 0.8]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
        
        {/* Legs touching the ground */}
        <mesh position={[-0.75, 0.375, -0.6]} castShadow><boxGeometry args={[0.04, 0.75, 0.04]} /><meshStandardMaterial color="#374151" /></mesh>
        <mesh position={[0.75, 0.375, -0.6]} castShadow><boxGeometry args={[0.04, 0.75, 0.04]} /><meshStandardMaterial color="#374151" /></mesh>
        <mesh position={[-0.75, 0.375, 0.05]} castShadow><boxGeometry args={[0.04, 0.75, 0.04]} /><meshStandardMaterial color="#374151" /></mesh>
        <mesh position={[0.75, 0.375, 0.05]} castShadow><boxGeometry args={[0.04, 0.75, 0.04]} /><meshStandardMaterial color="#374151" /></mesh>

        {/* Dark Charcoal Office Chair */}
        <group position={[0, isSelected ? 0.05 : 0, 0.4]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.08, 0.5]} />
            <meshStandardMaterial color="#1F2937" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0.2]} castShadow receiveShadow rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.45, 0.5, 0.05]} />
            <meshStandardMaterial color="#1F2937" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.225, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.8} />
          </mesh>
        </group>
        
        {/* Selected Ground Aura */}
        {isSelected && (
          <mesh position={[0, 0.01, 0.4]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ============================================================================
// 4. Main SeatMap Export
// ============================================================================
export default function InteractiveSeatMap({ seats, selectedSeatId, onSelectSeat, viewMode, setViewMode, activeFilters }) {
  const controlsRef = useRef();
  
  // List View State
  const [listSearch, setListSearch] = useState('');
  const [listSort, setListSort] = useState('Availability');

  // One-shot camera focus
  useEffect(() => {
    if (selectedSeatId && controlsRef.current && viewMode === '3d') {
      const seat = seats.find(s => s.id === selectedSeatId);
      if (seat && seat.x !== undefined) {
        const startTarget = controlsRef.current.target.clone();
        const startPos = controlsRef.current.object.position.clone();
        
        const endTarget = new THREE.Vector3(seat.x, 0, seat.z);
        // Focus slightly offset to clearly see the HTML badge
        const endPos = new THREE.Vector3(seat.x - 8, 12, seat.z + 10);
        
        let progress = 0;
        let animationFrameId;

        const animate = () => {
          progress += 0.03;
          if (progress <= 1) {
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            controlsRef.current.target.lerpVectors(startTarget, endTarget, easeProgress);
            controlsRef.current.object.position.lerpVectors(startPos, endPos, easeProgress);
            controlsRef.current.update();
            animationFrameId = requestAnimationFrame(animate);
          }
        };
        animate();

        return () => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, [selectedSeatId, seats, viewMode]);

  const isMatch = (seat) => {
    if (activeFilters.availableOnly && seat.status !== 'Available') return false;
    if (activeFilters.zone !== 'All' && seat.zone !== activeFilters.zone) return false;
    if (activeFilters.type !== 'All' && seat.type !== activeFilters.type) return false;
    if (activeFilters.nearWindow && !seat.nearWindow) return false;
    if (activeFilters.hasPower && !seat.hasPower) return false;
    return true;
  };
  const hasActiveFilters = activeFilters.availableOnly || activeFilters.zone !== 'All' || activeFilters.type !== 'All' || activeFilters.nearWindow || activeFilters.hasPower;

  // List View Fallback
  if (viewMode === 'list') {
    let listSeats = seats.filter(s => (!hasActiveFilters || isMatch(s)));
    
    // Apply local search
    if (listSearch.trim() !== '') {
      const q = listSearch.toLowerCase();
      listSeats = listSeats.filter(s => s.id.toLowerCase().includes(q));
    }

    // Apply local sort
    listSeats.sort((a, b) => {
      if (listSort === 'Availability') {
        const order = { 'Available': 1, 'Away': 2, 'Occupied': 3, 'Reserved': 4, 'Maintenance': 5 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      } else if (listSort === 'Zone') {
        return a.zone.localeCompare(b.zone);
      } else if (listSort === 'Seat Type') {
        return (a.type || '').localeCompare(b.type || '');
      }
      return a.id.localeCompare(b.id);
    });

    const floorAvailable = seats.filter(s => s.status === 'Available').length;

    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden rounded-xl border border-zinc-200">
        
        {/* List Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-b border-zinc-200 gap-4 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase">Floor {seats[0]?.floor} &middot; Directory</h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-bold">
              <span className="text-zinc-500">{seats.length} SEATS TOTAL</span>
              <span className="text-emerald-600">{floorAvailable} AVAILABLE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search seat (e.g. B-12)..." 
              value={listSearch}
              onChange={e => setListSearch(e.target.value)}
              className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#780000]"
            />
            <select 
              value={listSort}
              onChange={e => setListSort(e.target.value)}
              className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-bold text-zinc-700 focus:outline-none focus:border-[#780000]"
            >
              <option>Availability</option>
              <option>Seat ID</option>
              <option>Zone</option>
              <option>Seat Type</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-2">
          {listSeats.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-zinc-200 text-center">
              <h3 className="text-lg font-bold text-zinc-800 mb-2">No seats found</h3>
              <p className="text-sm text-zinc-500 mb-6">Try changing your search or filters.</p>
              <button 
                onClick={() => setListSearch('')}
                className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded transition-colors text-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            listSeats.map(seat => {
              const selected = selectedSeatId === seat.id;
              const isAvailable = seat.status === 'Available';
              const isOccupied = seat.status === 'Occupied';
              const isAway = seat.status === 'Away';
              
              let statusColor = isAvailable ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                                isOccupied ? "text-red-700 bg-red-50 border-red-200" :
                                isAway ? "text-amber-700 bg-amber-50 border-amber-200" :
                                seat.status === 'Reserved' ? "text-blue-700 bg-blue-50 border-blue-200" : "text-zinc-600 bg-zinc-100 border-zinc-300";
              
              let dotColor = isAvailable ? "bg-emerald-500" :
                             isOccupied ? "bg-red-500" :
                             isAway ? "bg-amber-500" :
                             seat.status === 'Reserved' ? "bg-blue-500" : "bg-zinc-500";

              return (
                <div 
                  key={seat.id}
                  onClick={() => {
                    onSelectSeat(seat);
                  }}
                  className={clsx(
                    "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                    selected ? "bg-red-50 border-[#780000] border-l-[6px] shadow-md ring-1 ring-[#780000]/20" : "bg-white border-zinc-200 border-l-[6px] border-l-transparent hover:border-zinc-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-6">
                    {/* ID and Status */}
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <span className="font-bold text-lg text-zinc-900 leading-none">{seat.id}</span>
                      <div className={clsx("flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border w-fit", statusColor)}>
                        <div className={clsx("w-1.5 h-1.5 rounded-full", dotColor)} />
                        {seat.status}
                      </div>
                    </div>
                    
                    {/* Details (Hidden on very small screens) */}
                    <div className="hidden sm:flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-zinc-700">{seat.zone}</span>
                      <span className="text-xs text-zinc-500">
                        {seat.type} &middot; {seat.nearWindow ? 'Window' : 'No Window'} &middot; {seat.hasPower ? 'Outlet' : 'No Outlet'}
                      </span>
                      {isAway && seat.breakEndTime && (
                        <span className="text-[10px] font-bold text-amber-600 mt-0.5">
                          Returns at {new Date(seat.breakEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 shrink-0">
                    {selected && setViewMode && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setViewMode('2d'); }}
                        className="px-3 py-1.5 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-xs font-bold rounded transition-colors"
                      >
                        VIEW ON MAP
                      </button>
                    )}
                    {isAvailable ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectSeat(seat); }}
                        className={clsx(
                          "px-4 py-1.5 text-xs font-bold rounded transition-colors border",
                          selected ? "bg-[#780000] text-white border-[#780000]" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        )}
                      >
                        {selected ? 'SELECTED' : 'SELECT SEAT'}
                      </button>
                    ) : (
                      <div className="px-4 py-1.5 text-xs font-bold text-zinc-400">
                        NOT AVAILABLE
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // 2D View Fallback (Spatial Architectural Floor Plan)
  if (viewMode === '2d') {
    return (
      <div className="w-full h-full bg-[#f4f4f5] overflow-auto relative flex items-center justify-center p-8">
        
        {/* Main Floor Plan Container */}
        <div 
          className="relative bg-white shadow-xl border-4 border-zinc-300 rounded-lg shrink-0"
          style={{ width: '800px', height: '600px' }}
        >
          {/* Windows (Top Edge) */}
          <div className="absolute top-0 left-0 w-full h-3 bg-blue-100 border-b-2 border-blue-200 flex justify-around items-center px-8">
            {[...Array(6)].map((_, i) => <div key={i} className="w-16 h-1.5 bg-blue-300/50 rounded-full" />)}
          </div>

          {/* Zones Backgrounds */}
          <div className="absolute top-12 left-12 w-[320px] h-[200px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded flex items-end p-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Silent Study</span>
          </div>
          <div className="absolute top-12 right-12 w-[320px] h-[200px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded flex items-end justify-end p-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">General Study</span>
          </div>
          <div className="absolute bottom-12 left-12 w-[320px] h-[200px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded flex items-start p-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Group Study</span>
          </div>
          <div className="absolute bottom-12 right-12 w-[320px] h-[200px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded flex items-start justify-end p-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reading Area</span>
          </div>

          {/* Center Walkway Marker */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 bg-zinc-100/50 border-x border-zinc-100 flex flex-col items-center justify-center opacity-50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest rotate-90 whitespace-nowrap">Main Walkway</span>
          </div>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 bg-zinc-100/50 border-y border-zinc-100 flex items-center justify-center opacity-50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Cross Walkway</span>
          </div>

          {/* Entrance */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-200 border-t-2 border-zinc-300 flex items-center justify-center rounded-t-lg">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Entrance</span>
          </div>

          {/* Bookshelves */}
          <div className="absolute bottom-16 right-4 w-6 h-32 bg-[#D4A373] border-2 border-[#8B5A2B] rounded-sm" />
          <div className="absolute bottom-16 right-12 w-6 h-32 bg-[#D4A373] border-2 border-[#8B5A2B] rounded-sm" />
          
          {/* Seats Rendering */}
          {seats.map(seat => {
            const matchesFilter = !hasActiveFilters || isMatch(seat);
            const shouldDim = hasActiveFilters && !matchesFilter;
            const selected = selectedSeatId === seat.id;
            
            // Map 3D coordinates (x:-13 to 13, z:-9 to 9) to 2D container (800x600)
            // Center is (400, 300). Scale factor: ~30px per unit
            const px = 400 + (seat.x * 28);
            const pz = 300 + (seat.z * 28);

            const isAvailable = seat.status === 'Available';
            const isOccupied = seat.status === 'Occupied';
            
            let statusColor = isAvailable ? "bg-emerald-500" :
                              isOccupied ? "bg-red-500" :
                              seat.status === 'Away' ? "bg-amber-500" :
                              seat.status === 'Reserved' ? "bg-blue-500" : "bg-zinc-500";
                              
            let deskColor = isAvailable ? "bg-[#d1bfae] border-[#8a6b52]" : "bg-zinc-200 border-zinc-300";

            // Handle 2D visual rotation to match 3D layout exactly
            let rotDegrees = 0;
            if (seat.zone === 'Group Study') {
              if (seat.z === 5) rotDegrees = 180;
            } else if (seat.zone === 'Reading Area') {
              rotDegrees = -90; // Note: 3D uses Math.PI/2 (90deg) but Y is flipped in 2D CSS vs 3D Z
            } else if (seat.zone === 'Silent Study') {
              rotDegrees = 180;
            }

            return (
              <div 
                key={seat.id}
                className={clsx(
                  "absolute flex flex-col items-center justify-center transition-all group",
                  shouldDim ? 'opacity-20 grayscale' : isAvailable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed',
                  selected ? 'z-20' : 'z-10'
                )}
                style={{ 
                  left: `${px}px`, 
                  top: `${pz}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  if (shouldDim || !isAvailable) return;
                  e.stopPropagation();
                  onSelectSeat(seat);
                }}
              >
                {/* Desk + Chair Container (Rotated) */}
                <div 
                  className="relative flex flex-col items-center gap-1"
                  style={{ transform: `rotate(${rotDegrees}deg)` }}
                >
                  {/* Desk Shape */}
                  <div className={clsx(
                    "w-10 h-6 border-b-4 rounded-sm shadow-sm flex items-center justify-center relative",
                    deskColor,
                    selected && "ring-4 ring-[#780000]/50 shadow-lg scale-110"
                  )}>
                    {/* Status Dot inside desk */}
                    <div className={clsx("w-2.5 h-2.5 rounded-full shadow-inner border border-white/50", statusColor)} />
                  </div>
                  
                  {/* Chair Shape */}
                  <div className={clsx(
                    "w-4 h-3 rounded-t-full border-t-2",
                    isAvailable ? "bg-zinc-600 border-zinc-700" : "bg-zinc-300 border-zinc-400"
                  )} />
                </div>

                {/* Floating Selection Label (Unrotated, directly in the wrapper) */}
                {selected && (
                  <div className="absolute -top-8 bg-[#780000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 flex flex-col items-center">
                    <span>{seat.id}</span>
                    <div className="absolute -bottom-1 w-2 h-2 bg-[#780000] rotate-45" />
                  </div>
                )}

                {/* Hover Tooltip (Unrotated) */}
                {!selected && !shouldDim && (
                  <div className="absolute -top-6 bg-zinc-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {seat.id} &middot; {seat.status}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const availableCount = seats.filter(s => s.status === 'Available').length;
  
  return (
    <div className="w-full h-full bg-[#e5e5e5] rounded-xl border border-zinc-200 overflow-hidden relative select-none">
      
      {/* Top Banner Stats Panel */}
      <div 
        className="absolute z-20 pointer-events-none"
        style={{ top: '20px', right: '20px', maxWidth: 'calc(100% - 40px)' }}
      >
        <div className="backdrop-blur-md bg-white/50 border border-white/40 shadow-xl rounded-2xl px-6 py-3 flex flex-wrap items-center gap-4 sm:gap-8 w-fit ml-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Location</span>
            <span className="font-bold text-zinc-900 whitespace-nowrap">Floor 2 &middot; General Study</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-zinc-400/30"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Capacity</span>
            <span className="font-mono font-bold text-zinc-900 whitespace-nowrap">{seats.length} Seats</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-zinc-400/30"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Available</span>
            <span className="font-mono font-bold text-emerald-700 text-lg leading-none whitespace-nowrap">{availableCount}</span>
          </div>
        </div>
      </div>

      {/* Floating Reset Camera Button */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 pointer-events-none">
        <button 
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.object.position.set(0, 30, 40);
              controlsRef.current.update();
            }
          }}
          className="pointer-events-auto backdrop-blur-md bg-white/70 hover:bg-white/90 border border-white/50 text-zinc-800 text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset View
        </button>
      </div>

      {/* --- R3F CANVAS --- */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows
          gl={{ alpha: false, antialias: true, preserveDrawingBuffer: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#e5e5e5');
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 30, 40]} fov={40} />
          
          <SceneLighting />
          
          <Suspense fallback={null}>
            <group>
              <LibraryArchitecture />
              
              {/* Map Seats over the centered base */}
              {seats.map(seat => {
                const safeSeat = { ...seat, x: seat.x ?? 0, z: seat.z ?? 0 };
                const matchesFilter = !hasActiveFilters || isMatch(safeSeat);
                const shouldDim = hasActiveFilters && !matchesFilter;

                return (
                  <SeatNode 
                    key={safeSeat.id}
                    seat={safeSeat}
                    isSelected={selectedSeatId === safeSeat.id}
                    isDimmed={shouldDim}
                    onSelect={onSelectSeat}
                  />
                );
              })}
            </group>
          </Suspense>

          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            enableDamping={false}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2}
            minDistance={15} 
            maxDistance={60}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
}
