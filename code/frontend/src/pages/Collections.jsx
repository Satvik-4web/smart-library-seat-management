import React from 'react';
import { CaretRight, Books, MonitorPlay, Article, Database } from '@phosphor-icons/react';

export default function Collections({ navigate, showToast }) {
  const collections = [
    { name: 'Print Books', count: '100,000+', icon: <Books /> },
    { name: 'Electronic Books', count: '10,000+', icon: <MonitorPlay /> },
    { name: 'Print Journals & Magazines', count: '150+', icon: <Article /> },
    { name: 'E-Journals', count: '5,000+', icon: <Database /> },
    { name: 'Theses & Dissertations', count: '2,500+', icon: <Books /> },
    { name: 'Reference Collection', count: 'Varies', icon: <Article /> },
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs text-zinc-500 flex items-center gap-2 font-bold uppercase tracking-widest mb-8">
        <button onClick={() => navigate('home')} className="hover:text-[#780000] transition-colors">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800">Library Collections</span>
      </div>

      <h1 className="text-3xl font-bold text-[#780000] mb-8">Nava Nalanda Collections</h1>

      <div className="bg-white border border-zinc-200 rounded p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <div 
              key={idx} 
              onClick={() => showToast(`${col.name} details coming soon.`, 'info')}
              className="flex items-start gap-4 p-4 border border-zinc-100 rounded hover:bg-zinc-50 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 bg-[#780000] text-white rounded flex items-center justify-center shrink-0">
                {React.cloneElement(col.icon, { className: "w-5 h-5", weight: "fill" })}
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 leading-tight">{col.name}</h3>
                <span className="text-sm text-zinc-500 font-semibold">{col.count} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
