import React from 'react';

const DEFAULT_ITEMS = [
  {
    title: 'ResumeIQ',
    description: 'AI-powered resume intelligence platform leveraging NLP for ATS scoring.',
    status: 'Active',
  },
  {
    title: 'Portfolio Security Upgrade',
    description: 'Implementing FAANG-level backend validation, JWT hardening, and isolated DB roles.',
    status: 'Improving',
  },
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

export default function CurrentlyBuilding({ content }) {
  const items =
    Array.isArray(content?.currentlyBuilding) && content.currentlyBuilding.length > 0
      ? content.currentlyBuilding
      : DEFAULT_ITEMS;

  return (
    <section className="section-padding bg-navy-950 border-t border-navy-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Currently Building */}
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Currently Building & Learning
            </h2>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="card-base p-5 group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border ${getStatusStyle(item.status)}`}
                    >
                      {item.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="flex-1 w-full">
            <h2 className="font-display font-bold text-2xl text-white mb-6">
              Engineering <span className="gradient-text">Impact</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-base p-6 flex flex-col justify-center items-center text-center group">
                <span className="font-display text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">3+</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Production MERN Apps</span>
              </div>
              <div className="card-base p-6 flex flex-col justify-center items-center text-center group">
                <span className="font-display text-4xl md:text-5xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">CMS</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Secure Admin Panel</span>
              </div>
              <div className="card-base p-6 flex flex-col justify-center items-center text-center group">
                <span className="font-display text-4xl md:text-5xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">JWT</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Auth & Validation</span>
              </div>
              <div className="card-base p-6 flex flex-col justify-center items-center text-center group">
                <span className="font-display text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">DB</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Isolated Roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
