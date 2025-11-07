import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Top Up Game Cepat, Aman, dan Terpercaya
          </h1>
          <p className="mt-4 text-slate-600">
            Isi ulang game favoritmu dalam hitungan detik. Pembayaran fleksibel, bukti transaksi, dan promo menarik setiap hari.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={onStart} className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
              Mulai Top Up
            </button>
            <a href="#games" className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50">
              Jelajahi Games
            </a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-slate-700">
            <div className="flex items-center gap-2"><Zap size={18} className="text-indigo-600"/> Instan</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-indigo-600"/> Aman</div>
            <div className="flex items-center gap-2"><Sparkles size={18} className="text-indigo-600"/> Promo</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-1 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-white grid place-items-center">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHwwfHx8MTc2MjUwNjMwNHww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="gaming" className="rounded-xl w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
