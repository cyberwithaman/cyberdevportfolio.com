"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        let errorMessage = 'Invalid username or password';

        try {
          // Try to parse as JSON, but don't fail if it's not JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.error('Response was not valid JSON:', errorText);
          // If it's not JSON (like HTML), use a generic error
          errorMessage = 'Server returned an unexpected response format';
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Try to parse the JSON response
      let data;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse JSON response', error);
        setError('Server returned an invalid response');
        setLoading(false);
        return;
      }

      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg backdrop-blur-sm p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm font-medium mb-4">
            ADMIN ACCESS
          </span>
          <h1 className="text-2xl font-bold text-zinc-100">Admin Login</h1>
          <p className="text-zinc-500 mt-2">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm rounded-md bg-red-500/10 text-red-400 border border-red-500/20 flex items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[var(--foreground)] text-sm font-bold mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--primary)]">
                <FontAwesomeIcon icon={faUser} />
              </span>              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm pl-10 px-4 py-2.5"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-[var(--foreground)] text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--primary)]">
                <FontAwesomeIcon icon={faLock} />
              </span>              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm pl-10 px-4 py-2.5"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md text-sm font-medium flex items-center justify-center gap-2 border border-zinc-800/50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></span>
            ) : (
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;