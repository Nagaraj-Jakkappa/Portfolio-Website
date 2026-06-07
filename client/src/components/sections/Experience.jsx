import { useState, useEffect } from 'react';
import api from '../../api/axios';

// ── Fallback (only used when API call fails entirely) ─────────────────────────
const DEFAULT_EXPERIENCE = [
  {
    _id: 'default-1',
    title: 'Frontend Development Intern',
    organization: 'Saiket Systems',
    location: 'Remote',
    duration: '1 Month',
    type: 'Internship',
    description:
      'Worked on frontend development tasks focused on building responsive web pages, reusable UI sections, and JavaScript-based mini projects.',
    highlights: [
      'Built responsive frontend components using HTML, CSS, and JavaScript.',
      'Developed mini-projects including quiz app, to-do app, product cards, and landing sections.',
      'Improved mobile responsiveness, spacing, layout consistency, and UI polish.',
      'Practiced task-based frontend development, debugging, and project submission workflow.',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript'],
  },
];

// ── Tech badge ────────────────────────────────────────────────────────────────
function TechBadge({ label }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────
function TypeBadge({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Glowing timeline node ─────────────────────────────────────────────────────
function TimelineNode({ isLast }) {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Glowing circle */}
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/60 bg-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.22)]">
        {/* Outer subtle ring */}
        <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-40" />
        {/* Inner dot */}
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      </div>
      {/* Connector line going down (hidden for last item) */}
      {!isLast && (
        <div className="mt-1 flex-1 w-px bg-gradient-to-b from-cyan-400/30 via-slate-700/40 to-transparent min-h-[2rem]" />
      )}
    </div>
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
function ExperienceCard({ item }) {
  return (
    <div className="group relative bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 sm:p-7 hover:border-cyan-400/40 hover:shadow-[0_4px_40px_rgba(34,211,238,0.07)] transition-all duration-300 overflow-hidden">
      {/* Subtle corner glow on hover */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400/5 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug break-words">
            {item.title}
          </h3>
          <p className="text-cyan-400 font-semibold text-sm mt-0.5 break-words">
            {item.organization}
          </p>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
          {item.type && <TypeBadge label={item.type} />}
        </div>
      </div>

      {/* Meta info row: duration + location */}
      {(item.duration || item.location) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-slate-500 font-mono">
          {item.duration && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {item.duration}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {item.location}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-slate-800/80 mb-4" />

      {/* Description */}
      {item.description && (
        <p className="text-slate-400 text-sm leading-relaxed mb-4 break-words">
          {item.description}
        </p>
      )}

      {/* Highlights */}
      {item.highlights?.length > 0 && (
        <ul className="space-y-2.5 mb-5">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400/70 shrink-0 shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
              <span className="break-words leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tech stack */}
      {item.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
          {item.techStack.map((t, i) => (
            <TechBadge key={i} label={t} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2.25rem_1fr] gap-4 sm:gap-6 pb-8">
      {/* Node skeleton */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
        <div className="flex-1 w-px bg-slate-800/60 min-h-[4rem]" />
      </div>
      {/* Card skeleton */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 animate-pulse">
        <div className="h-5 w-56 bg-slate-800 rounded mb-3" />
        <div className="h-3.5 w-36 bg-slate-800 rounded mb-5" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-5/6 bg-slate-800 rounded" />
          <div className="h-3 w-4/6 bg-slate-800 rounded" />
        </div>
        <div className="flex gap-2 mt-5">
          <div className="h-5 w-14 bg-slate-800 rounded" />
          <div className="h-5 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    api
      .get('/experiences')
      .then((r) => setItems(r.data))
      .catch(() => {
        setApiFailed(true);
        setItems(DEFAULT_EXPERIENCE);
      })
      .finally(() => setLoading(false));
  }, []);

  // Hide section cleanly if API succeeded but returned zero visible items
  if (!loading && !apiFailed && items.length === 0) return null;

  const displayItems = items;

  return (
    <section id="experience" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Page-level background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-cyan-500/[0.025] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── Section header ───────────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <p className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-[0.35em] mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Hands-on Experience
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">
            Practical work, internship tasks, and real project-based development.
          </p>
        </div>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        {loading ? (
          <SkeletonRow />
        ) : (
          <div className="relative">
            {/* Continuous vertical track line */}
            <div
              className="absolute left-[1.125rem] top-4 bottom-4 w-px pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0.08) 60%, transparent 100%)',
              }}
            />

            {displayItems.map((item, idx) => {
              const isLast = idx === displayItems.length - 1;
              return (
                <div
                  key={item._id}
                  className={`relative grid grid-cols-[2.25rem_1fr] gap-4 sm:gap-6 ${
                    isLast ? 'pb-0' : 'pb-10 sm:pb-12'
                  }`}
                >
                  {/* Node column */}
                  <div className="flex flex-col items-center pt-1">
                    <TimelineNode isLast={isLast} />
                  </div>

                  {/* Card column */}
                  <div className="min-w-0">
                    <ExperienceCard item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
