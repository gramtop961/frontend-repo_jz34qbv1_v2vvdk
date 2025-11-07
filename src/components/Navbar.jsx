import React from 'react';
import { Gamepad2, CreditCard, LogIn, LogOut, Trophy, Home } from 'lucide-react';

export default function Navbar({ currentView, setView, user, onLogout }) {
  const link = (key, label, Icon) => (
    <button
      onClick={() => setView(key)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        currentView === key ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-indigo-600 text-white">
            <Gamepad2 size={18} />
          </span>
          <span>TKAN TopUp</span>
        </div>
        <nav className="flex items-center gap-2">
          {link('home', 'Home', Home)}
          {link('topup', 'Top Up', CreditCard)}
          {link('games', 'Games', Gamepad2)}
          {link('leaderboard', 'Leaderboard', Trophy)}
        </nav>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Hi, <span className="font-medium text-slate-800">{user.username}</span></span>
              <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-rose-500 text-white hover:bg-rose-600">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={() => setView('auth')} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
              <LogIn size={16} /> Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
