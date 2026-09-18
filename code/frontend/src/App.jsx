import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Collections from './pages/Collections';
import Resources from './pages/Resources';
import Rules from './pages/Rules';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { initializeLibraryState } from './utils/dataManager';
import Toast from './components/Toast';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, about, services, collections, resources, rules, student, admin
  const [studentId, setStudentId] = useState(null);
  const [toast, setToast] = useState(null);
  
  const STORAGE_KEY = 'libraryos_state_v5';
  const ACTIVITY_KEY = 'libraryos_activity_v5';

  const [seats, setSeats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initializeLibraryState();
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seats));
  }, [seats]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
  }, [activityLog]);

  // Real-time shared state across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setSeats(JSON.parse(e.newValue));
      }
      if (e.key === ACTIVITY_KEY) {
        setActivityLog(JSON.parse(e.newValue));
      }
      if (e.key === 'libraryos_current_user') {
        const id = e.newValue;
        if (id && id !== 'ADMIN') {
          setStudentId(id);
          setCurrentView('student');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const handleLogin = (id) => {
    if (id === 'ADMIN') {
      setCurrentView('admin');
      localStorage.setItem('libraryos_current_user', 'ADMIN');
      showToast('Logged in as Administrator');
    } else {
      setStudentId(id);
      setCurrentView('student');
      localStorage.setItem('libraryos_current_user', id);
      showToast(`Welcome, ${id}`);
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setStudentId(null);
    setCurrentView('home');
    localStorage.removeItem('libraryos_current_user');
    showToast('Logged out successfully');
    window.scrollTo(0, 0);
  };

  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const addActivity = (message) => {
    setActivityLog(prev => [
      { id: Date.now(), time: Date.now(), message },
      ...prev
    ].slice(0, 50));
  };

  const updateSeat = (seatId, newStatus, extraData = {}, logMessage = null) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId 
        ? { ...seat, status: newStatus, ...extraData } 
        : seat
    ));
    if (logMessage) {
      addActivity(logMessage);
    }
  };

  const resetDemo = () => {
    setSeats(initializeLibraryState());
    setActivityLog([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session_')) {
        localStorage.removeItem(key);
      }
    });
    showToast('Demo system has been reset to initial state.', 'success');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F9F9F9] text-zinc-900 font-sans selection:bg-[#780000]/20">
      <Navbar 
        currentView={currentView}
        studentId={studentId} 
        isAdmin={currentView === 'admin'} 
        onLogout={handleLogout}
        navigate={navigate}
      />
      
      {currentView === 'home' && <Home onLogin={handleLogin} seats={seats} navigate={navigate} />}
      {currentView === 'about' && <About navigate={navigate} />}
      {currentView === 'services' && <Services navigate={navigate} showToast={showToast} />}
      {currentView === 'collections' && <Collections navigate={navigate} showToast={showToast} />}
      {currentView === 'resources' && <Resources navigate={navigate} showToast={showToast} />}
      {currentView === 'rules' && <Rules navigate={navigate} />}
      
      {currentView === 'student' && (
        <StudentDashboard 
          studentId={studentId} 
          seats={seats}
          updateSeat={updateSeat}
          showToast={showToast}
          navigate={navigate}
        />
      )}
      {currentView === 'admin' && (
        <AdminDashboard 
          seats={seats}
          activityLog={activityLog}
          updateSeat={updateSeat}
          resetDemo={resetDemo}
          navigate={navigate}
        />
      )}
      
      <footer className="bg-zinc-900 text-zinc-300 py-16 mt-auto border-t-[6px] border-[#780000]">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => navigate('home')}>
              <img 
                src="https://www.thapar.edu/images/logo.png" 
                alt="TIET Logo" 
                className="h-16 object-contain bg-white p-1 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div style={{display: 'none'}} className="w-12 h-12 bg-[#780000] text-white font-serif font-bold text-2xl items-center justify-center rounded">
                ti
              </div>
              <div>
                <h3 className="text-white font-bold tracking-wider text-sm uppercase">Thapar Institute of Engineering & Technology</h3>
                <h4 className="text-zinc-400 font-medium">Nava Nalanda Central Library</h4>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-400">
              Bhadson Road, Patiala – 147004<br />
              Punjab, India
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Library Links</h4>
            <ul className="text-sm space-y-3 font-medium">
              <li><button onClick={() => navigate('about')} className="text-zinc-400 hover:text-white transition-colors">Library Profile</button></li>
              <li><button onClick={() => navigate('services')} className="text-zinc-400 hover:text-white transition-colors">Library Services</button></li>
              <li><button onClick={() => navigate('collections')} className="text-zinc-400 hover:text-white transition-colors">Library Collections</button></li>
              <li><button onClick={() => navigate('resources')} className="text-zinc-400 hover:text-white transition-colors">Resources</button></li>
              <li><button onClick={() => navigate('rules')} className="text-zinc-400 hover:text-white transition-colors">Library Rules</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">LIBRARYOS</h4>
            <ul className="text-sm space-y-3 font-medium">
              <li><button onClick={() => navigate('home')} className="text-[#eab308] hover:text-yellow-300 transition-colors">Smart Seat Management</button></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Admin Console</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 mt-16 pt-8 border-t border-zinc-800 text-xs flex flex-col md:flex-row justify-between items-center text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} Thapar Institute of Engineering & Technology. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Prototype — Smart Seat Management System</span>
          </div>
        </div>
      </footer>

      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
