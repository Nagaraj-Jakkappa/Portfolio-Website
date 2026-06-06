import { Link } from 'react-router-dom';

export default function Footer({ content }) {
  const year = new Date().getFullYear();
  const f = content?.footer || {};
  
  const brandName = f.brandName || "Techartistry";
  const tagline = f.tagline || "Handcrafted by Nagaraj Jakkappa";
  const copyrightText = f.copyrightText || "Techartistry.in";

  return (
    <footer className="bg-navy-950 border-t border-navy-900 py-12 px-6 md:px-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group md:order-first">
          <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
            Tech
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              Artistry
            </span>
          </span>
          <span className="font-mono text-xs text-slate-500 mt-1">.in</span>
        </Link>

        {/* Copyright */}
        <p className="text-slate-500 text-xs font-mono tracking-tight text-center md:order-none order-last">
          © {year} <span className="text-slate-400">{copyrightText}</span> | Built with{' '}
          {f.builtWithText ? (
            <span className="text-slate-300">{f.builtWithText}</span>
          ) : (
            <>
              <span className="text-blue-400/80">React</span> +
              <span className="text-emerald-400/80"> Node.js</span> +
              <span className="text-slate-300"> MongoDB</span>
            </>
          )}
        </p>

        {/* Social + Top */}
        <div className="flex items-center gap-3 md:gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          <a
            href="https://github.com/Nagaraj-Jakkappa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/nagaraj-jakkappa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            LinkedIn
          </a>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="group px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 ml-2"
            aria-label="Back to Top"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Top
          </button>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-navy-900/50 flex justify-center">
        <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em]">
          {tagline}
        </p>
      </div>
    </footer>
  );
}
