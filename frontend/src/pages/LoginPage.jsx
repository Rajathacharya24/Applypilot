import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

export default function LoginPage() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await apiClient.post('/auth/register', { name, email, password });
        setSuccessMsg('Account registered successfully! Logging you in...');
        await login(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isRegister ? 'Registration failed. Email might already exist.' : 'Unable to sign in. Check credentials.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
      <div className="relative w-full max-w-md">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <section className="relative w-full rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 font-black text-2xl text-white shadow-lg mb-4">
              AP
            </div>
            <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-sky-400">ApplyPilot</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              {isRegister
                ? 'Join ApplyPilot to organize and automate your job applications'
                : 'Sign in to access your interactive application pipeline'}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-950/60 p-1 border border-white/5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`rounded-xl py-2.5 transition ${!isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`rounded-xl py-2.5 transition ${isRegister ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {isRegister ? (
              <label className="grid gap-1.5 text-xs font-bold text-slate-300">
                Full Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-950"
                  placeholder="Jane Doe"
                  required
                />
              </label>
            ) : null}

            <label className="grid gap-1.5 text-xs font-bold text-slate-300">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-950"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="grid gap-1.5 text-xs font-bold text-slate-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-950"
                placeholder="••••••••"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300">
                {error}
              </div>
            ) : null}

            {successMsg ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                {successMsg}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (isRegister ? 'Creating Account...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}