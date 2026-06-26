import React from 'react';

const DEFAULT_ITEMS = [
  {
    title: 'Pothole Detection',
    description: 'Upgrading my AI-based pothole detection project with MERN features like image uploads, prediction history, user reports, and admin analytics.',
    status: 'IMPROVING',
    color: 'emerald',
    size: 'small',
    order: 1,
    isActive: true,
  },
  {
    title: 'ThinkFast Quiz',
    description: 'Converting my frontend quiz app into a full MERN quiz platform with authentication, categories, scores, leaderboard, and admin question management.',
    status: 'ACTIVE',
    color: 'cyan',
    size: 'small',
    order: 2,
    isActive: true,
  },
  {
    title: 'Mood-Based Travel Explorer',
    description: 'Improving the travel explorer frontend into a MERN app with saved trips, mood-based suggestions, user journals, and personalized travel boards.',
    status: 'IMPROVING',
    color: 'violet',
    size: 'wide',
    order: 3,
    isActive: true,
  },
  {
    title: 'SkyCast Weather Forecast',
    description: 'Building the weather forecast app further with saved locations, forecast history, alerts, user preferences, and clean API integration.',
    status: 'ACTIVE',
    color: 'blue',
    size: 'small',
    order: 4,
    isActive: true,
  },
  {
    title: 'TaskFlow To-Do List',
    description: 'Upgrading my task manager into a production-ready MERN app with login, task CRUD, priorities, reminders, filters, and dashboard insights.',
    status: 'ACTIVE',
    color: 'amber',
    size: 'small',
    order: 5,
    isActive: true,
  },
];

const DEFAULT_METRICS = [
  { value: '5', label: 'MERN UPGRADES', color: 'blue', size: 'small', order: 1, isActive: true },
  { value: 'JWT', label: 'SECURE AUTH', color: 'cyan', size: 'small', order: 2, isActive: true },
  { value: 'API', label: 'REST BACKEND', color: 'emerald', size: 'wide', order: 3, isActive: true },
  { value: 'DB', label: 'MONGODB MODELS', color: 'violet', size: 'wide', order: 4, isActive: true },
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
  if (size === 'wide') return 'md:col-span-2 md:row-span-1 p-6';
  if (size === 'tall') return 'md:col-span-1 md:row-span-2 p-5';
  if (size === 'feature') return 'md:col-span-2 md:row-span-2 p-6';
  if (size === 'full') return 'w-full p-6';
  // Default small
  return 'md:col-span-1 md:row-span-1 p-5';
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

  const topBuildingItems = items.slice(0, 3);
  const bottomBuildingItems = items.slice(3);

  const rawMetrics = Array.isArray(content?.impactMetrics) && content.impactMetrics.length > 0
    ? content.impactMetrics
    : DEFAULT_METRICS;
    
  const metrics = rawMetrics
    .filter(m => m.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="currently-building" className="section-padding bg-navy-950 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP AREA (Left: Currently Building, Right: Engineering Impact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-8 lg:mb-12">
          
          {/* Left Column: Currently Building Top Items */}
          <div className="w-full">
            <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Currently Building & Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 auto-rows-[minmax(140px,auto)]">
              {loading ? (
                [1, 2, 3].map((num, idx) => (
                  <div key={num} className={`card-base p-5 animate-pulse ${idx === 2 ? 'md:col-span-2' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-4 bg-navy-700 rounded w-1/3" />
                      <div className="h-4 bg-navy-700 rounded w-16" />
                    </div>
                    <div className="h-3 bg-navy-700 rounded w-full mb-2" />
                    <div className="h-3 bg-navy-700 rounded w-5/6" />
                  </div>
                ))
              ) : (
                topBuildingItems.map((item, i) => {
                  const theme = getTheme(item.color);
                  // Force index 0 and 1 to small, index 2 to wide, but allow item.size to override if they are explicitly different than default
                  let effectiveSize = item.size;
                  if (!effectiveSize) {
                    if (i === 0 || i === 1) effectiveSize = 'small';
                    if (i === 2) effectiveSize = 'wide';
                  }
                  
                  // For sketch exact match, we can strictly enforce it if we want, but let's just use effectiveSize
                  const sizeClass = getCardSizeClass(effectiveSize);
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
                      <p className={`text-slate-400 leading-relaxed flex-grow ${item.size === 'small' ? 'text-xs' : 'text-sm'}`}>
                        {item.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Engineering Impact Metrics */}
          <div className="w-full">
            <h2 className="font-display font-bold text-2xl text-white mb-6">
              Engineering <span className="gradient-text">Impact</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
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
                  // For metrics, "wide" makes it span 2 columns and flow horizontally
                  const isWide = metric.size === 'wide' || metric.size === 'large'; 
                  
                  if (isWide) {
                    return (
                      <div key={i} className={`md:col-span-2 card-base p-6 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left group border-transparent ${theme.hover}`}>
                        <div className="mb-2 sm:mb-0">
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono block mb-1">
                            {metric.label}
                          </span>
                          {metric.description && (
                            <span className="text-[10px] text-slate-500 max-w-[200px] block">
                              {metric.description}
                            </span>
                          )}
                        </div>
                        <span className={`font-display font-bold text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300 ${theme.text}`}>
                          {metric.value}
                        </span>
                      </div>
                    );
                  }

                  // Default small/compact vertical metric card
                  return (
                    <div key={i} className={`md:col-span-1 card-base p-6 flex flex-col justify-center items-center text-center group border-transparent ${theme.hover}`}>
                      <span className={`font-display font-bold text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform duration-300 ${theme.text}`}>
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

        {/* BOTTOM AREA (Full Width: Remaining Currently Building Items) */}
        {bottomBuildingItems.length > 0 && (
          <div className="flex flex-col gap-4 lg:gap-5">
            {loading ? (
              [4, 5].map((num) => (
                <div key={num} className="card-base p-6 animate-pulse w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-4 bg-navy-700 rounded w-1/3" />
                    <div className="h-4 bg-navy-700 rounded w-16" />
                  </div>
                  <div className="h-3 bg-navy-700 rounded w-full mb-2" />
                  <div className="h-3 bg-navy-700 rounded w-5/6" />
                </div>
              ))
            ) : (
              bottomBuildingItems.map((item, i) => {
                const theme = getTheme(item.color);
                let effectiveSize = item.size;
                if (!effectiveSize) {
                  effectiveSize = 'full';
                }
                const sizeClass = getCardSizeClass(effectiveSize);
                return (
                  <div key={i + 3} className={`card-base flex flex-col transition-colors border-transparent ${theme.hover} ${sizeClass}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border whitespace-nowrap ml-3 ${theme.badge}`}
                      >
                        {item.status || 'Active'}
                      </span>
                    </div>
                    <p className={`text-slate-400 leading-relaxed flex-grow ${item.size === 'small' ? 'text-xs' : 'text-sm'}`}>
                      {item.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </section>
  );
}
