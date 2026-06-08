import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

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
    title: 'GitHub Activity',
    description: 'Tracking commits, project improvements, and consistent portfolio development.',
    icon: '⚡',
    tag: 'Development',
    themeColor: 'cyan',
    size: 'feature',
    visible: true,
    order: 1
  },
  {
    title: 'MERN Focus',
    description: 'Building full-stack features with React, Node.js, Express, and MongoDB.',
    icon: '🧩',
    tag: 'Stack',
    themeColor: 'emerald',
    size: 'small',
    visible: true,
    order: 2
  },
  {
    title: 'Production Polish',
    description: 'Improving responsiveness, SEO, admin CMS flows, and recruiter-facing details.',
    icon: '🚀',
    tag: 'Quality',
    themeColor: 'violet',
    size: 'small',
    visible: true,
    order: 3
  }
];

export default function GithubPulse({ items }) {
  const sourceItems = Array.isArray(items) && items.length > 0 ? items : (items === undefined ? FALLBACK_ITEMS : []);

  const visibleItems = sourceItems
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visibleItems.length === 0) return null;

  const selectLastDays = (contributions) => {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 180); // Show last 6 months
    return contributions.filter((activity) => {
      const date = new Date(activity.date);
      return date >= priorDate && date <= today;
    });
  };

  const calendarTheme = {
    light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    dark: ['#161b22', '#0d2d5e', '#1e40af', '#3b82f6', '#60a5fa'], // Custom blue theme
  };

  return (
    <section className="py-24 bg-navy-950/50 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <p className="font-mono text-cyan-400 text-sm tracking-widest uppercase mb-3">
            Live Stream
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white break-words">
            Tech <span className="text-cyan-400">Pulse</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 auto-rows-auto">
          {visibleItems.map((item, idx) => {
            const theme = THEME_MAP[item.themeColor] || THEME_MAP.cyan;
            const sizeClass = SIZE_MAP[item.size] || SIZE_MAP.small;
            
            const isGithub = item.title.toLowerCase().includes('github');

            return (
              <div
                key={item._id || idx}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-navy-900/40 p-4 sm:p-5 lg:p-6 backdrop-blur-sm transition-all duration-300 hover:bg-navy-800/60 ${theme.border} ${sizeClass} flex flex-col justify-between`}
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${theme.bg}`} />
                
                <div className="relative z-10 flex-1 flex flex-col">
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
                  
                  <h3 className={`font-display font-bold text-xl sm:text-2xl mb-3 break-words ${theme.text}`}>
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed pr-2 mb-6 flex-1 break-words">
                    {item.description}
                  </p>

                  {isGithub && (
                    <div className="mt-auto pt-6 border-t border-white/5 overflow-x-auto overflow-y-hidden scrollbar-hide">
                      <div className="min-w-[600px] flex justify-start lg:justify-center">
                        <GitHubCalendar
                          username="Nagaraj-Jakkappa"
                          transformData={selectLastDays}
                          labels={{
                            totalCount: '{{count}} contributions in the last 6 months',
                          }}
                          theme={calendarTheme}
                          fontSize={12}
                          blockSize={12}
                          blockMargin={4}
                          colorScheme="dark"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
