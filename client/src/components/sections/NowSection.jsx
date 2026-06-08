import React from 'react';
import { motion } from 'framer-motion';

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
    category: 'Learning',
    description: 'Mastering MongoDB Aggregation Pipelines and deep-diving into Redux Toolkit for global state management.',
    icon: '🚀',
    themeColor: 'blue',
    size: 'wide',
    visible: true,
    order: 1
  },
  {
    category: 'Building',
    description: 'Refining TechArtistry.in and adding interactive AI simulations to showcase Deep Learning concepts.',
    icon: '🛠️',
    themeColor: 'emerald',
    size: 'small',
    visible: true,
    order: 2
  },
  {
    category: 'Reading',
    description: 'Currently reading "Clean Code" by Robert C. Martin to improve my architectural decision-making.',
    icon: '📖',
    themeColor: 'amber',
    size: 'small',
    visible: true,
    order: 3
  },
  {
    category: 'Current Goal',
    description: 'Securing a Full-Stack Developer role in Bengaluru to contribute to high-impact web products.',
    icon: '🎯',
    themeColor: 'violet',
    size: 'wide',
    visible: true,
    order: 4
  }
];

export default function NowSection({ items }) {
  const sourceItems = Array.isArray(items) && items.length > 0 ? items : (items === undefined ? FALLBACK_ITEMS : []);

  const visibleItems = sourceItems
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visibleItems.length === 0) return null;

  return (
    <section className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Header Area */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                Live Status
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 italic">now</h2>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              This is a snapshot of my current professional focus and personal interests. Inspired
              by the "Now Page" movement.
            </p>
            <p className="text-xs font-mono text-slate-500 italic">Continuously Updated</p>
          </div>

          {/* Bento Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
            {visibleItems.map((item, idx) => {
              const theme = THEME_MAP[item.themeColor] || THEME_MAP.blue;
              const sizeClass = SIZE_MAP[item.size] || SIZE_MAP.small;
              
              return (
                <div
                  key={item._id || idx}
                  className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-navy-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-navy-800/60 ${theme.border} ${sizeClass} flex flex-col justify-between min-h-[160px]`}
                >
                  <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${theme.bg}`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 ${theme.bg} ${theme.text} text-xl shadow-lg`}>
                        {item.icon}
                      </div>
                      <h3 className={`font-display font-bold text-lg ${theme.text}`}>
                        {item.category}
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mt-2 pr-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
