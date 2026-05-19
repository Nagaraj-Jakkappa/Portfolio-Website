import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-navy-900 py-12 px-6 md:px-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="font-display font-black text-lg tracking-tighter text-white uppercase italic">
            Tech<span className="text-blue-400">Artistry</span>
          </span>

          <span className="font-mono text-[10px] text-slate-600 mt-1">
            .in
          </span>
        </div>

        {/* Copyright */}
        <p className="text-slate-500 text-xs font-mono tracking-tight text-center md:order-none order-last">
          © {year}{' '}
          <span className="text-slate-400">Techartistry.in</span> | Built with{' '}
          <span className="text-blue-400/80">React</span> +
          <span className="text-emerald-400/80"> Node.js</span> +
          <span className="text-slate-300"> MongoDB</span>
        </p>

        {/* Social + Top */}
        <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-slate-500">
          <a
            href="https://github.com/Nagaraj-Jakkappa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/nagaraj-jakkappa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
          >
            LinkedIn
          </a>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }
            className="hover:text-white transition-all duration-300 hover:-translate-y-1"
          >
            ↑ Top
          </button>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-navy-900/50 flex justify-center">
        <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em]">
          Handcrafted by Nagaraj Jakkappa
        </p>
      </div>
    </footer>
  );
}