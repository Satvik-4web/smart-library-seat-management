import React from 'react';
import clsx from 'clsx';
import { Users, Chair, Clock, WarningCircle, ListDashes, CaretRight } from '@phosphor-icons/react';

export default function AdminDashboard({ seats, activityLog, updateSeat, resetDemo, navigate }) {
  const [selectedSeat, setSelectedSeat] = React.useState(null);

  const totalSeats = seats.length;
  const availableCount = seats.filter(s => s.status === 'Available').length;
  const occupiedCount = seats.filter(s => s.status === 'Occupied').length;
  const awayCount = seats.filter(s => s.status === 'Away').length;
  const reservedCount = seats.filter(s => s.status === 'Reserved').length;
  const maintenanceCount = seats.filter(s => s.status === 'Maintenance').length;
  
  const occupancyPercentage = Math.round(((occupiedCount + awayCount) / totalSeats) * 100) || 0;

  const zones = seats.reduce((acc, seat) => {
    if (!acc[seat.zone]) acc[seat.zone] = [];
    acc[seat.zone].push(seat);
    return acc;
  }, {});

  const handleReset = () => {
    if (window.confirm("Are you sure you want to completely reset the system? This will clear all data and local storage.")) {
      resetDemo();
    }
  };

  const handleSimulateUpdate = () => {
    // Pick a random seat
    const randomSeat = seats[Math.floor(Math.random() * seats.length)];
    if (randomSeat.status === 'Available') {
      const studentId = `24DEMO${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
      updateSeat(randomSeat.id, 'Occupied', { studentId, startTime: Date.now(), breakEndTime: null }, `Simulated: Student ${studentId} occupied seat ${randomSeat.id}`);
    } else if (randomSeat.status === 'Occupied') {
      updateSeat(randomSeat.id, 'Available', { studentId: null, startTime: null, breakEndTime: null }, `Simulated: Student checked out of seat ${randomSeat.id}`);
    } else if (randomSeat.status === 'Away') {
      updateSeat(randomSeat.id, 'Occupied', { breakEndTime: null }, `Simulated: Student returned to seat ${randomSeat.id}`);
    } else {
      // If Reserved or Maintenance, just toggle it to Available
      updateSeat(randomSeat.id, 'Available', { studentId: null }, `Simulated: Seat ${randomSeat.id} released`);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-zinc-500 mb-6 flex items-center gap-2">
        <button onClick={() => navigate('home')} className="hover:text-[#780000]">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800 font-medium">Library Operations</span>
      </div>

      <div className="mb-8 pb-4 border-b border-zinc-200 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#780000] mb-1">LIBRARY OPERATIONS</h2>
          <h3 className="text-lg text-zinc-600">Nava Nalanda Central Library</h3>
        </div>
        <div className="text-right flex flex-col items-end gap-3">
          <p className="text-sm font-semibold text-zinc-800 uppercase tracking-widest">Administrator Console</p>
          <button 
            onClick={handleReset}
            className="px-4 py-1.5 bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 transition-colors font-bold text-xs uppercase tracking-widest rounded shadow-sm flex items-center gap-2"
          >
            <WarningCircle weight="bold" />
            Reset Demo System
          </button>
        </div>
      </div>
      
      <main className="flex flex-col gap-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard title="Total Seats" value={totalSeats} icon={<Chair />} />
          <MetricCard title="Available" value={availableCount} color="text-emerald-700" />
          <MetricCard title="Occupied" value={occupiedCount} color="text-zinc-800" />
          <MetricCard title="Temp. Away" value={awayCount} color="text-amber-700" icon={<Clock />} />
          <MetricCard title="Reserved" value={reservedCount} color="text-blue-700" />
          <MetricCard title="Maintenance" value={maintenanceCount} color="text-red-700" icon={<WarningCircle />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white p-8 rounded border border-zinc-200 shadow-sm flex flex-col gap-10">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h2 className="text-xl font-bold text-zinc-800">LIVE OCCUPANCY MAP</h2>
              <div className="px-3 py-1 bg-zinc-100 rounded border border-zinc-200 flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-600">Occupancy</span>
                <span className="text-lg font-bold text-zinc-800">{occupancyPercentage}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              {Object.entries(zones).map(([zoneName, zoneSeats]) => (
                <div key={zoneName} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-base font-bold text-zinc-800 uppercase">{zoneName}</h3>
                    <div className="h-px bg-zinc-200 flex-1" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Floor {zoneSeats[0].floor}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {zoneSeats.map(seat => (
                      <AdminSeatCard key={seat.id} seat={seat} updateSeat={updateSeat} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-zinc-800 text-white p-6 rounded shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-700">
                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-300">Synthetic Dataset</h2>
                <span className="text-[10px] font-mono bg-zinc-700 px-2 py-0.5 rounded text-zinc-300">DEMO</span>
              </div>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-zinc-400">Total Seats</span><span className="font-bold font-mono">40</span></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Students Generated</span><span className="font-bold font-mono">15</span></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Seed Sessions</span><span className="font-bold font-mono">12</span></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Seed Reservations</span><span className="font-bold font-mono">3</span></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Seed Maintenance</span><span className="font-bold font-mono">2</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-bold text-lg text-zinc-800">Seat Management</h2>
              </div>
              <div className="overflow-auto flex-1 p-0">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Seat</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Student</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seats.map(seat => (
                      <tr key={seat.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                        <td className="p-4 font-bold text-zinc-800">{seat.id}</td>
                        <td className="p-4">
                          <span className={clsx(
                            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border",
                            seat.status === 'Available' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            seat.status === 'Occupied' && "bg-red-50 text-red-700 border-red-200",
                            seat.status === 'Away' && "bg-amber-50 text-amber-700 border-amber-200",
                            seat.status === 'Reserved' && "bg-blue-50 text-blue-700 border-blue-200",
                            seat.status === 'Maintenance' && "bg-zinc-100 text-zinc-600 border-zinc-300"
                          )}>
                            {seat.status}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-600 font-mono text-xs">{seat.studentId || '-'}</td>
                        <td className="p-4">
                          <select 
                            value={seat.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              updateSeat(seat.id, newStatus, {
                                studentId: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.studentId,
                                startTime: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.startTime,
                                breakEndTime: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.breakEndTime,
                              }, `Admin changed ${seat.id} to ${newStatus}`);
                            }}
                            className="px-2 py-1 bg-white border border-zinc-300 text-zinc-700 text-xs rounded outline-none focus:border-[#780000]"
                          >
                            <option value="Available">Available</option>
                            <option value="Occupied" disabled>Occupied</option>
                            <option value="Away" disabled>Away</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-zinc-200 shadow-sm flex flex-col flex-1 max-h-[600px]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
                <ListDashes className="w-5 h-5 text-zinc-500" />
                <h2 className="text-lg font-bold text-zinc-800">RECENT ACTIVITY</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                {activityLog && activityLog.length > 0 ? (
                  activityLog.map((log) => (
                    <div key={log.id} className="flex flex-col gap-1 text-sm border-l-2 border-zinc-200 pl-3">
                      <span className="text-xs text-zinc-500 font-mono">
                        {new Date(log.time).toLocaleTimeString()}
                      </span>
                      <span className="text-zinc-800 leading-snug">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm text-center py-8">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, color = "text-zinc-900", icon }) {
  return (
    <div className="bg-white p-5 rounded border border-zinc-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{title}</span>
        {icon && React.cloneElement(icon, { className: "w-4 h-4 text-zinc-400" })}
      </div>
      <span className={clsx("text-3xl font-bold", color)}>{value}</span>
    </div>
  );
}

function AdminSeatCard({ seat, updateSeat }) {
  const [showActions, setShowActions] = React.useState(false);

  const statusStyles = {
    Available: 'bg-white border-zinc-300',
    Occupied: 'bg-zinc-100 border-zinc-400',
    Away: 'bg-amber-50 border-amber-300',
    Reserved: 'bg-blue-50 border-blue-300',
    Maintenance: 'bg-red-50 border-red-300 opacity-75',
  };

  const badgeStyles = {
    Available: "bg-emerald-100 text-emerald-800",
    Occupied: "bg-zinc-200 text-zinc-800",
    Away: "bg-amber-200 text-amber-900",
    Reserved: "bg-blue-100 text-blue-800",
    Maintenance: "bg-red-100 text-red-800",
  };

  const handleAction = (newStatus) => {
    let logMessage = `Admin marked ${seat.id} as ${newStatus}.`;
    if (newStatus === 'Available') {
      logMessage = `Admin released ${seat.id}.`;
      // Clear session data if forcing checkout
      if (seat.studentId) {
        localStorage.removeItem(`session_${seat.studentId}`);
      }
    }
    
    updateSeat(seat.id, newStatus, {
      studentId: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.studentId,
      startTime: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.startTime,
      breakEndTime: newStatus === 'Available' || newStatus === 'Maintenance' ? null : seat.breakEndTime,
    }, logMessage);
    setShowActions(false);
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setShowActions(!showActions)}
        className={clsx(
          'flex flex-col p-3 rounded border h-24 justify-between cursor-pointer hover:border-[#780000] transition-colors',
          statusStyles[seat.status] || statusStyles['Available']
        )}
      >
        <div className="flex justify-between items-start">
          <span className="font-mono font-bold text-zinc-800">{seat.id}</span>
          <div className={clsx(
            "px-1 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
            badgeStyles[seat.status] || badgeStyles['Available']
          )}>
            {seat.status}
          </div>
        </div>
        
        <div className="mt-2 h-8 flex items-end">
          {(seat.status === 'Occupied' || seat.status === 'Away') && seat.studentId ? (
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 bg-white/60 px-1.5 py-0.5 rounded border border-white">
              <Users weight="fill" className="text-zinc-500 w-3 h-3" />
              <span className="font-mono truncate">{seat.studentId}</span>
            </div>
          ) : (
            <span className="text-[10px] text-zinc-500 font-semibold">No occupant</span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-zinc-200 rounded shadow-lg z-50 flex flex-col p-1">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 mb-1">
            Admin Actions
          </div>
          {seat.status !== 'Available' && (
            <button onClick={() => handleAction('Available')} className="text-left px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-zinc-50 rounded">
              Release Seat (Available)
            </button>
          )}
          {seat.status !== 'Maintenance' && (
            <button onClick={() => handleAction('Maintenance')} className="text-left px-2 py-1.5 text-sm font-semibold text-red-700 hover:bg-zinc-50 rounded">
              Mark as Maintenance
            </button>
          )}
          {seat.status !== 'Reserved' && (
            <button onClick={() => handleAction('Reserved')} className="text-left px-2 py-1.5 text-sm font-semibold text-blue-700 hover:bg-zinc-50 rounded">
              Reserve Seat
            </button>
          )}
          <button onClick={() => setShowActions(false)} className="text-left px-2 py-1.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-50 rounded mt-1 border-t border-zinc-100">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
