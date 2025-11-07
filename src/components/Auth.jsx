import React, { useState } from 'react';

function saveUser(user){
  localStorage.setItem('tkan_user', JSON.stringify(user));
}
function getUser(){
  const u = localStorage.getItem('tkan_user');
  return u ? JSON.parse(u) : null;
}

export default function Auth({ onSuccess }){
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('tkan_users') || '[]');
    const found = users.find(u => (u.username === form.username || u.email === form.username) && u.password === form.password);
    if(found){
      saveUser({ username: found.username, email: found.email, role: found.role || 'user' });
      setMsg('Login berhasil.');
      onSuccess && onSuccess(getUser());
    } else {
      setMsg('Akun tidak ditemukan atau password salah.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('tkan_users') || '[]');
    if(users.some(u => u.username === form.username || u.email === form.email)){
      setMsg('Username atau email sudah digunakan.');
      return;
    }
    const newUser = { username: form.username, email: form.email, password: form.password, balance: 0, role: 'user', createdAt: Date.now() };
    users.push(newUser);
    localStorage.setItem('tkan_users', JSON.stringify(users));
    saveUser({ username: newUser.username, email: newUser.email, role: 'user' });
    setMsg('Registrasi berhasil.');
    onSuccess && onSuccess(getUser());
  };

  const handleForgot = (e) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random()*900000).toString();
    localStorage.setItem('tkan_reset_code', JSON.stringify({ email: form.email || form.username, code, exp: Date.now()+15*60*1000 }));
    setMsg(`Kode verifikasi terkirim: ${code}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-2 rounded ${mode==='login'?'bg-indigo-600 text-white':'bg-slate-100'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`px-3 py-2 rounded ${mode==='register'?'bg-indigo-600 text-white':'bg-slate-100'}`}>Register</button>
        <button onClick={() => setMode('forgot')} className={`px-3 py-2 rounded ${mode==='forgot'?'bg-indigo-600 text-white':'bg-slate-100'}`}>Lupa Password</button>
      </div>

      {mode==='login' && (
        <form onSubmit={handleLogin} className="space-y-3">
          <input name="username" placeholder="Username / Email" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <button className="w-full py-2 rounded bg-indigo-600 text-white">Login</button>
        </form>
      )}

      {mode==='register' && (
        <form onSubmit={handleRegister} className="space-y-3">
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <button className="w-full py-2 rounded bg-indigo-600 text-white">Daftar</button>
        </form>
      )}

      {mode==='forgot' && (
        <form onSubmit={handleForgot} className="space-y-3">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <button className="w-full py-2 rounded bg-indigo-600 text-white">Kirim Kode</button>
        </form>
      )}

      {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
