import { useState } from 'react';
import { useProjects } from '../../hooks/useData';

function ProjectCard({ project }) {
  const { title, description, techStack, imageUrl, liveUrl, githubUrl, category } = project;

  const CATEGORY_COLOR = {
    web: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    fullstack: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    ml: 'text-purple-400 bg-purple-500/10 border-purple-400/20',
    other: 'text-slate-400 bg-slate-500/10 border-slate-400/20',
  };

  return (
    <div className="card-base card-hover group flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="h-60 bg-navy-700 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-600 flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-blue-400/40">{title[0]}</span>
            </div>
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-mono px-2 py-1 rounded-md border ${CATEGORY_COLOR[category] || CATEGORY_COLOR.other}`}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{description}</p>

        {/* Tech tags */}
        {techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techStack.slice(0, 4).map((t) => (
              <span key={t} className="tag text-xs">{t}</span>
            ))}
            {techStack.length > 4 && (
              <span className="tag text-xs">+{techStack.length - 4}</span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 pt-3 border-t border-navy-700">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.8 1.3 3.48.98.1-.76.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.22-3.22-.12-.3-.52-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 016 0c2.28-1.54 3.28-1.22 3.28-1.22.64 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.22 0 4.6-2.8 5.62-5.48 5.92.44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const { projects, loading, error } = useProjects(false);

  const displayed = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="projects" className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-blue-500 top-20 right-0 opacity-5" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">03 / Projects</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Featured <span className="gradient-text">work</span>
            </h2>
            <a href="https://github.com/Nagaraj-Jakkappa" target="_blank" rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5">
              View all on GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-base h-72 animate-pulse">
                <div className="h-44 bg-navy-700 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-navy-700 rounded w-3/4" />
                  <div className="h-3 bg-navy-700 rounded w-full" />
                  <div className="h-3 bg-navy-700 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-slate-500">
            <p>Could not load projects. Check that the API server is running.</p>
            <p className="text-xs font-mono mt-2 text-red-400/60">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p>No projects yet.</p>
            <p className="text-sm mt-2">Add some from the <a href="/admin" className="text-blue-400 hover:underline">admin dashboard</a>.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
            {projects.length > 6 && (
              <div className="text-center mt-10">
                <button onClick={() => setShowAll((v) => !v)} className="btn-ghost">
                  {showAll ? 'Show Less' : `Show All (${projects.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
