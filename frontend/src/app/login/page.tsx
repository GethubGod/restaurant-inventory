'use client';

import { useState } from 'react';
import Cookies from 'js-cookie'; // The tool we just installed
import { useRouter } from 'next/navigation'; // Tool to change pages

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the form from reloading the page

    // 1. Send credentials to Django
    const res = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      
      // 2. Save the "Access Token" in a cookie named 'token'
      // This works like a wristband at a club.
      Cookies.set('token', data.access, { expires: 1 }); // Expires in 1 day
      
      // 3. Kick the user to the Dashboard
      router.push('/dashboard');
    } else {
      alert('Invalid Login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Manager Login</h1>
        
        <input 
          type="text" 
          placeholder="Username" 
          className="w-full p-3 border rounded mb-4 text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 border rounded mb-6 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </main>
  );
}