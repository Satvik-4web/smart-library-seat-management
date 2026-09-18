import React from 'react';
import { List, SignOut } from '@phosphor-icons/react';
import clsx from 'clsx';

export default function Navbar({ currentView, studentId, onLogout, isAdmin, navigate }) {
  const NavLink = ({ view, label }) => (
    <button 
      onClick={() => navigate(view)}
      className={clsx(
        "transition-colors",
        currentView === view ? "text-[#780000] border-b-2 border-[#780000] pb-1" : "hover:text-[#780000]"
      )}
    >
      {label}
    </button>
  );

  return (
    <header className="w-full flex flex-col shadow-sm relative z-40 bg-white border-b-4 border-[#eab308]">
      {/* Top Banner - Thapar Identity */}
      <div className="bg-[#780000] text-white py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-5 cursor-pointer" onClick={() => navigate('home')}>
          <img 
            src="https://www.thapar.edu/images/logo.png" 
            alt="TIET Logo" 
            className="h-14 object-contain bg-white p-1 rounded hidden sm:block"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-bold tracking-widest text-red-100 uppercase opacity-90">
              Thapar Institute of Engineering & Technology
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5">
              Nava Nalanda Central Library
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold mt-1">Smart Library Infrastructure</span>
          </div>
        </div>
      </div>
      
      {/* Secondary Nav Bar - Library Modules */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-bold text-zinc-600 uppercase tracking-wider">
            <NavLink view="home" label="Home" />
            <NavLink view="about" label="About Us" />
            <NavLink view="services" label="Services" />
            <NavLink view="collections" label="Collections" />
            <NavLink view="resources" label="Resources" />
            <NavLink view="rules" label="Rules" />
            <div className="h-4 w-px bg-zinc-300 mx-2" />
            <button 
              onClick={() => {
                if (studentId) navigate('student');
                else if (isAdmin) navigate('admin');
                else navigate('home');
              }}
              className={clsx(
                "transition-colors",
                (currentView === 'student' || currentView === 'admin') ? "text-[#780000] border-b-2 border-[#780000] pb-1" : "text-[#780000]"
              )}
            >
              LibraryOS
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            {studentId || isAdmin ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-zinc-600 hidden sm:block">
                  {isAdmin ? 'Administrator' : `ID: ${studentId}`}
                </span>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-sm font-bold text-zinc-600 hover:text-red-700 transition-colors"
                >
                  <SignOut weight="bold" />
                  Logout
                </button>
              </div>
            ) : (
              <span className="text-xs font-bold text-zinc-500 hidden sm:block uppercase tracking-widest">Digital Library Services</span>
            )}
            <button className="md:hidden p-2 text-zinc-600 hover:bg-zinc-200 rounded-md">
              <List weight="bold" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
