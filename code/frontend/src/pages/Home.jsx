import React, { useState } from 'react';
import { WarningCircle, ShieldCheck, ArrowRight, Chair, Clock, LinkBreak, User } from '@phosphor-icons/react';
import clsx from 'clsx';

export default function Home({ onLogin, seats, navigate }) {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const availableCount = seats.filter(s => s.status === 'Available').length;
  const occupiedCount = seats.filter(s => s.status === 'Occupied' || s.status === 'Away').length;
  const totalSeats = seats.length || 1;
  const occupancyPercentage = Math.round((occupiedCount / totalSeats) * 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = studentId.trim().toUpperCase();
    if (!id) {
      setError('Please enter your institutional ID.');
      return;
    }
    if (id !== 'ADMIN' && !id.startsWith('TIET')) {
      setError('Student ID not recognized.');
      return;
    }

    setIsSimulating(true);
    setTimeout(() => {
      onLogin(id);
    }, 800);
  };

  const floors = [
    { id: 1, name: 'Silent Study' },
    { id: 2, name: 'General Study' },
    { id: 3, name: 'Group Study' },
    { id: 4, name: 'Journals & Reading' },
    { id: 5, name: 'Research & Special' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full bg-[#f8f9fa] min-h-screen font-sans">
      
      {/* Live Library Status Bar */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-[1400px] w-full mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nava Nalanda Central Library</span>
            <div className="w-px h-3 bg-zinc-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wide">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
              Library Open
            </div>
            <div className="w-px h-3 bg-zinc-300 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold tracking-widest uppercase">
              <Clock className="w-3.5 h-3.5" />
              09:00 AM — 12:00 AM
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Available</span>
              <span className="text-emerald-700 font-bold">{availableCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Seats</span>
              <span className="text-zinc-800 font-bold">{seats.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Occupancy</span>
              <span className="text-zinc-800 font-bold">{occupancyPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-[1400px] mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
          
          {/* Hero Left (60%) */}
          <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-center">
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-[#780000] font-bold tracking-[0.2em] text-xs uppercase">LIBRARYOS &middot; Smart Seat Management</h2>
              <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-zinc-900 leading-[1.1] tracking-tight">
                Find. Study. Return.
              </h1>
            </div>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-xl mb-10 border-l-2 border-zinc-200 pl-6">
              Find an available study seat before you enter the library, secure it for your session, and step away briefly without unnecessarily losing your place.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button 
                onClick={() => document.getElementById('student-access-panel').scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#780000] hover:bg-[#5a0000] text-white px-8 py-4 rounded font-bold transition-all shadow-[0_4px_14px_0_rgba(120,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(120,0,0,0.23)] hover:-translate-y-0.5 active:translate-y-0 tracking-wide text-sm"
              >
                ACCESS LIBRARYOS
              </button>
              <button 
                onClick={() => document.getElementById('live-preview').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white border-2 border-zinc-200 hover:border-zinc-300 text-zinc-700 px-8 py-4 rounded font-bold transition-all tracking-wide text-sm hover:bg-zinc-50"
              >
                EXPLORE SEAT AVAILABILITY
              </button>
            </div>
          </div>

          {/* Hero Right: Student Access (40%) */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex justify-center lg:justify-end" id="student-access-panel">
            <div className="w-full max-w-md bg-white border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-lg overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              {/* Header */}
              <div className="bg-[#780000] px-8 py-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="flex flex-col relative z-10">
                  <h3 className="text-xl font-bold tracking-wide text-white mb-1">STUDENT ACCESS</h3>
                  <span className="text-xs text-white/70 tracking-widest uppercase font-semibold">Institutional Identification</span>
                </div>
              </div>
              <div className="w-full h-1 bg-[#D4A373]" />
              
              {/* Form */}
              <div className="p-8">
                <p className="text-sm text-zinc-600 mb-8 leading-relaxed">
                  Enter your institutional Roll Number to access live seat availability and begin a study session.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="studentId" className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                      COLLEGE ID / ROLL NUMBER
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-zinc-400 group-focus-within:text-[#780000] transition-colors" />
                      </div>
                      <input
                        id="studentId"
                        type="text"
                        value={studentId}
                        onChange={(e) => {
                          setStudentId(e.target.value);
                          setError('');
                        }}
                        placeholder="TIET2024XXXX"
                        disabled={isSimulating}
                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-[#780000] focus:ring-1 focus:ring-[#780000] focus:bg-white transition-all uppercase font-mono disabled:opacity-50 text-zinc-900 font-bold tracking-wider text-sm shadow-inner"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-700 text-xs font-bold bg-red-50 p-3 rounded border border-red-200 animate-in slide-in-from-top-1 fade-in">
                      <WarningCircle weight="fill" className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSimulating}
                    className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-4 rounded-md font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-75 active:scale-[0.98] text-sm tracking-wide shadow-md hover:shadow-lg"
                  >
                    {isSimulating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        VERIFYING...
                      </>
                    ) : (
                      <>
                        CONTINUE TO LIBRARYOS <ArrowRight weight="bold" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE SEAT PREVIEW */}
        <section id="live-preview" className="w-full bg-white border-y border-zinc-200 py-16">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">LIVE SEAT AVAILABILITY</h3>
                <p className="text-sm text-zinc-500">Real-time architectural seat preview across library floors.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest bg-zinc-50 px-4 py-2.5 rounded border border-zinc-100">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-zinc-600">Available</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-zinc-600">Occupied</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-zinc-600">Away</span></div>
              </div>
            </div>

            {/* Architectural Mini Map Container */}
            <div className="w-full bg-[#f4f4f5] border border-zinc-200 rounded-xl p-8 relative overflow-hidden flex flex-col lg:flex-row gap-8">
              {/* Floor Plan Visual (Desktop) */}
              <div className="flex-1 min-h-[300px] border-2 border-dashed border-zinc-300 rounded-lg p-6 relative bg-white shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                  <span className="font-bold text-zinc-800">Floor 2 &middot; General Study</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{seats.filter(s=>s.floor===2 && s.status==='Available').length} Available</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 mt-auto">
                  {seats.slice(0, 24).map(seat => {
                    const isAvail = seat.status === 'Available';
                    const isOcc = seat.status === 'Occupied';
                    const isAway = seat.status === 'Away';
                    const dotClass = isAvail ? 'bg-emerald-500' : isOcc ? 'bg-red-500' : isAway ? 'bg-amber-500' : 'bg-zinc-500';
                    return (
                      <div key={seat.id} className={clsx(
                        "flex flex-col items-center gap-2 group transition-all",
                        isAvail ? 'cursor-pointer hover:-translate-y-1' : 'opacity-70'
                      )} onClick={() => {
                        if(isAvail) {
                          setStudentId('TIET20240000'); // quick mock for demo
                          document.getElementById('student-access-panel').scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        <div className="font-mono text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors">{seat.id}</div>
                        <div className={clsx(
                          "w-10 h-6 border-b-4 rounded-sm shadow-sm flex items-center justify-center relative transition-all",
                          isAvail ? "bg-[#d1bfae] border-[#8a6b52] group-hover:ring-2 ring-emerald-500/50" : "bg-zinc-200 border-zinc-300"
                        )}>
                          <div className={clsx("w-2 h-2 rounded-full shadow-inner", dotClass)} />
                        </div>
                        <div className={clsx("w-4 h-2 rounded-t-full border-t-2", isAvail ? "bg-zinc-600 border-zinc-700" : "bg-zinc-300 border-zinc-400")} />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Floor Summary Sidebar */}
              <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
                {floors.map(floor => {
                  const fSeats = seats.filter(s => s.floor === floor.id);
                  // If dataset doesn't have other floors, mock them purely for the preview visual layout if they are empty
                  const isMock = fSeats.length === 0;
                  const count = isMock ? Math.floor(Math.random() * 20) + 5 : fSeats.filter(s => s.status === 'Available').length;
                  const isActive = floor.id === 2; // Demo is Floor 2
                  
                  return (
                    <div key={floor.id} className={clsx(
                      "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:border-zinc-400",
                      isActive ? "bg-zinc-900 text-white border-zinc-900 shadow-md" : "bg-white text-zinc-800 border-zinc-200"
                    )} onClick={() => document.getElementById('student-access-panel').scrollIntoView({ behavior: 'smooth' })}>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">FLOOR {floor.id}</span>
                        <span className={clsx("text-xs", isActive ? "text-zinc-400" : "text-zinc-500")}>{floor.name}</span>
                      </div>
                      <div className={clsx("text-xs font-bold px-2 py-1 rounded", isActive ? "bg-white/10 text-emerald-400" : "bg-emerald-50 text-emerald-700")}>
                        {count} avail
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* LIFECYCLE & TRUST SECTION */}
        <section className="w-full bg-[#F9F9F9] py-24 border-b border-zinc-200">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col items-center">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4 text-center">Built for Shared Study Spaces</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl mt-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-[#780000]">
                  <Chair className="w-8 h-8" weight="duotone" />
                </div>
                <h4 className="font-bold text-zinc-900 tracking-wide uppercase">FIND</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">See available seats across library floors in real-time, eliminating the need to search floor by floor.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-[#780000]">
                  <ShieldCheck className="w-8 h-8" weight="duotone" />
                </div>
                <h4 className="font-bold text-zinc-900 tracking-wide uppercase">STUDY</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">Secure a seat for an active library session with your institutional ID, ensuring fair usage.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center text-[#780000]">
                  <Clock className="w-8 h-8" weight="duotone" />
                </div>
                <h4 className="font-bold text-zinc-900 tracking-wide uppercase">RETURN</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">Take a temporary break safely. If the permitted break expires, the seat automatically releases.</p>
              </div>
            </div>

            {/* Lifecycle Flow Graphic */}
            <div className="w-full max-w-4xl mt-20 pt-16 border-t border-zinc-200">
              <h4 className="text-center font-bold text-zinc-800 mb-8 uppercase tracking-widest text-sm">The LibraryOS Seat Lifecycle</h4>
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <div className="bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-700">Scan ID</div>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <div className="bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-700">Find Seat</div>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <div className="bg-[#780000] px-4 py-2 rounded-full text-white shadow-sm">Book</div>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <div className="bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-700">Study</div>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <div className="bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-full shadow-sm">Take Break</div>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <div className="bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm text-zinc-700">Return / Release</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY LIBRARYOS & STATS */}
        <section className="w-full bg-white py-24">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-16 md:items-center">
            <div className="flex-1 flex flex-col gap-6">
              <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">Why LibraryOS?</h3>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Shared study spaces work best when seats are actively used. LibraryOS helps students find available seating instantly and prevents desks from being unnecessarily blocked during short absences.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col gap-2">
                <span className="text-4xl font-bold text-[#780000]">{seats.length}</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Demo Seats</span>
              </div>
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col gap-2">
                <span className="text-4xl font-bold text-[#780000]">5</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Floors</span>
              </div>
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col gap-2 col-span-2">
                <span className="text-4xl font-bold text-[#780000]">1</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Unified Seat System</span>
              </div>
            </div>
          </div>
        </section>

        {/* LIBRARY SERVICES (Ecosystem integration) */}
        <section className="w-full bg-zinc-900 py-20 text-white">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col gap-2 mb-12">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Nava Nalanda Central Library</h3>
              <h2 className="text-2xl font-bold text-white tracking-wide">Library Services</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Web OPAC', 'Digital Repository', 'Question Papers', 'NPTEL', 'Remote Access', 'New Arrivals', 'Group Discussion Rooms', 'E-Journals'].map(service => (
                <div key={service} className="p-4 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-800/30 hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">{service}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-zinc-200 py-12">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 tracking-wide">THAPAR INSTITUTE OF ENGINEERING & TECHNOLOGY</span>
              <span className="text-sm font-semibold text-zinc-600">NAVA NALANDA CENTRAL LIBRARY</span>
            </div>
            <p className="text-xs text-zinc-500">Patiala, Punjab</p>
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <span className="text-sm font-bold text-[#780000] tracking-widest uppercase">LIBRARYOS</span>
              <p className="text-xs text-zinc-400 mt-1">Smart Seat Management Prototype</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Navigation</span>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Library Home</a>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Services</a>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Collections</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Support</span>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Resources</a>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Library Rules</a>
              <a href="#" className="text-sm text-zinc-600 hover:text-[#780000]">Contact</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 mt-12 pt-6 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest text-center">
            LIBRARYOS is a prototype concept for smart study-space management. Not an official deployment.
          </p>
        </div>
      </footer>
    </div>
  );
}
