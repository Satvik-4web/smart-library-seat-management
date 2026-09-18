import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { CaretRight, Chair, Clock, Info, Plug, WindowsLogo, CheckCircle, List, MapTrifold, Cube, X, MapPin, MagnifyingGlass, MagicWand, Compass, CornersOut, NavigationArrow, Stack, Users, MapTrifold as MapIcon, MagnifyingGlass as SearchIcon, Image as ImageIcon } from '@phosphor-icons/react';
import { libraryConfig } from '../config/libraryConfig';
import InteractiveSeatMap from '../components/InteractiveSeatMap';

export default function StudentDashboard({ studentId, seats, updateSeat, showToast, navigate }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(`session_${studentId}`);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const selectedSeat = seats.find(s => s.id === selectedSeatId) || null;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // UI States
  const [activeFloor, setActiveFloor] = useState(2);
  const [viewMode, setViewMode] = useState('3d'); 
  
  const [filters, setFilters] = useState({
    availableOnly: true,
    zone: 'All Zones',
    type: 'All Types',
    nearWindow: false,
    powerOutlet: false
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(`session_${studentId}`, JSON.stringify(session));
    } else {
      localStorage.removeItem(`session_${studentId}`);
    }
  }, [session, studentId]);

  // Auto-release logic
  useEffect(() => {
    if (!session || session.status !== 'away' || !session.breakEndTime) return;
    const checkExpiry = () => {
      if (Date.now() >= session.breakEndTime) {
        updateSeat(session.seatId, 'Available', { studentId: null, startTime: null, breakEndTime: null }, `Seat ${session.seatId} automatically released`);
        setSession(null);
        showToast(`Your temporary break expired. Seat ${session.seatId} released.`, 'warning');
        return true;
      }
      return false;
    };
    if (checkExpiry()) return;
    const intervalId = setInterval(() => {
      if (checkExpiry()) clearInterval(intervalId);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [session, updateSeat]);

  const floorSeats = seats.filter(s => s.floor === activeFloor);

  const handleSelectSeat = (seatOrId) => {
    if (session) {
      showToast('You already have an active session. End it first.', 'error');
      return;
    }
    const id = typeof seatOrId === 'string' ? seatOrId : seatOrId.id;
    setSelectedSeatId(id);
  };

  const handleBookClick = () => {
    if (!selectedSeat) return;
    if (selectedSeat.status !== 'Available') {
      showToast('This seat is no longer available.', 'error');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedSeat || selectedSeat.status !== 'Available') {
      showToast('Booking failed. Seat is not available.', 'error');
      setShowConfirmDialog(false);
      return;
    }
    setShowConfirmDialog(false);
    updateSeat(selectedSeat.id, 'Occupied', { studentId, startTime: Date.now(), breakEndTime: null }, `Student ${studentId} occupied ${selectedSeat.id}`);
    setSession({ seatId: selectedSeat.id, startTime: Date.now(), status: 'active', breakEndTime: null });
    showToast(`Seat ${selectedSeat.id} booked successfully.`, 'success');
    // keep selectedSeatId as is
  };

  const [recommendedSeats, setRecommendedSeats] = useState([]);

  const findSeatForMe = () => {
    const candidates = floorSeats.filter(s => {
      if (s.status !== 'Available') return false;
      if (filters.zone !== 'All Zones' && s.zone !== filters.zone) return false;
      if (filters.type !== 'All Types' && s.type !== filters.type) return false;
      if (filters.nearWindow && !s.nearWindow) return false;
      if (filters.powerOutlet && !s.hasPower) return false;
      return true;
    });

    if (candidates.length > 0) {
      // Shuffle array
      const shuffled = candidates.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(4, candidates.length));
      setRecommendedSeats(selected);
      showToast(`Found ${selected.length} matching seats.`, 'info');
    } else {
      setRecommendedSeats([]);
      showToast('No exact matches found on this floor.', 'error');
    }
  };

  const availableZones = ['All Zones', ...new Set(floorSeats.map(s => s.zone))];
  const availableTypes = ['All Types', ...new Set(floorSeats.map(s => s.type))];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] pb-12">
      
      {/* Hero Banner */}
      <div className="w-full bg-[#780000] text-white relative overflow-hidden">
        {/* Subtle background image overlay pattern (mocked via gradient/opacity for now) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="w-full px-6 lg:px-12 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">LIBRARYOS</h1>
            <h2 className="text-lg font-medium text-white/90">Smart Seat Management System</h2>
            <p className="text-xs text-white/70 tracking-widest mt-1">FIND. STUDY. RETURN.</p>
          </div>

          <div className="hidden lg:block text-center max-w-sm italic text-white/80 font-serif text-sm">
            "A library is a space where ideas find their home."
            <div className="text-right text-xs mt-1 not-italic opacity-70">— TIET</div>
          </div>

          <div className="flex gap-8 items-center bg-black/20 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Stack weight="fill" className="w-8 h-8 opacity-80" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">5</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">Floors</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Users weight="fill" className="w-8 h-8 opacity-80" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">240</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">Total Seats</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <Clock weight="fill" className="w-8 h-8 opacity-80" />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">09:00 AM - 12:00 AM</span>
                <span className="text-[10px] uppercase tracking-widest opacity-80">Library Timings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 lg:px-8 mt-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        {session ? (
          // ACTIVE SESSION VIEW
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-xl max-w-md w-full flex flex-col items-center text-center">
              <div className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4",
                session.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {session.status === 'active' ? <Chair weight="fill" className="w-10 h-10" /> : <Clock weight="fill" className="w-10 h-10" />}
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 tracking-tighter mb-1">{session.seatId}</h2>
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">
                {session.status === 'active' ? 'Active Session' : 'Temporarily Away'}
              </div>
              
              <div className="w-full bg-zinc-50 p-4 rounded-lg border border-zinc-100 mb-8 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Started</span>
                  <span className="font-bold text-zinc-900">{new Date(session.startTime).toLocaleTimeString()}</span>
                </div>
                {session.status === 'active' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Duration</span>
                    <LiveDuration startTime={session.startTime} />
                  </div>
                )}
                {session.status === 'away' && session.breakEndTime && (
                  <div className="flex justify-between items-center text-sm border-t border-zinc-200 pt-2 mt-1">
                    <span className="text-amber-600 font-bold">Break Remaining</span>
                    <BreakTimer breakEndTime={session.breakEndTime} />
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-3">
                {session.status === 'active' ? (
                  <button onClick={() => {
                    const dur = isDemoMode ? libraryConfig.BREAK_DURATION : 30 * 60 * 1000;
                    updateSeat(session.seatId, 'Away', { breakEndTime: Date.now() + dur });
                    setSession({...session, status: 'away', breakEndTime: Date.now() + dur});
                  }} className="w-full py-3.5 bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors font-bold rounded shadow-sm">
                    Take a Break
                  </button>
                ) : (
                  <button onClick={() => {
                    updateSeat(session.seatId, 'Occupied', { breakEndTime: null });
                    setSession({...session, status: 'active', breakEndTime: null});
                  }} className="w-full py-3.5 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-bold rounded shadow-sm">
                    Return to Seat
                  </button>
                )}
                <button onClick={() => {
                  updateSeat(session.seatId, 'Available', { studentId: null, startTime: null, breakEndTime: null });
                  setSession(null);
                }} className="w-full py-3.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors font-bold rounded shadow-sm">
                  End Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          // SEAT SELECTION VIEW
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* Left Panel: Floor + Filters */}
            <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0 overflow-y-auto pb-4 hide-scrollbar">
              
              {/* Floor Selector Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-100 overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-zinc-100">
                  <Stack className="w-5 h-5 text-zinc-800" weight="bold" />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-800">Select Floor</h3>
                </div>
                <div className="flex flex-col p-2 gap-1">
                  {[
                    { id: 1, name: 'Silent Study' },
                    { id: 2, name: 'General Study' },
                    { id: 3, name: 'Group Study' },
                    { id: 4, name: 'Journals & Reading' },
                    { id: 5, name: 'Research & Special' }
                  ].map(f => (
                    <button 
                      key={f.id}
                      onClick={() => { setActiveFloor(f.id); setSelectedSeat(null); }}
                      className={clsx(
                        "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                        activeFloor === f.id 
                          ? "bg-[#780000] text-white shadow-md shadow-red-900/20 translate-x-1" 
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <span>Floor {f.id}</span>
                      <span className={clsx("text-xs font-normal", activeFloor === f.id ? "text-red-100" : "text-zinc-400")}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters Card */}
              <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-100 overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-zinc-100">
                  <MagnifyingGlass className="w-5 h-5 text-zinc-800" weight="bold" />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-800">Find a Seat</h3>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  
                  <label className="flex flex-col gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Zone
                    <select 
                      value={filters.zone} 
                      onChange={e => setFilters({...filters, zone: e.target.value})}
                      className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:border-[#780000] outline-none font-medium normal-case tracking-normal"
                    >
                      {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Seat Type
                    <select 
                      value={filters.type} 
                      onChange={e => setFilters({...filters, type: e.target.value})}
                      className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-800 focus:border-[#780000] outline-none font-medium normal-case tracking-normal"
                    >
                      {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>

                  <div className="flex flex-col gap-2.5 mt-1">
                    <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 cursor-pointer">
                      <input type="checkbox" checked={filters.nearWindow} onChange={e => setFilters({...filters, nearWindow: e.target.checked})} className="accent-[#780000] w-4 h-4 rounded" />
                      Near Window
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 cursor-pointer">
                      <input type="checkbox" checked={filters.powerOutlet} onChange={e => setFilters({...filters, powerOutlet: e.target.checked})} className="accent-[#780000] w-4 h-4 rounded" />
                      Power Outlet
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 cursor-pointer">
                      <input type="checkbox" checked={filters.availableOnly} onChange={e => setFilters({...filters, availableOnly: e.target.checked})} className="accent-[#780000] w-4 h-4 rounded" />
                      Available Only
                    </label>
                  </div>

                  <button className="mt-2 w-full py-3 bg-[#780000] text-white font-bold text-sm rounded-lg hover:bg-[#5a0000] transition-colors shadow-md flex items-center justify-center gap-2">
                    <SearchIcon weight="bold" />
                    {floorSeats.filter(s => {
                      if (filters.availableOnly && s.status !== 'Available') return false;
                      if (filters.zone !== 'All Zones' && s.zone !== filters.zone) return false;
                      if (filters.type !== 'All Types' && s.type !== filters.type) return false;
                      if (filters.nearWindow && !s.nearWindow) return false;
                      if (filters.powerOutlet && !s.hasPower) return false;
                      return true;
                    }).length} seats match
                  </button>

                  <button 
                    onClick={findSeatForMe}
                    className="w-full py-2.5 bg-white border border-zinc-200 text-zinc-700 font-bold text-sm rounded-lg hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MagicWand weight="bold" />
                    Find a Seat for Me
                  </button>

                  {recommendedSeats.length > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-2">Recommended for You</h4>
                      <div className="flex flex-col gap-2">
                        {recommendedSeats.map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => handleSelectSeat(seat.id)}
                            className="flex items-center justify-between p-2 bg-white rounded border border-emerald-200 hover:border-emerald-400 transition-colors text-left"
                          >
                            <span className="font-bold text-emerald-900 text-sm">{seat.id}</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">{seat.zone}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Map Area */}
            <div className="flex-1 flex flex-col min-h-[640px] min-w-0">
              
              {/* Map Container */}
              <div className="relative w-full h-full bg-[#E5E7EB] rounded-2xl border border-zinc-200 overflow-hidden shadow-inner">
                
                {/* Overlaid UI inside Map Container so it matches Mockup exactly */}
                <div className="absolute top-4 left-4 z-10 flex bg-white p-1 rounded-xl shadow-lg border border-zinc-200">
                  <button onClick={() => setViewMode('3d')} className={clsx("px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", viewMode === '3d' ? "bg-[#780000] text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50")}>
                    <Cube weight="fill"/> 3D View
                  </button>
                  <button onClick={() => setViewMode('2d')} className={clsx("px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", viewMode === '2d' ? "bg-[#780000] text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50")}>
                    <MapIcon weight="fill"/> 2D Floor Map
                  </button>
                  <button onClick={() => setViewMode('list')} className={clsx("px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all", viewMode === 'list' ? "bg-[#780000] text-white shadow-md" : "text-zinc-500 hover:bg-zinc-50")}>
                    <List weight="fill"/> List View
                  </button>
                </div>

                {viewMode !== 'list' && (
                  <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg border border-zinc-200 flex flex-wrap items-center gap-3 sm:gap-6 max-w-[calc(100%-32px)]">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-zinc-700 whitespace-nowrap">Available</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-zinc-700 whitespace-nowrap">Occupied</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-zinc-700 whitespace-nowrap">Temporarily Away</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-zinc-700 whitespace-nowrap">Reserved</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-zinc-400 shrink-0" /><span className="text-[10px] sm:text-xs font-bold text-zinc-700 whitespace-nowrap">Maintenance</span></div>
                  </div>
                )}

                <InteractiveSeatMap 
                  seats={floorSeats}
                  selectedSeatId={selectedSeat?.id}
                  onSelectSeat={handleSelectSeat}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  activeFilters={filters}
                />
              </div>

              {/* Quick Pick Strip */}
              <div className="mt-4 bg-white rounded-xl shadow-sm border border-zinc-200 p-3 flex items-center gap-3 overflow-x-auto hide-scrollbar">
                <span className="text-sm font-bold text-zinc-800 shrink-0 ml-2 mr-4">Quick Picks (Available Now)</span>
                {floorSeats.filter(s => s.status === 'Available').slice(0, 15).map(seat => (
                  <button 
                    key={seat.id}
                    onClick={() => handleSelectSeat(seat)}
                    className={clsx(
                      "shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border",
                      selectedSeat?.id === seat.id 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-emerald-300 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm">{seat.id}</span>
                      <span className="text-[10px] uppercase font-medium text-emerald-600">Available</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Selected Seat Details */}
            <div className="w-full lg:w-80 flex flex-col shrink-0">
              <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-100 flex flex-col h-full overflow-hidden relative">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <List weight="bold" className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-widest">Seat Details</h3>
                  </div>
                  {selectedSeat && (
                    <button onClick={() => setSelectedSeat(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                      <X weight="bold" className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {selectedSeat ? (
                  <div className="flex flex-col h-full overflow-y-auto pb-6 animate-in slide-in-from-right-4 duration-300">
                    
                    {/* Placeholder Environment Image */}
                    <div className="w-full h-48 bg-zinc-100 relative">
                      <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Study Desk" className="w-full h-full object-cover" />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-zinc-900">{selectedSeat.id}</h2>
                        <div className={clsx(
                          "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full",
                          selectedSeat.status === 'Available' ? "bg-emerald-100/80 text-emerald-700" :
                          selectedSeat.status === 'Occupied' ? "bg-red-100/80 text-red-700" :
                          selectedSeat.status === 'Away' ? "bg-amber-100/80 text-amber-700" :
                          selectedSeat.status === 'Reserved' ? "bg-blue-100/80 text-blue-700" :
                          "bg-zinc-100/80 text-zinc-700"
                        )}>
                          <div className={clsx(
                            "w-2 h-2 rounded-full",
                            selectedSeat.status === 'Available' ? "bg-emerald-500" :
                            selectedSeat.status === 'Occupied' ? "bg-red-500" :
                            selectedSeat.status === 'Away' ? "bg-amber-500" :
                            selectedSeat.status === 'Reserved' ? "bg-blue-500" :
                            "bg-zinc-500"
                          )} />
                          {selectedSeat.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 text-sm font-medium text-zinc-700 flex-1">
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-3">
                          <Stack className="w-5 h-5 text-zinc-400" />
                          <span className="w-24 text-zinc-500">Floor</span>
                          <span className="font-bold text-zinc-900">{selectedSeat.floor}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-3">
                          <MapPin className="w-5 h-5 text-zinc-400" />
                          <span className="w-24 text-zinc-500">Zone</span>
                          <span className="font-bold text-zinc-900">{selectedSeat.zone}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-3">
                          <Chair className="w-5 h-5 text-zinc-400" />
                          <span className="w-24 text-zinc-500">Type</span>
                          <span className="font-bold text-zinc-900">{selectedSeat.type}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-3">
                          <WindowsLogo className="w-5 h-5 text-zinc-400" />
                          <span className="w-24 text-zinc-500">Window Seat</span>
                          <span className="font-bold text-zinc-900">{selectedSeat.nearWindow ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex items-center gap-4 border-b border-zinc-50 pb-3">
                          <Plug className="w-5 h-5 text-zinc-400" />
                          <span className="w-24 text-zinc-500">Power Outlet</span>
                          <span className="font-bold text-zinc-900">{selectedSeat.hasPower ? 'Yes' : 'No'}</span>
                        </div>

                        {selectedSeat.status === 'Occupied' && (
                          <div className="mt-4 p-4 bg-zinc-50 rounded-lg text-sm text-zinc-600 italic">
                            This seat is currently in use.
                          </div>
                        )}
                        {selectedSeat.status === 'Away' && (
                          <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-lg text-sm italic">
                            Student is temporarily away. Break ends soon.
                          </div>
                        )}
                        {selectedSeat.status === 'Reserved' && (
                          <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm italic">
                            This seat is reserved.
                          </div>
                        )}
                        {selectedSeat.status === 'Maintenance' && (
                          <div className="mt-4 p-4 bg-zinc-50 text-zinc-500 rounded-lg text-sm italic">
                            This seat is currently unavailable.
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 mt-8">
                        {selectedSeat.status === 'Available' && (
                          <button 
                            onClick={handleBookClick}
                            className="w-full py-3.5 bg-[#780000] text-white font-bold rounded-lg hover:bg-[#5a0000] transition-colors shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            <Chair weight="fill" className="w-5 h-5" />
                            Book This Seat
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            // Focus on the nearby seats section or perform an action
                          }}
                          className="w-full py-3.5 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-lg hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                          <MapPin weight="bold" className="w-5 h-5" />
                          View Nearby Seats
                        </button>

                        {/* We will render nearby seats dynamically without needing state by just recalculating it always but only showing if they click? 
                        Let's just compute it directly and show it below. */}
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Nearby Available Seats</h4>
                          <div className="flex flex-wrap gap-2">
                            {floorSeats.filter(s => s.status === 'Available' && s.id !== selectedSeat.id)
                              .map(s => ({ ...s, dist: Math.sqrt(Math.pow((s.x || 0) - (selectedSeat.x || 0), 2) + Math.pow((s.z || 0) - (selectedSeat.z || 0), 2)) }))
                              .sort((a, b) => a.dist - b.dist)
                              .slice(0, 4)
                              .map(nearbySeat => (
                                <button 
                                  key={nearbySeat.id}
                                  onClick={() => handleSelectSeat(nearbySeat.id)}
                                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-md hover:bg-emerald-100 transition-colors border border-emerald-200"
                                >
                                  {nearbySeat.id}
                                </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col p-8 items-center justify-center h-full text-center text-zinc-500">
                    <ImageIcon className="w-16 h-16 text-zinc-200 mb-6" weight="fill" />
                    <h3 className="font-bold text-zinc-800 text-lg mb-2">No Seat Selected</h3>
                    <p className="text-sm mb-8">Click a green available seat on the map or select from the Quick Picks below.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-zinc-200 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-100">
              <CheckCircle weight="fill" className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-zinc-900">Confirm Booking</h2>
            <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
              You are about to start a study session at <b className="text-zinc-900">{selectedSeat.id}</b> in the <b className="text-zinc-900">{selectedSeat.zone}</b>.
            </p>
            
            <div className="w-full flex flex-col gap-3">
              <button onClick={confirmBooking} className="w-full bg-[#780000] hover:bg-[#5a0000] text-white px-4 py-3.5 rounded-lg font-bold transition-colors shadow-sm">
                Confirm Booking
              </button>
              <button onClick={() => setShowConfirmDialog(false)} className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-3.5 rounded-lg font-bold transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveDuration({ startTime }) {
  const [elapsed, setElapsed] = useState(Date.now() - startTime);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  return (
    <span className="font-mono font-bold text-zinc-900">
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

function BreakTimer({ breakEndTime }) {
  const [remaining, setRemaining] = useState(Math.max(0, breakEndTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, breakEndTime - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [breakEndTime]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <span className="font-mono font-bold text-amber-600 text-lg">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}
