import React, { useEffect, useState } from 'react';
import { Info, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';

export default function Toast({ message, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200); // Wait for transition
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  return (
    <div className={clsx(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-sm font-bold flex items-center gap-3 transition-all duration-200",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      type === 'success' ? "bg-emerald-700 text-white" :
      type === 'error' ? "bg-red-700 text-white" :
      "bg-zinc-800 text-white"
    )}>
      {type === 'success' && <CheckCircle weight="fill" className="w-5 h-5" />}
      {type === 'error' && <WarningCircle weight="fill" className="w-5 h-5" />}
      {type === 'info' && <Info weight="fill" className="w-5 h-5" />}
      {message}
    </div>
  );
}
