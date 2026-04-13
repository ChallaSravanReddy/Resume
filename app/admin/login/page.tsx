'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      sessionStorage.setItem('admin-auth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid password. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center dot-grid bg-dark">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary-600/15 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 w-full max-w-md mx-4 z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full btn-primary flex items-center justify-center mx-auto mb-4">
            <FiLock size={28} />
          </div>
          <h1 className="text-2xl font-black gradient-text">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your password to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="admin-label">Password</label>
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="admin-input pr-12"
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 bottom-3 text-slate-400 hover:text-white">
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">← Back to portfolio</a>
        </p>
      </motion.div>
    </div>
  );
}
