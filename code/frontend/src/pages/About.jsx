import React from 'react';
import { CaretRight, Building, BookOpen, Users } from '@phosphor-icons/react';

export default function About({ navigate }) {
  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs text-zinc-500 flex items-center gap-2 font-bold uppercase tracking-widest mb-8">
        <button onClick={() => navigate('home')} className="hover:text-[#780000] transition-colors">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800">About Us</span>
      </div>

      <div className="bg-white border border-zinc-200 shadow-sm rounded p-10 lg:p-16 mb-8">
        <h1 className="text-4xl font-bold text-[#780000] mb-6">About Nava Nalanda Central Library</h1>
        
        <div className="prose max-w-none text-zinc-700 leading-relaxed mb-12">
          <p className="text-lg">
            Nava Nalanda Central Library (NNCL) serves as the primary academic information resource for the Thapar Institute of Engineering & Technology, Patiala. Housed in a distinctive five-storey, fully air-conditioned building, it is designed to foster a conducive environment for reading, learning, and research.
          </p>
          <p className="mt-4">
            The library remains open 24x7 to support the rigorous academic schedule of our students and faculty. We offer state-of-the-art technological infrastructure, comprehensive digital resources, and over 1,000 seating capacity to ensure a premium study experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3 p-6 bg-zinc-50 border border-zinc-200 rounded">
            <Building className="w-8 h-8 text-[#780000]" weight="duotone" />
            <h3 className="font-bold text-zinc-900">Infrastructure</h3>
            <p className="text-sm">5 Floors of dedicated study space with designated silent zones, collaborative areas, and modern ergonomic seating.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 bg-zinc-50 border border-zinc-200 rounded">
            <BookOpen className="w-8 h-8 text-[#780000]" weight="duotone" />
            <h3 className="font-bold text-zinc-900">Collections</h3>
            <p className="text-sm">Extensive repository of print books, academic journals, standards, theses, and massive electronic databases accessible remotely.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 bg-zinc-50 border border-zinc-200 rounded">
            <Users className="w-8 h-8 text-[#780000]" weight="duotone" />
            <h3 className="font-bold text-zinc-900">Services</h3>
            <p className="text-sm">From smart seat management (LibraryOS) to reference support, inter-library loans, and plagiarism checking services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
