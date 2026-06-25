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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
