import React from 'react';
import { CaretRight, FolderOpen, ArrowSquareOut } from '@phosphor-icons/react';

export default function Resources({ navigate, showToast }) {
  const resources = [
    { title: 'Question Papers', desc: 'Access previous semester examination papers.' },
    { title: 'NPTEL Video Lectures', desc: 'National Programme on Technology Enhanced Learning.' },
    { title: 'Academic Writing Platform', desc: 'Grammarly and Turnitin access for scholars.' },
    { title: 'E-Library', desc: 'Remote access portal for all electronic resources.' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs text-zinc-500 flex items-center gap-2 font-bold uppercase tracking-widest mb-8">
        <button onClick={() => navigate('home')} className="hover:text-[#780000] transition-colors">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800">Resources</span>
      </div>

      <h1 className="text-3xl font-bold text-[#780000] mb-8">Electronic Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res, idx) => (
          <div 
            key={idx} 
            onClick={() => showToast(`Opening ${res.title}...`, 'info')}
            className="flex items-center justify-between p-6 bg-white border border-zinc-200 rounded shadow-sm hover:border-[#780000] cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-4">
              <FolderOpen className="w-8 h-8 text-zinc-400 group-hover:text-[#780000] transition-colors" weight="duotone" />
              <div>
                <h3 className="font-bold text-zinc-900 leading-tight">{res.title}</h3>
                <span className="text-sm text-zinc-500">{res.desc}</span>
              </div>
            </div>
            <ArrowSquareOut className="w-5 h-5 text-zinc-300 group-hover:text-[#780000] transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
