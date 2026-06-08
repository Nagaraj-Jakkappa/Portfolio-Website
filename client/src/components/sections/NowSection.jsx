import React from 'react';
import { motion } from 'framer-motion';

const THEME_MAP = {
  blue: { border: 'border-blue-500', text: 'text-blue-400' },
  cyan: { border: 'border-cyan-500', text: 'text-cyan-400' },
  emerald: { border: 'border-emerald-500', text: 'text-emerald-400' },
  rose: { border: 'border-rose-500', text: 'text-rose-400' },
  amber: { border: 'border-amber-500', text: 'text-amber-400' },
  violet: { border: 'border-violet-500', text: 'text-violet-400' },
  purple: { border: 'border-violet-500', text: 'text-violet-400' }, // fallback for old purple to violet
};

const FALLBACK_ITEMS = [
  {
    category: 'Learning',
    description: 'Mastering MongoDB Aggregation Pipelines and deep-diving into Redux Toolkit for global state management.',
    icon: '🚀',
    themeColor: 'blue',
    visible: true,
    order: 1
  },
  {
    category: 'Building',
    description: 'Refining TechArtistry.in and adding interactive AI simulations to showcase Deep Learning concepts.',
    icon: '🛠️',
    themeColor: 'emerald',
    visible: true,
    order: 2
  },
  {
    category: 'Reading',
    description: 'Currently reading "Clean Code" by Robert C. Martin to improve my architectural decision-making.',
    icon: '📖',
    themeColor: 'amber',
    visible: true,
    order: 3
  },
  {
    category: 'Current Goal',
    description: 'Securing a Full-Stack Developer role in Bengaluru to contribute to high-impact web products.',
    icon: '🎯',
    themeColor: 'violet',
    visible: true,
    order: 4
  }
];

export default function NowSection({ items }) {
  // If items is completely undefined/null, use fallback.
  // If items is an array, map over it.
  const sourceItems = Array.isArray(items) && items.length > 0 ? items : (items === undefined ? FALLBACK_ITEMS : []);

  const visibleItems = sourceItems
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visibleItems.length === 0) return null;

  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Header Area */}
          <div className="md:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                Live Status
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl text-white mb-6 italic">now</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This is a snapshot of my current professional focus and personal interests. Inspired
              by the "Now Page" movement.
            </p>
            <p className="text-xs font-mono text-slate-500 italic">Last updated: April 2026</p>
          </div>

          {/* Grid Area */}
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
            {visibleItems.map((item, idx) => {
              const theme = THEME_MAP[item.themeColor] || THEME_MAP.blue;
              
              // We need to carefully render HTML if description contains bold spans like <span className="text-white font-semibold">
              // For safety and since the previous version had hardcoded spans, we can either use dangerouslySetInnerHTML 
              // or just render it as plain text if it comes from the DB (the admin textarea is plain text anyway).
              // Let's render as plain text because the textarea input doesn't support HTML natively.
              
              return (
                <motion.div
                  key={item._id || idx}
                  whileHover={{ y: -5 }}
                  className={`card-base p-6 border-l-4 bg-navy-900/50 ${theme.border}`}
                >
                  <div className={`text-xl mb-4 ${theme.text}`}>
                    {item.icon} {item.category}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
