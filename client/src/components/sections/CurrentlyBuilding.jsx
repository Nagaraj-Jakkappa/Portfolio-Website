import React from 'react';

const DEFAULT_ITEMS = [
  {
    title: 'Pothole Detection',
    description: 'Upgrading my AI-based pothole detection project with MERN features like image uploads, prediction history, user reports, and admin analytics.',
    status: 'IMPROVING',
    variant: 'large',
    order: 1,
    isActive: true,
  },
  {
    title: 'ThinkFast Quiz',
    description: 'Converting my frontend quiz app into a full MERN quiz platform with authentication, categories, scores, leaderboard, and admin question management.',
    status: 'ACTIVE',
    variant: 'medium',
    order: 2,
    isActive: true,
  },
  {
    title: 'Mood-Based Travel Explorer',
    description: 'Improving the travel explorer frontend into a MERN app with saved trips, mood-based suggestions, user journals, and personalized travel boards.',
    status: 'IMPROVING',
    variant: 'medium',
    order: 3,
    isActive: true,
  },
  {
    title: 'SkyCast Weather Forecast',
    description: 'Building the weather forecast app further with saved locations, forecast history, alerts, user preferences, and clean API integration.',
    status: 'ACTIVE',
    variant: 'small',
    order: 4,
    isActive: true,
  },
  {
    title: 'TaskFlow To-Do List',
    description: 'Upgrading my task manager into a production-ready MERN app with login, task CRUD, priorities, reminders, filters, and dashboard insights.',
    status: 'ACTIVE',
    variant: 'small',
    order: 5,
    isActive: true,
  },
];

const DEFAULT_METRICS = [
  { value: '5', label: 'MERN UPGRADES', order: 1, isActive: true },
  { value: 'JWT', label: 'SECURE AUTH', order: 2, isActive: true },
  { value: 'API', label: 'REST BACKEND', order: 3, isActive: true },
  { value: 'DB', label: 'MONGODB MODELS', order: 4, isActive: true },
];

const STATUS_STYLES = {
  active: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  improving: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  planned: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
  paused: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
};

function getStatusStyle(status) {
  const key = (status || 'active').toLowerCase();
  return STATUS_STYLES[key] || STATUS_STYLES.active;
}

const SIZE_MAP = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-2 row-span-1',
  large: 'col-span-1 md:col-span-2 row-span-2',
};

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

  const METRIC_COLORS = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400', 'text-pink-400', 'text-cyan-400'];

  return (
    <section id="currently-building" className="section-padding bg-navy-950 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Currently Building & Learning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`card-base p-5 animate-pulse ${i === 1 ? SIZE_MAP.large : i <= 3 ? SIZE_MAP.medium : SIZE_MAP.small}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 bg-navy-700 rounded w-1/3" />
                  <div className="h-4 bg-navy-700 rounded w-16" />
                </div>
                <div className="h-3 bg-navy-700 rounded w-full mb-2" />
                <div className="h-3 bg-navy-700 rounded w-5/6" />
              </div>
            ))
          ) : (
            <>
              {items.map((item, i) => (
                <div 
                  key={i} 
                  className={`card-base p-5 group flex flex-col hover:border-slate-500/50 transition-colors ${SIZE_MAP[item.variant] || SIZE_MAP.small}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border ${getStatusStyle(item.status)}`}
                    >
                      {item.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">{item.description}</p>
                </div>
              ))}

              {/* Metrics rendered as bento boxes */}
              {metrics.map((metric, i) => (
                <div key={`metric-${i}`} className="card-base p-5 flex flex-col justify-center items-center text-center col-span-1 row-span-1 hover:border-slate-500/50 transition-colors">
                  <h4 className={`text-3xl font-display font-bold mb-1 ${METRIC_COLORS[i % METRIC_COLORS.length]}`}>
                    {metric.value}
                  </h4>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
