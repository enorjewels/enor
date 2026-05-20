'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [pw,    setPw]    = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password: pw }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--cream)' }}
    >
      <div className="w-full max-w-sm px-8 py-12" style={{ background: 'var(--parchment)', border: '1px solid rgba(125,32,53,0.12)' }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-serif italic font-light" style={{ fontSize: 36, lineHeight: 0.9 }}>
            <span className="block" style={{ color: 'var(--noir)' }}>En</span>
            <span className="block" style={{ color: 'var(--burgundy)', paddingLeft: '0.45em' }}>or</span>
          </span>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--berry)' }}>
            Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="w-full px-4 py-3 text-[14px] border bg-transparent outline-none transition-colors"
            style={{
              borderColor: error ? 'var(--rose)' : 'rgba(125,32,53,0.2)',
              color: 'var(--noir)',
            }}
            autoFocus
            required
          />
          {error && (
            <p className="text-[12px]" style={{ color: 'var(--rose)' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 text-[12px] uppercase tracking-[0.14em] transition-colors disabled:opacity-50"
            style={{ background: 'var(--noir)', color: 'var(--cream)' }}
          >
            {loading ? 'Entering…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
