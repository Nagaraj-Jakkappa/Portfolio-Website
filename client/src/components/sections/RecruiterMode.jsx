import React from 'react';

const THEME_MAP = {
  blue: { border: 'border-blue-500/30 hover:border-blue-500/60', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  cyan: { border: 'border-cyan-500/30 hover:border-cyan-500/60', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  emerald: { border: 'border-emerald-500/30 hover:border-emerald-500/60', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  rose: { border: 'border-rose-500/30 hover:border-rose-500/60', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  amber: { border: 'border-amber-500/30 hover:border-amber-500/60', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  violet: { border: 'border-violet-500/30 hover:border-violet-500/60', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  slate: { border: 'border-slate-500/30 hover:border-slate-500/60', bg: 'bg-slate-500/10', text: 'text-slate-400' },
  purple: { border: 'border-violet-500/30 hover:border-violet-500/60', bg: 'bg-violet-500/10', text: 'text-violet-400' },
};

const SIZE_MAP = {
  small: 'col-span-1 row-span-1',
  wide: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  feature: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
};

const FALLBACK_ITEMS = [
  {
    title: 'Admin-Driven Portfolio',
    description: 'Built a custom CMS to manage projects, certificates, content, experience, and messages.',
    icon: '🛠️',
    tag: 'CMS',
    themeColor: 'cyan',
    size: 'feature',
    visible: true,
    order: 1
  },
  {
    title: 'Secure Backend',
    description: 'Protected admin routes, validation, authentication, and clean environment configuration.',
    icon: '🔐',
    tag: 'Security',
    themeColor: 'emerald',
    size: 'small',
    visible: true,
    order: 2
  },
  {
    title: 'Responsive UI System',
    description: 'Optimized layouts for mobile, tablet, desktop, and wide screens with reusable Tailwind patterns.',
    icon: '📱',
    tag: 'UI/UX',
    themeColor: 'rose',
    size: 'small',
    visible: true,
    order: 3
  },
  {
    title: 'SEO & Case Studies',
    description: 'Added project case-study pages, sitemap entries, metadata, and recruiter-friendly project storytelling.',
    icon: '📈',
    tag: 'SEO',
    themeColor: 'amber',
    size: 'wide',
    visible: true,
    order: 4
  }
];

export default function RecruiterMode({ items }) {
  const sourceItems = Array.isArray(items) && items.length > 0 ? items : (items === undefined ? FALLBACK_ITEMS : []);

  const visibleItems = sourceItems
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visibleItems.length === 0) return null;

  return (
    <section
      id="engineering-highlights"
      className="py-24 bg-navy-950 relative overflow-hidden border-t border-white/5"
    >
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs font-semibold mb-4">
              Behind the Code
            </p>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight break-words max-w-3xl">
              Engineering <span className="text-cyan-400">Highlights</span>
            </h2>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5 max-w-md">
            <p className="text-slate-300 text-sm leading-relaxed">
              Focused on scalable product development, modern frontend architecture, and production-oriented systems.
            </p>
          </div>
        </div>

        {/* Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 auto-rows-auto">
          {visibleItems.map((item, idx) => {
            const theme = THEME_MAP[item.themeColor] || THEME_MAP.cyan;
            const sizeClass = SIZE_MAP[item.size] || SIZE_MAP.small;

            return (
              <div
                key={item._id || idx}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-navy-900/40 p-4 sm:p-5 lg:p-6 backdrop-blur-sm transition-all duration-300 hover:bg-navy-800/60 ${theme.border} ${sizeClass} flex flex-col justify-between min-h-[160px]`}
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${theme.bg}`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 ${theme.bg} ${theme.text} text-2xl shadow-lg`}>
                      {item.icon}
                    </div>
                    {item.tag && (
                      <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border border-white/10 ${theme.bg} ${theme.text}`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`font-display font-bold text-xl sm:text-2xl text-white mb-3 group-hover:${theme.text} transition-colors break-words`}>
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed pr-2 break-words">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
