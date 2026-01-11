'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      Cookies.set('token', data.access, { expires: 1 });
      router.push('/fulfillment');
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f8] to-[#dce7ff] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div>
            <p className="text-sm opacity-80">Babytuna Systems</p>
            <h2 className="text-3xl font-bold mt-2">Welcome back</h2>
            <p className="mt-4 text-sm opacity-90">
              Sign in to place orders, track fulfillment, and manage locations.
            </p>
          </div>
          <div className="space-y-2 text-sm opacity-90">
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6 bg-white">
          <div>
            <p className="text-sm text-gray-500">Access</p>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="manager"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
