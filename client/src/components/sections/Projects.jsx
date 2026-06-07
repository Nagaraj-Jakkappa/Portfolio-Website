import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useData';

function getCaseStudy(title) {
  const t = title.toLowerCase();
  if (t.includes('resume') || t.includes('ai')) {
    return {
      problem: "ATS systems filter out qualified candidates due to keyword mismatches.",
      solution: "An AI-powered resume analyzer that matches job descriptions and suggests optimizations using NLP.",
      impact: "Simulated 40% increase in ATS pass rates during testing phase."
    };
  }
  if (t.includes('portfolio') || t.includes('cms')) {
    return {
      problem: "Needed a scalable, recruiter-friendly way to manage portfolio content without hardcoding data.",
      solution: "Built a secure MERN stack CMS with JWT auth, isolated MongoDB roles, and strict input validation.",
      impact: "Created a fully dynamic, secure system reducing update time to seconds."
    };
  }
  return {
    problem: "Needed an efficient and user-friendly solution for this domain.",
    solution: "Developed a responsive web application focusing on core usability and clean code.",
    impact: "Delivered a functional, high-performance product meeting all requirements."
  };
}

function ProjectCard({ project }) {
  const { title, description, techStack, imageUrl, liveUrl, githubUrl, category } = project;
  const [expanded, setExpanded] = useState(false);
  
  const dbCaseStudy = project.caseStudy;
  const hasDbCaseStudy = dbCaseStudy?.problem || dbCaseStudy?.solution || dbCaseStudy?.impact;
  const caseStudy = hasDbCaseStudy ? dbCaseStudy : getCaseStudy(title);

  const CATEGORY_COLOR = {
    web: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    fullstack: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    ml: 'text-purple-400 bg-purple-500/10 border-purple-400/20',
    other: 'text-slate-400 bg-slate-500/10 border-slate-400/20',
  };

  return (
    <div className="card-base group flex flex-col overflow-hidden transition-all duration-300">
      {/* Thumbnail */}
      <div className="h-56 bg-navy-700 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Project thumbnail"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400/0f172a/38bdf8?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-blue-400/40">{title[0]}</span>
            </div>
          </div>
        )}
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-mono px-2 py-1 rounded-md border ${CATEGORY_COLOR[category] || CATEGORY_COLOR.other}`}
        >
          {category}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-white text-xl mb-2 break-words group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        {/* Tech tags */}
        {techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techStack.map((t) => (
              <span key={t} className="tag text-[10px] bg-navy-800 border-navy-700 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="text-slate-400 text-sm leading-relaxed mb-4 break-words">{description}</p>

        {/* Case Study Toggle */}
        <div className="mt-auto pt-4 border-t border-navy-700/50">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-3"
          >
            {expanded ? '- Hide Case Study' : '+ View Case Study'}
          </button>
          
          {expanded && (
            <div className="space-y-3 text-sm text-slate-300 bg-navy-900/50 p-4 rounded-lg border border-navy-700 mb-4 animate-fade-up break-words">
              {caseStudy.problem && (
                <div>
                  <strong className="text-white text-xs uppercase font-mono tracking-wider block mb-1">Problem:</strong>
                  <span className="text-slate-400">{caseStudy.problem}</span>
                </div>
              )}
              {caseStudy.solution && (
                <div>
                  <strong className="text-white text-xs uppercase font-mono tracking-wider block mb-1">Solution:</strong>
                  <span className="text-slate-400">{caseStudy.solution}</span>
                </div>
              )}
              {caseStudy.impact && (
                <div>
                  <strong className="text-emerald-400 text-xs uppercase font-mono tracking-wider block mb-1">Impact:</strong>
                  <span className="text-emerald-400/80">{caseStudy.impact}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-3">
          {project.slug && (
            <Link
              to={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded transition-colors w-full sm:w-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Read Case Study
            </Link>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded transition-colors w-full sm:w-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 px-3 py-1.5 rounded transition-colors w-full sm:w-auto"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const { projects, loading, error } = useProjects(false);

  const filters = ['All', 'Full Stack', 'Frontend', 'Backend', 'React', 'Node.js'];

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'All') return true;
    const stack = p.techStack?.map(t => t.toLowerCase()) || [];
    const cat = p.category?.toLowerCase() || '';
    
    if (activeFilter === 'Full Stack' && cat === 'fullstack') return true;
    if (activeFilter === 'Frontend' && cat === 'web') return true;
    if (activeFilter === 'Backend' && stack.includes('node.js')) return true;
    if (activeFilter === 'React' && stack.includes('react')) return true;
    if (activeFilter === 'Node.js' && stack.includes('node.js')) return true;
    
    return false;
  });

  const displayed = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section id="projects" className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-blue-500 top-20 right-0 opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            03 / Projects
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Featured <span className="gradient-text">work</span>
            </h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => { setActiveFilter(f); setShowAll(false); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${activeFilter === f ? 'bg-blue-500 text-white' : 'bg-navy-800 text-slate-400 hover:bg-navy-700 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-base h-96 animate-pulse">
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

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-navy-800/50 rounded-2xl border border-navy-700">
            <p className="text-lg mb-2">No projects found for "{activeFilter}"</p>
            <button onClick={() => setActiveFilter('All')} className="text-blue-400 hover:underline">
              View all projects
            </button>
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
            {filteredProjects.length > 6 && (
              <div className="text-center mt-12">
                <button onClick={() => setShowAll((v) => !v)} className="btn-ghost px-8 py-3 rounded-full text-sm font-medium border border-navy-700 hover:border-blue-500/50 transition-colors">
                  {showAll ? 'Show Less' : `Show All (${filteredProjects.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
