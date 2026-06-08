import { Link } from 'react-router-dom';

export default function Footer({ content }) {
  const year = new Date().getFullYear();
  const f = content?.footer || {};

  const tagline = f.tagline || 'Handcrafted by Nagaraj Jakkappa';
  const copyrightText = f.copyrightText || 'Techartistry.in';

  return (
    <footer className="bg-navy-950 border-t border-navy-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center gap-5">

        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Go to homepage" className="flex items-center gap-1 group">
          <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
            Tech
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              Artistry
            </span>
          </span>
          <span className="font-mono text-xs text-slate-500 mt-1">.in</span>
        </Link>

        {/* Social + Top – centered row */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          <a
            href={content?.socialLinks?.whatsapp || 'https://wa.me/916362835904'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 whitespace-nowrap"
          >
            WhatsApp
          </a>

          <a
            href={content?.socialLinks?.email && !content.socialLinks.email.startsWith('mailto:') ? `mailto:${content.socialLinks.email}` : content?.socialLinks?.email || 'mailto:nagupoojary33@gmail.com'}
            className="px-3 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 whitespace-nowrap"
          >
            Email
          </a>

          <a
            href={content?.socialLinks?.github || 'https://github.com/Nagaraj-Jakkappa'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 whitespace-nowrap"
          >
            GitHub
          </a>

          <a
            href={content?.socialLinks?.linkedin || 'https://www.linkedin.com/in/nagaraj-jakkappa/'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 whitespace-nowrap"
          >
            LinkedIn
          </a>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group px-3 py-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            aria-label="Back to Top"
          >
            <svg
              className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Top
          </button>
        </div>

        {/* Copyright / build line – centered */}
        <p className="text-slate-500 text-xs font-mono tracking-tight text-center">
          © {year}{' '}
          <span className="text-slate-400">{copyrightText}</span>
          {' | '}Built with{' '}
          {f.builtWithText ? (
            <span className="text-slate-300">{f.builtWithText}</span>
          ) : (
            <>
              <span className="text-blue-400/80">React</span>
              {' + '}
              <span className="text-emerald-400/80">Node.js</span>
              {' + '}
              <span className="text-slate-300">MongoDB</span>
            </>
          )}
        </p>

        {/* Divider */}
        <div className="w-full border-t border-navy-900/50" />

        {/* Handcrafted tagline – centered and subtle */}
        <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em]">
          {tagline}
        </p>

      </div>
    </footer>
  );
}
