import { useState, useEffect } from 'react';
import api from '../../api/axios';

// ── Fallback default content ─────────────────────────────────────────────────
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

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Single experience card ────────────────────────────────────────────────────
function ExperienceCard({ item }) {
  return (
    <div className="relative bg-navy-900/60 border border-navy-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/30 transition-all duration-300 group">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug break-words">
            {item.title}
          </h3>
          <p className="text-blue-400 font-semibold mt-0.5 text-sm sm:text-base">
            {item.organization}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
          {item.type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              {item.type}
            </span>
          )}
          {item.duration && (
            <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
              {item.duration}
            </span>
          )}
          {item.location && (
            <span className="text-xs text-slate-600 whitespace-nowrap">
              📍 {item.location}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-slate-400 text-sm leading-relaxed mb-5 break-words">
          {item.description}
        </p>
      )}

      {/* Highlights */}
      {item.highlights?.length > 0 && (
        <ul className="space-y-2 mb-5">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="break-words">{h}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tech Stack */}
      {item.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-navy-800">
          {item.techStack.map((t, i) => (
            <Badge key={i} label={t} />
          ))}
        </div>
      )}

      {/* Decorative glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 sm:p-8 animate-pulse">
      <div className="h-6 w-64 bg-navy-800 rounded mb-3" />
      <div className="h-4 w-40 bg-navy-800 rounded mb-6" />
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-navy-800 rounded" />
        <div className="h-3 w-5/6 bg-navy-800 rounded" />
        <div className="h-3 w-4/6 bg-navy-800 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-navy-800 rounded" />
        <div className="h-5 w-20 bg-navy-800 rounded" />
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get('/experiences')
      .then((r) => setItems(r.data))
      .catch(() => {
        setError(true);
        setItems(DEFAULT_EXPERIENCE);
      })
      .finally(() => setLoading(false));
  }, []);

  // Hide section if no items and not loading (and no error)
  if (!loading && !error && items.length === 0) return null;

  return (
    <section id="experience" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-[0.3em] mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Hands-on Experience
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed">
            Practical work, internship tasks, and real project-based development.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <ExperienceCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
