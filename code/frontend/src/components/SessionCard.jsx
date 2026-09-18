import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle, Warning, Clock } from '@phosphor-icons/react';
import clsx from 'clsx';

export default function SessionCard({ session, seat, onTakeBreak, onReturn, onEndSession, isDemoMode }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [studyDuration, setStudyDuration] = useState(0);

  // Timer for temporary break
  useEffect(() => {
    if (session?.status !== 'away' || !session?.breakEndTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = session.breakEndTime - now;
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [session]);

  // Timer for active study duration
  useEffect(() => {
    if (!session?.startTime) return;
    
    const updateDuration = () => {
      setStudyDuration(Date.now() - session.startTime);
    };
    
    updateDuration();
    const intervalId = setInterval(updateDuration, 1000);
    return () => clearInterval(intervalId);
  }, [session?.startTime]);

  if (!session || !seat) return null;

  const isActive = session.status === 'active';
  const isAway = session.status === 'away';
  
  // Format MM:SS for break
  const formatTime = (ms) => {
    if (ms === null) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Format HH:MM:SS for duration
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isWarning = timeLeft !== null && timeLeft <= 5 * 60 * 1000 && timeLeft > 0; // <= 5 mins

  return (
    <div className="bg-white rounded border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-start">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Your Active Session</h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold tracking-tight text-zinc-900">{seat.id}</span>
            <div className={clsx(
              "px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
              isActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            )}>
              {isActive ? <CheckCircle weight="fill" /> : <Clock weight="fill" />}
              {isActive ? 'Active' : 'Temporarily Away'}
            </div>
          </div>
          <div className="text-sm text-zinc-500 mt-1">Nava Nalanda Library</div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 font-mono mb-1">Started: {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-xs text-zinc-500 font-mono">Study Duration</p>
          <p className="text-lg font-mono font-medium text-zinc-800">
            {formatDuration(studyDuration)}
          </p>
        </div>
      </div>

      {isAway && (
        <div className={clsx(
          "px-6 py-4 flex flex-col items-center justify-center border-b",
          isWarning ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
        )}>
          <div className="flex items-center gap-3 mb-1">
            <Clock className={clsx("w-5 h-5", isWarning ? "text-red-500" : "text-amber-500")} />
            <span className={clsx("font-mono text-3xl font-medium", isWarning ? "text-red-600" : "text-amber-600")}>
              {formatTime(timeLeft)}
            </span>
          </div>
          {isWarning && (
            <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-medium bg-red-100/50 px-3 py-1 rounded-full">
              <Warning weight="fill" />
              <span>Break expiring soon. Seat will be released automatically.</span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 bg-zinc-50 flex flex-col gap-3">
        {isActive ? (
          <button
            onClick={onTakeBreak}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded font-bold transition-colors active:scale-[0.98]"
          >
            <Coffee weight="bold" className="w-5 h-5" />
            Take Temporary Break (30 min)
          </button>
        ) : (
          <button
            onClick={onReturn}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded font-bold transition-colors active:scale-[0.98]"
          >
            <CheckCircle weight="bold" className="w-5 h-5" />
            Return to Session
          </button>
        )}
        
        <button
          onClick={onEndSession}
          className="w-full flex items-center justify-center bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 px-4 py-2.5 rounded font-bold transition-colors active:scale-[0.98]"
        >
          End Session & Release Seat
        </button>
      </div>
    </div>
  );
}
