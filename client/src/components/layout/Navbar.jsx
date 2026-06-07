import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks =
    Array.isArray(content?.navbar) && content.navbar.length > 0
      ? [...content.navbar]
          .filter((n) => n.visible !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      : NAV_LINKS;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleNav = (href) => {
    setOpen(false);
    if (!isHome) {
      window.location.href = '/' + href;
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Fixed header bar ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-800 shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group shrink-0">
            <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
              Tech
              <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                Artistry
              </span>
            </span>
            <span className="font-mono text-xs text-slate-500 mt-1">.in</span>
          </Link>

          {/* Desktop nav links – shown at lg+ */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => (
              <li key={item.label}>
                {item.type === 'external' ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors hover:text-blue-400"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNav(item.href)}
                    className="nav-link cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors hover:text-blue-400"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA – shown at lg+ */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="https://github.com/Nagaraj-Jakkappa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.8 1.3 3.48.98.1-.76.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.22-3.22-.12-.3-.52-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 016 0c2.28-1.54 3.28-1.22 3.28-1.22.64 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.22 0 4.6-2.8 5.62-5.48 5.92.44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => handleNav('#contact')}
              className="btn-primary text-xs font-bold uppercase tracking-widest py-2.5 px-6 rounded-full"
            >
              Hire Me
            </button>
          </div>

          {/* Hamburger – shown below lg */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/60 text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${
                  open ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-opacity duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${
                  open ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer – rendered OUTSIDE <header> ─────────────────── */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[9999] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel – slides from top */}
          <div className="relative z-10 mx-4 mt-24 bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden">
            <nav className="p-5">
              <ul className="flex flex-col gap-1">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    {item.type === 'external' ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNav(item.href)}
                        className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-left"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA inside drawer */}
              <div className="mt-4 pt-4 border-t border-navy-800 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleNav('#contact')}
                  className="btn-primary w-full justify-center rounded-full py-3 text-sm font-bold uppercase tracking-widest"
                >
                  Hire Me
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
