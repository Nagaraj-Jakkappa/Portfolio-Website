import { Link } from 'react-router-dom';

const getWhatsAppHref = (value) => {
  if (!value) return 'https://wa.me/916362835904';
  if (value.startsWith('http')) return value;
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('91') ? digits : `91${digits}`;
  return `https://wa.me/${normalized}`;
};export default function Footer({ content }) {
  const year = new Date().getFullYear();
  const f = content?.footer || {};

  const tagline = f.tagline || 'Handcrafted by Nagaraj Jakkappa';
  const copyrightText = f.copyrightText || 'Techartistry.in';

  return (
    <footer className="bg-navy-950 border-t border-navy-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center gap-5">

        <a href="https://www.techartistry.in/" aria-label="Go to Techartistry homepage" className="flex items-center gap-1 group">
          <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
            Tech
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              Artistry
            </span>
          </span>
          <span className="font-mono text-xs text-slate-500 mt-1">.in</span>
        </a>

        {/* Social + Top – centered row */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-500">
          <a
            href={getWhatsAppHref(content?.socialLinks?.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>

          <a
            href={content?.socialLinks?.email && !content.socialLinks.email.startsWith('mailto:') ? `mailto:${content.socialLinks.email}` : content?.socialLinks?.email || 'mailto:nagupoojary33@gmail.com'}
            aria-label="Email"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </a>

          <a
            href={content?.socialLinks?.github || 'https://github.com/Nagaraj-Jakkappa'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <a
            href={content?.socialLinks?.linkedin || 'https://www.linkedin.com/in/nagaraj-jakkappa/'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-800 bg-navy-900 hover:bg-navy-800 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="group inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
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
