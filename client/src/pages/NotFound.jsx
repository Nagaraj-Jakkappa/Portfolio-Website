import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found</title>
      </Helmet>
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-blue-600 top-0 left-0 opacity-10" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-4">
            Error 404
          </p>
          <h1 className="font-display font-extrabold text-8xl text-white mb-4 gradient-text">
            404
          </h1>
          <p className="text-slate-400 text-lg mb-8">This page doesn't exist.</p>
          <Link to="/" className="btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
