import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certifications' }, // ✅ Fixed: changed 'name' to 'label'
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = Array.isArray(content?.navbar) && content.navbar.length > 0
    ? [...content.navbar]
        .filter((n) => n.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : NAV_LINKS;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-800 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
            Tech
            <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
              Artistry
            </span>
          </span>
          <span className="font-mono text-xs text-slate-500 mt-1">.in</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
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
                  onClick={() => handleNav(item.href)}
                  className="nav-link cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors hover:text-blue-400"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Section */}
        <div className="hidden md:flex items-center gap-8">
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
            onClick={() => handleNav('#contact')}
            className="btn-primary text-xs font-bold uppercase tracking-widest py-2.5 px-6 rounded-full"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-navy-900/98 backdrop-blur-md border-b border-navy-800`}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((item) => (
            <li key={item.label}>
              {item.type === 'external' ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-base w-full text-left py-2 font-medium transition-colors hover:text-blue-400 block"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => handleNav(item.href)}
                  className="nav-link text-base w-full text-left py-2 font-medium transition-colors hover:text-blue-400"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() => handleNav('#contact')}
              className="btn-primary w-full justify-center mt-2 rounded-full py-3"
            >
              Hire Me
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
