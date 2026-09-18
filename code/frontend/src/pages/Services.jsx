import React from 'react';
import { CaretRight, Browsers, HardDrives, BookOpen, Clock, FileText, ArrowSquareOut } from '@phosphor-icons/react';

export default function Services({ navigate, showToast }) {
  const handleExternalClick = (e, name) => {
    e.preventDefault();
    showToast(`External Resource: ${name} is opening in a new tab...`, 'info');
    setTimeout(() => {
      // In a real app, this would be a real URL. For prototype, we just show the toast.
      window.open('https://cl.thapar.edu/', '_blank');
    }, 1000);
  };

  const services = [
    { name: 'Web OPAC', desc: 'Online Public Access Catalogue to search library holdings.', icon: <Browsers /> },
    { name: 'Digital Repository', desc: 'Institutional repository for theses and dissertations.', icon: <HardDrives /> },
    { name: 'Research Support', desc: 'Plagiarism check (Turnitin) and reference management.', icon: <FileText /> },
    { name: 'Remote Access', desc: 'Access electronic resources from outside the campus.', icon: <ArrowSquareOut /> },
    { name: 'GD Room Booking', desc: 'Reserve Group Discussion rooms for collaborative study.', icon: <Clock /> },
    { name: 'New Arrivals', desc: 'Explore recently added books and periodicals.', icon: <BookOpen /> },
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs text-zinc-500 flex items-center gap-2 font-bold uppercase tracking-widest mb-8">
        <button onClick={() => navigate('home')} className="hover:text-[#780000] transition-colors">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800">Library Services</span>
      </div>

      <h1 className="text-3xl font-bold text-[#780000] mb-8">Digital & Physical Library Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <a
            key={idx}
            href="#"
            onClick={(e) => handleExternalClick(e, svc.name)}
            className="group flex flex-col p-6 bg-white border border-zinc-200 rounded shadow-sm hover:border-[#780000] hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-zinc-100 group-hover:bg-red-50 rounded flex items-center justify-center text-[#780000] mb-4 transition-colors">
              {React.cloneElement(svc.icon, { className: "w-6 h-6", weight: "duotone" })}
            </div>
            <h3 className="font-bold text-zinc-900 mb-2 flex items-center justify-between">
              {svc.name}
              <ArrowSquareOut className="w-4 h-4 text-zinc-400 group-hover:text-[#780000] transition-colors" />
            </h3>
            <p className="text-sm text-zinc-600">{svc.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
