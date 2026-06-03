import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — Nagaraj Portfolio</title>
      </Helmet>

      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-blue-600 top-0 left-0 opacity-10" />
        <div className="orb w-64 h-64 bg-cyan-400 bottom-0 right-0 opacity-5" />
        <div className="absolute inset-0 bg-grid-pattern" />

        <div className="relative w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="font-display font-bold text-4xl text-white mb-2 tracking-tight">
              NJ<span className="text-blue-500">.</span>
            </div>
            <p className="text-slate-400 text-sm tracking-wide uppercase font-semibold">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-navy-900/80 backdrop-blur-xl border border-navy-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wide mb-2">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="Enter username"
                className="w-full bg-navy-950 border border-navy-800 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-navy-950 border border-navy-800 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 shadow-inner pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 mt-4 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-center text-xs text-slate-600 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              This area is restricted to the site owner.
            </p>
            <p className="text-center text-[10px] text-slate-600/60 uppercase tracking-wide font-medium cursor-default">
              Forgot password? Use the private owner reset process.
            </p>
            <Link 
              to="/" 
              className="text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
