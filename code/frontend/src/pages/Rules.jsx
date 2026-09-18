import React from 'react';
import { CaretRight, ShieldWarning } from '@phosphor-icons/react';

export default function Rules({ navigate }) {
  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs text-zinc-500 flex items-center gap-2 font-bold uppercase tracking-widest mb-8">
        <button onClick={() => navigate('home')} className="hover:text-[#780000] transition-colors">Home</button>
        <CaretRight className="w-3 h-3" />
        <span className="text-zinc-800">Library Rules</span>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <ShieldWarning className="w-10 h-10 text-[#780000]" weight="duotone" />
        <h1 className="text-3xl font-bold text-zinc-900">General Rules & Regulations</h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded p-8 md:p-12 shadow-sm prose max-w-none text-zinc-700">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">1. Silence and Decorum</h3>
        <ul className="list-disc pl-5 mb-8 space-y-2">
          <li>Complete silence must be maintained in and around the library.</li>
          <li>Mobile phones must be kept on silent mode. Using mobile phones for conversation inside the reading halls is strictly prohibited.</li>
        </ul>

        <h3 className="text-lg font-bold text-zinc-900 mb-4">2. Seat Management (LibraryOS)</h3>
        <ul className="list-disc pl-5 mb-8 space-y-2">
          <li>Students must explicitly log in and occupy a seat via the Smart Seat Management portal before sitting.</li>
          <li>Students leaving their seat for short breaks (washroom, coffee) must mark themselves as "Temporarily Away".</li>
          <li>The maximum allowed break time is 30 minutes. If a student does not return within 30 minutes, the system will automatically release the seat for others.</li>
          <li>Do not leave valuable belongings unattended. The library is not responsible for lost items.</li>
        </ul>

        <h3 className="text-lg font-bold text-zinc-900 mb-4">3. Prohibited Items</h3>
        <ul className="list-disc pl-5 mb-8 space-y-2">
          <li>Food and beverages (except water in spill-proof bottles) are not allowed inside the reading areas.</li>
          <li>Smoking is strictly prohibited within the library premises.</li>
        </ul>

        <h3 className="text-lg font-bold text-zinc-900 mb-4">4. Checkout and Issue</h3>
        <ul className="list-disc pl-5 mb-8 space-y-2">
          <li>Books must be properly issued at the circulation desk before leaving the library.</li>
          <li>Students must show their ID card upon request by library staff.</li>
        </ul>
      </div>
    </div>
  );
}
