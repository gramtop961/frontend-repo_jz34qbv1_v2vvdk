import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Hash, Wallet2 } from 'lucide-react';

const GAMES = [
  { id: 'fishit', name: 'Fish It!', img: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600&auto=format&fit=crop' },
  { id: 'growagarden', name: 'Grow a Garden', img: 'https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=600&auto=format&fit=crop' },
  { id: 'plantvsbrainrot', name: 'Plant vs Brainrot', img: 'https://images.unsplash.com/photo-1511871893393-82e9c16b81e2?q=80&w=600&auto=format&fit=crop' },
];

const DENOMS = [
  { amount: 120, price: 10000 },
  { amount: 300, price: 22000 },
  { amount: 500, price: 35000 },
  { amount: 1000, price: 65000 },
];

function getTransactions(){
  return JSON.parse(localStorage.getItem('tkan_transactions') || '[]');
}
function saveTransactions(list){
  localStorage.setItem('tkan_transactions', JSON.stringify(list));
}

export default function TopUpForm({ user, onPaid }){
  const [game, setGame] = useState(GAMES[0].id);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [denom, setDenom] = useState(DENOMS[0].amount);
  const [method, setMethod] = useState('ewallet');
  const [note, setNote] = useState('');

  const selectedGame = useMemo(() => GAMES.find(g => g.id === game), [game]);
  const selectedDenom = useMemo(() => DENOMS.find(d => d.amount === denom), [denom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!user){
      alert('Harap login terlebih dahulu.');
      return;
    }
    const trx = {
      id: 'TRX' + Date.now(),
      username: user.username,
      game,
      userId,
      zoneId,
      denom,
      price: selectedDenom.price,
      method,
      status: 'UNPAID',
      note,
      createdAt: Date.now()
    };
    const list = getTransactions();
    list.unshift(trx);
    saveTransactions(list);
    alert('Pesanan dibuat. Silakan lakukan pembayaran.');
    onPaid && onPaid(trx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={selectedGame.img} alt="game" className="w-14 h-14 object-cover rounded" />
            <div>
              <h3 className="font-semibold text-slate-800">{selectedGame.name}</h3>
              <p className="text-sm text-slate-500">Top up cepat dan aman</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Pilih Game</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {GAMES.map(g => (
                  <button type="button" key={g.id} onClick={() => setGame(g.id)} className={`rounded-lg p-2 border ${game===g.id?'border-indigo-600 ring-2 ring-indigo-200':'border-slate-200'}`}>
                    <img src={g.img} alt={g.name} className="w-full h-20 object-cover rounded" />
                    <div className="text-xs mt-1">{g.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">User ID</label>
                <div className="flex items-center border rounded px-2"><Hash size={16} className="text-slate-400"/><input value={userId} onChange={e=>setUserId(e.target.value)} required className="w-full py-2 px-2 outline-none" placeholder="123456"/></div>
              </div>
              <div>
                <label className="text-sm text-slate-600">Zone ID</label>
                <div className="flex items-center border rounded px-2"><Hash size={16} className="text-slate-400"/><input value={zoneId} onChange={e=>setZoneId(e.target.value)} required className="w-full py-2 px-2 outline-none" placeholder="7890"/></div>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Nominal</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {DENOMS.map(d => (
                  <button type="button" key={d.amount} onClick={()=>setDenom(d.amount)} className={`rounded-lg p-3 border text-left ${denom===d.amount?'border-indigo-600 ring-2 ring-indigo-200':'border-slate-200'}`}>
                    <div className="font-medium">{d.amount} Diamonds</div>
                    <div className="text-sm text-slate-600">Rp {d.price.toLocaleString('id-ID')}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Metode Pembayaran</label>
              <select value={method} onChange={e=>setMethod(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
                <option value="ewallet">E-Wallet</option>
                <option value="bank">Transfer Bank</option>
                <option value="cod">COD</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Catatan</label>
              <textarea value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" rows={3} placeholder="Opsional" />
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
              <CreditCard size={18}/> Bayar Rp {selectedDenom.price.toLocaleString('id-ID')}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-3 text-slate-800">Ringkasan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Game</span><span>{selectedGame.name}</span></div>
            <div className="flex justify-between"><span>User ID</span><span>{userId || '-'}</span></div>
            <div className="flex justify-between"><span>Zone ID</span><span>{zoneId || '-'}</span></div>
            <div className="flex justify-between"><span>Nominal</span><span>{denom} Diamonds</span></div>
            <div className="flex justify-between"><span>Harga</span><span>Rp {selectedDenom.price.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between"><span>Metode</span><span className="capitalize">{method}</span></div>
          </div>
          <div className="mt-6 rounded-lg bg-indigo-50 p-4 text-indigo-700 flex items-center gap-2">
            <Wallet2 size={18}/> Saldo dan kupon promo segera hadir!
          </div>
        </div>
      </div>
    </section>
  );
}
