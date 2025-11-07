import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import TopUpForm from './components/TopUpForm';
import { Trophy, Search, CheckCircle2, XCircle, KeyRound } from 'lucide-react';

function getUser(){
  const u = localStorage.getItem('tkan_user');
  return u ? JSON.parse(u) : null;
}

function getTransactions(){
  return JSON.parse(localStorage.getItem('tkan_transactions') || '[]');
}

function saveTransactions(list){
  localStorage.setItem('tkan_transactions', JSON.stringify(list));
}

function Leaderboard(){
  const users = JSON.parse(localStorage.getItem('tkan_users') || '[]');
  const ranked = [...users]
    .map(u => ({ username: u.username, points: u.points || 0 }))
    .sort((a,b)=>b.points-a.points)
    .slice(0,10);
  return (
    <section className="max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2"><Trophy/> Leaderboard</h2>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r,i)=> (
              <tr key={r.username} className="border-t">
                <td className="py-3 px-4">#{i+1}</td>
                <td className="py-3 px-4">{r.username}</td>
                <td className="py-3 px-4">{r.points}</td>
              </tr>
            ))}
            {ranked.length===0 && (
              <tr>
                <td colSpan="3" className="py-6 text-center text-slate-500">Belum ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Transactions(){
  const [q, setQ] = useState('');
  const list = useMemo(()=> getTransactions().filter(t => !q || t.id.includes(q)), [q]);
  return (
    <section className="max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Cek Transaksi</h2>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center border rounded px-2 w-full max-w-md">
          <Search size={16} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Masukkan ID Transaksi (mis. TRX...)" className="w-full py-2 px-2 outline-none"/>
        </div>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Game</th>
              <th className="py-3 px-4">Nominal</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-3 px-4 font-mono">{t.id}</td>
                <td className="py-3 px-4">{t.username}</td>
                <td className="py-3 px-4 capitalize">{t.game}</td>
                <td className="py-3 px-4">{t.denom} Diamonds</td>
                <td className="py-3 px-4">Rp {t.price.toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${t.status==='PAID'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>
                    {t.status==='PAID' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {list.length===0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500">Tidak ada transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminPanel(){
  const [list, setList] = useState(getTransactions());
  const [q, setQ] = useState('');

  const filtered = useMemo(()=> list.filter(t => !q || t.id.includes(q) || t.username.includes(q)), [list, q]);

  const markPaid = (id) => {
    const updated = list.map(t => t.id===id ? {...t, status: 'PAID'} : t);
    setList(updated);
    saveTransactions(updated);
  };

  const remove = (id) => {
    const updated = list.filter(t => t.id!==id);
    setList(updated);
    saveTransactions(updated);
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Admin</h2>
      <div className="flex items-center gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari ID/username" className="border rounded px-3 py-2 w-full max-w-sm"/>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Game</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-t">
                <td className="py-3 px-4 font-mono">{t.id}</td>
                <td className="py-3 px-4">{t.username}</td>
                <td className="py-3 px-4 capitalize">{t.game}</td>
                <td className="py-3 px-4">Rp {t.price.toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">{t.status}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={()=>markPaid(t.id)} className="px-3 py-1 rounded bg-emerald-600 text-white">Mark Paid</button>
                  <button onClick={()=>remove(t.id)} className="px-3 py-1 rounded bg-rose-600 text-white">Hapus</button>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MiniGames(){
  const [fishScore, setFishScore] = useState(Number(localStorage.getItem('tkan_game_fishit')||0));
  const [gardenScore, setGardenScore] = useState(Number(localStorage.getItem('tkan_game_garden')||0));
  const [pvbScore, setPvbScore] = useState(Number(localStorage.getItem('tkan_game_pvb')||0));

  const add = (key, setter, inc=1) => {
    const v = Number(localStorage.getItem(key)||0)+inc;
    localStorage.setItem(key, v);
    setter(v);
    const users = JSON.parse(localStorage.getItem('tkan_users')||'[]');
    const me = getUser();
    if(me){
      const idx = users.findIndex(u=>u.username===me.username);
      if(idx>=0){
        users[idx].points = (users[idx].points||0)+inc;
        localStorage.setItem('tkan_users', JSON.stringify(users));
      }
    }
  };

  return (
    <section id="games" className="max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Mini Games</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-medium mb-2">Fish It!</h3>
          <p className="text-sm text-slate-600 mb-3">Klik untuk menangkap ikan.</p>
          <button onClick={()=>add('tkan_game_fishit', setFishScore)} className="w-full py-2 rounded bg-indigo-600 text-white">Tangkap Ikan +1</button>
          <p className="mt-2 text-sm">Skor: {fishScore}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-medium mb-2">Grow a Garden</h3>
          <p className="text-sm text-slate-600 mb-3">Sirami tanamanmu.</p>
          <button onClick={()=>add('tkan_game_garden', setGardenScore)} className="w-full py-2 rounded bg-indigo-600 text-white">Siram +1</button>
          <p className="mt-2 text-sm">Skor: {gardenScore}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-medium mb-2">Plant vs Brainrot</h3>
          <p className="text-sm text-slate-600 mb-3">Defend basismu.</p>
          <button onClick={()=>add('tkan_game_pvb', setPvbScore)} className="w-full py-2 rounded bg-indigo-600 text-white">Defend +1</button>
          <p className="mt-2 text-sm">Skor: {pvbScore}</p>
        </div>
      </div>
    </section>
  );
}

export default function App(){
  const [currentView, setView] = useState('home');
  const [user, setUser] = useState(getUser());

  useEffect(()=>{
    const adminExists = (JSON.parse(localStorage.getItem('tkan_users')||'[]')).some(u=>u.username==='admin');
    if(!adminExists){
      const users = JSON.parse(localStorage.getItem('tkan_users')||'[]');
      users.push({ username: 'admin', email: 'admin@tkan', password: 'admin', role: 'admin', points: 0 });
      localStorage.setItem('tkan_users', JSON.stringify(users));
    }
  },[]);

  const handleLogout = () => {
    localStorage.removeItem('tkan_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentView={currentView} setView={setView} user={user} onLogout={handleLogout} />

      {currentView==='home' && (
        <>
          <Hero onStart={()=>setView('topup')} />
          <MiniGames/>
        </>
      )}

      {currentView==='auth' && (
        <div className="py-10"><Auth onSuccess={(u)=>{ setUser(u); setView('home'); }} /></div>
      )}

      {currentView==='topup' && (
        <div className="py-10">
          <TopUpForm user={user} onPaid={()=>setView('transactions')} />
        </div>
      )}

      {currentView==='leaderboard' && (
        <div className="py-10"><Leaderboard/></div>
      )}

      {currentView==='transactions' && (
        <div className="py-10"><Transactions/></div>
      )}

      {user && user.role==='admin' && (
        <div className="py-10"><AdminPanel/></div>
      )}

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} TKAN TopUp. All rights reserved.</footer>
    </div>
  );
}
