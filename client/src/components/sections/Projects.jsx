import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useData';
import { trackVisitorEvent } from '../../utils/visitorTracking';
import { fallbackProjects } from '../../data/fallbackPortfolioData';

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
    problem: "Required a responsive, high-performance web interface to solve domain-specific challenges.",
    solution: "Developed a full-stack application focusing on core usability, clean code, and API integration.",
    impact: "Delivered a scalable, production-ready product meeting all technical requirements."
  };
}

function ProjectCard({ project, isOverlayOpen, onToggleOverlay }) {
  const { title, description, techStack, imageUrl, liveUrl, githubUrl, category } = project;
  
  const dbCaseStudy = project.caseStudy;
  const hasDbCaseStudy = dbCaseStudy?.problem || dbCaseStudy?.solution || dbCaseStudy?.impact;
  const caseStudy = hasDbCaseStudy ? dbCaseStudy : getCaseStudy(title);

  const CATEGORY_COLOR = {
    web: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    fullstack: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    ml: 'text-purple-400 bg-purple-500/10 border-purple-400/20',
    other: 'text-slate-400 bg-slate-500/10 border-slate-400/20',
  };

  const [imgError, setImgError] = useState(false);

  const galleryImages = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery.filter(Boolean)
    : [imageUrl].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1 || isOverlayOpen) return;

    const timer = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % galleryImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [galleryImages.length, isOverlayOpen]);

  return (
    <div className="card-base h-full group flex flex-col overflow-hidden transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-navy-950 shrink-0">
        {galleryImages.length > 0 && !imgError ? (
          <>
            {galleryImages.map((img, idx) => (
              <img
                key={`${img}-${idx}`}
                src={img}
                alt={`${title || 'Project'} preview ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`project-image-fade absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                  idx === activeImageIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-[1.02]'
                } group-hover:scale-[1.04]`}
                onError={() => {
                  if (import.meta.env.DEV) console.warn('Project image failed:', img);
                  setImgError(true);
                }}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent pointer-events-none z-10" />

            {galleryImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {galleryImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex
                        ? 'w-5 bg-blue-400'
                        : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-800 z-10">
            <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-navy-700 flex items-center justify-center mb-3">
              <span className="font-display font-bold text-2xl text-blue-400/40">{title[0]}</span>
            </div>
            <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">Project Preview</span>
          </div>
        )}

        {/* Premium Case Study Overlay */}
        <div 
          className={`absolute inset-0 z-30 bg-navy-900/95 backdrop-blur-md border border-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOverlayOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <div className="flex justify-between items-center p-4 border-b border-navy-700/50 shrink-0">
            <h4 className="font-display font-bold text-white text-sm">Case Study</h4>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleOverlay(); }}
              aria-label="Close case study"
              className="text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="p-4 overflow-y-auto flex-1 space-y-4 text-sm text-slate-300"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
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
        </div>
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 z-20 text-xs font-mono px-2 py-1 rounded-md border ${CATEGORY_COLOR[category] || CATEGORY_COLOR.other}`}
        >
          {category}
        </span>
        {project.featured && (
          <span className="absolute top-3 right-3 z-20 text-[10px] font-bold uppercase px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
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

        {/* Status labels from database */}
        {Array.isArray(project.statusLabels) && project.statusLabels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.statusLabels.map((label) => (
              <span
                key={label}
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Case Study Toggle */}
        <div className="mt-auto pt-4 border-t border-navy-700/50">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (!isOverlayOpen) {
                trackVisitorEvent('case_study_open', { title, slug: project.slug });
              }
              onToggleOverlay();
            }}
            className="text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            {isOverlayOpen ? '- Hide Case Study' : '+ View Case Study'}
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
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
              onClick={() => trackVisitorEvent('github_click', { title, slug: project.slug })}
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
  const [isGridView, setIsGridView] = useState(false);
  const { projects: rawProjects, loading, error } = useProjects(false);

  const baseProjects = rawProjects?.length ? rawProjects : (!loading ? fallbackProjects : []);

  // Client-side priority sort (ResumeIQ/HYRR > Techartistry > Trendora > AI > Others)
  const projects = [...baseProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    const getPriority = (title) => {
      const t = (title || '').toLowerCase();
      if (t.includes('hyrr') || t.includes('resumeiq')) return 1;
      if (t.includes('techartistry') || t.includes('portfolio')) return 2;
      if (t.includes('trendora')) return 3;
      if (t.includes('pothole')) return 4;
      if (t.includes('thinkfast')) return 5;
      if (t.includes('mood')) return 6;
      return 10;
    };
    return getPriority(a.title) - getPriority(b.title);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openCaseStudyId, setOpenCaseStudyId] = useState(null);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['All', ...new Set(projects.map((p) => p.category || 'Other'))];

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

  const maxIndex = Math.max(0, filteredProjects.length - itemsPerView);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
      setOpenCaseStudyId(null);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setOpenCaseStudyId(null);
    }
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(c => c + 1);
      setOpenCaseStudyId(null);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setOpenCaseStudyId(null);
    }
  };

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setCurrentIndex(0);
    setOpenCaseStudyId(null);
  };

  return (
    <section id="projects" className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-blue-500 top-20 right-0 opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            05 / Projects
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
                Featured <span className="gradient-text">work</span>
              </h2>
              {!isGridView && (
                <p className="text-slate-400 text-sm font-medium">
                  Swipe or use arrows to explore selected projects.
                </p>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-col lg:items-end gap-4 mt-4 lg:mt-0">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => handleFilterChange(f)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        activeFilter === f 
                          ? 'bg-cyan-400/10 border border-cyan-300/40 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                          : 'bg-navy-800 border border-transparent text-slate-400 hover:bg-navy-700 hover:border-cyan-500/30 hover:text-cyan-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 ml-auto lg:ml-0">
                  <div>
                    <button 
                      onClick={() => { setIsGridView((v) => !v); setOpenCaseStudyId(null); }} 
                      aria-pressed={isGridView}
                      className="btn-ghost px-5 py-2 rounded-full text-xs font-medium border border-navy-700 hover:border-blue-500/50 transition-colors flex items-center gap-2"
                    >
                      {isGridView ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l-5-5 5-5m10 10l5-5-5-5" />
                          </svg>
                          View as Carousel
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          View All Projects ({filteredProjects.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {error && projects.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p>Could not load projects. Check that the API server is running.</p>
            <p className="text-xs font-mono mt-2 text-red-400/60">{error}</p>
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="text-center py-20 text-slate-500 bg-navy-800/50 rounded-2xl border border-navy-700">
            <p className="text-lg mb-2">No projects found for "{activeFilter}"</p>
            <button onClick={() => setActiveFilter('All')} className="text-blue-400 hover:underline">
              View all projects
            </button>
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <>
            {isGridView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {filteredProjects.map((p) => (
                  <ProjectCard 
                    key={p._id} 
                    project={p} 
                    isOverlayOpen={openCaseStudyId === p._id}
                    onToggleOverlay={() => setOpenCaseStudyId(openCaseStudyId === p._id ? null : p._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="relative group">
                <div 
                  className="overflow-hidden mx-auto"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-out items-stretch"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                  >
                    {filteredProjects.map((p) => (
                      <div 
                        key={p._id} 
                        className="flex-shrink-0 px-3"
                        style={{ width: `${100 / itemsPerView}%` }}
                      >
                        <ProjectCard 
                          project={p} 
                          isOverlayOpen={openCaseStudyId === p._id}
                          onToggleOverlay={() => setOpenCaseStudyId(openCaseStudyId === p._id ? null : p._id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {filteredProjects.length > itemsPerView && (
                  <>
                    <button 
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      aria-label="Previous projects"
                      className={`hidden md:flex absolute left-2 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 items-center justify-center rounded-full bg-navy-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300 z-30 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:bg-navy-900 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-400'}`}
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextSlide}
                      disabled={currentIndex === maxIndex}
                      aria-label="Next projects"
                      className={`hidden md:flex absolute right-2 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 items-center justify-center rounded-full bg-navy-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300 z-30 ${currentIndex === maxIndex ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:bg-navy-900 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-400'}`}
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )}

            {!isGridView && filteredProjects.length > itemsPerView && (
              <div className="flex justify-center items-center gap-2.5 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentIndex(idx); setOpenCaseStudyId(null); }}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={currentIndex === idx ? "true" : "false"}
                    className={`relative h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-4 focus:ring-offset-navy-900 after:absolute after:-inset-5 after:content-[''] ${
                      currentIndex === idx ? 'w-8 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'w-2 bg-slate-600/50 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
