import React from 'react';

const DEFAULT_ITEMS = [
  {
    title: 'Pothole Detection',
    description: 'Upgrading my AI-based pothole detection project with MERN features like image uploads, prediction history, user reports, and admin analytics.',
    status: 'IMPROVING',
    color: 'emerald',
    size: 'wide',
    order: 1,
    isActive: true,
  },
  {
    title: 'ThinkFast Quiz',
    description: 'Converting my frontend quiz app into a full MERN quiz platform with authentication, categories, scores, leaderboard, and admin question management.',
    status: 'ACTIVE',
    color: 'cyan',
    size: 'normal',
    order: 2,
    isActive: true,
  },
  {
    title: 'Mood-Based Travel Explorer',
    description: 'Improving the travel explorer frontend into a MERN app with saved trips, mood-based suggestions, user journals, and personalized travel boards.',
    status: 'IMPROVING',
    color: 'violet',
    size: 'normal',
    order: 3,
    isActive: true,
  },
  {
    title: 'SkyCast Weather Forecast',
    description: 'Building the weather forecast app further with saved locations, forecast history, alerts, user preferences, and clean API integration.',
    status: 'ACTIVE',
    color: 'blue',
    size: 'compact',
    order: 4,
    isActive: true,
  },
  {
    title: 'TaskFlow To-Do List',
    description: 'Upgrading my task manager into a production-ready MERN app with login, task CRUD, priorities, reminders, filters, and dashboard insights.',
    status: 'ACTIVE',
    color: 'amber',
    size: 'compact',
    order: 5,
    isActive: true,
  },
];

const DEFAULT_METRICS = [
  { value: '5', label: 'MERN UPGRADES', color: 'blue', size: 'normal', order: 1, isActive: true },
  { value: 'JWT', label: 'SECURE AUTH', color: 'cyan', size: 'large', order: 2, isActive: true },
  { value: 'API', label: 'REST BACKEND', color: 'emerald', size: 'normal', order: 3, isActive: true },
  { value: 'DB', label: 'MONGODB MODELS', color: 'violet', size: 'large', order: 4, isActive: true },
];

const THEME_COLORS = {
  blue: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10', hover: 'hover:border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  cyan: { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', hover: 'hover:border-cyan-500/50', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', hover: 'hover:border-emerald-500/50', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', hover: 'hover:border-amber-500/50', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  violet: { text: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/10', hover: 'hover:border-violet-500/50', badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10', hover: 'hover:border-purple-500/50', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  rose: { text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10', hover: 'hover:border-rose-500/50', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

function getTheme(color) {
  return THEME_COLORS[color] || THEME_COLORS.cyan;
}

function getCardSizeClass(size) {
  if (size === 'wide') return 'md:col-span-2 p-6';
  if (size === 'compact') return 'md:col-span-1 p-4';
  return 'md:col-span-1 p-5';
}

function getMetricSizeClass(size) {
  if (size === 'large') return 'text-5xl md:text-6xl';
  return 'text-4xl md:text-5xl';
}

export default function CurrentlyBuilding({ content, loading }) {
  const rawItems = Array.isArray(content?.currentlyBuilding) && content.currentlyBuilding.length > 0
    ? content.currentlyBuilding
    : DEFAULT_ITEMS;
  
  const items = rawItems
    .filter(i => i.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const rawMetrics = Array.isArray(content?.impactMetrics) && content.impactMetrics.length > 0
    ? content.impactMetrics
    : DEFAULT_METRICS;
    
  const metrics = rawMetrics
    .filter(m => m.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="currently-building" className="section-padding bg-navy-950 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Currently Building */}
          <div className="flex-1 w-full">
            <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Currently Building & Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(140px,auto)]">
              {loading ? (
                [1, 2, 3, 4, 5].map((num, idx) => (
                  <div key={num} className={`card-base p-5 animate-pulse ${idx === 0 ? 'md:col-span-2' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-4 bg-navy-700 rounded w-1/3" />
                      <div className="h-4 bg-navy-700 rounded w-16" />
                    </div>
                    <div className="h-3 bg-navy-700 rounded w-full mb-2" />
                    <div className="h-3 bg-navy-700 rounded w-5/6" />
                  </div>
                ))
              ) : (
                items.map((item, i) => {
                  const theme = getTheme(item.color);
                  const sizeClass = getCardSizeClass(item.size);
                  return (
                    <div key={i} className={`card-base flex flex-col transition-colors border-transparent ${theme.hover} ${sizeClass}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border whitespace-nowrap ml-3 ${theme.badge}`}
                        >
                          {item.status || 'Active'}
                        </span>
                      </div>
                      <p className={`text-slate-400 leading-relaxed flex-grow ${item.size === 'compact' ? 'text-xs' : 'text-sm'}`}>
                        {item.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="flex-1 w-full">
            <h2 className="font-display font-bold text-2xl text-white mb-6">
              Engineering <span className="gradient-text">Impact</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-base p-6 flex flex-col justify-center items-center text-center animate-pulse min-h-[140px]">
                    <div className="h-10 bg-navy-700 rounded-md w-16 mb-4" />
                    <div className="h-3 bg-navy-700 rounded w-24" />
                  </div>
                ))
              ) : (
                metrics.map((metric, i) => {
                  const theme = getTheme(metric.color);
                  const metricSize = getMetricSizeClass(metric.size);
                  return (
                    <div key={i} className={`card-base p-6 flex flex-col justify-center items-center text-center group border-transparent ${theme.hover}`}>
                      <span className={`font-display font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${metricSize} ${theme.text}`}>
                        {metric.value}
                      </span>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                        {metric.label}
                      </span>
                      {metric.description && (
                        <span className="text-[10px] text-slate-500 mt-2 block">
                          {metric.description}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
