import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import { trackVisitorEvent } from '../utils/visitorTracking';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const { data } = await api.get(`/projects/slug/${slug}`);
        setProject(data);
        setError(false);
        trackVisitorEvent('project_view', { slug, title: data.title });
      } catch (err) {
        console.error('Failed to load project:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project) return;

    const images = Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery.filter(Boolean)
      : [project.imageUrl].filter(Boolean);

    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [project]);

  if (loading) {
    return (
      <div className="section-padding bg-navy-900 min-h-screen pt-32">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-6 w-32 bg-navy-800 rounded mb-8" />
          <div className="h-64 md:h-96 bg-navy-800 rounded-2xl w-full" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-navy-800 rounded" />
            <div className="h-6 w-full bg-navy-800 rounded" />
            <div className="h-6 w-5/6 bg-navy-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="section-padding bg-navy-900 min-h-screen pt-32 text-center">
        <Helmet>
          <title>Project Not Found | Techartistry</title>
        </Helmet>
        <div className="max-w-md mx-auto py-20">
          <h1 className="font-display font-bold text-4xl text-white mb-4">404</h1>
          <p className="text-slate-400 mb-8">The project you are looking for does not exist or has been archived.</p>
          <Link
            to="/#projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, longDescription, techStack, imageUrl, liveUrl, githubUrl, caseStudy, category, featured } = project;

  const CATEGORY_COLOR = {
    web: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    fullstack: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    ml: 'text-purple-400 bg-purple-500/10 border-purple-400/20',
    other: 'text-slate-400 bg-slate-500/10 border-slate-400/20',
  };

  const hasCaseStudy = caseStudy?.problem || caseStudy?.solution || caseStudy?.impact;
  const canonicalUrl = `https://www.techartistry.in/projects/${slug}`;

  // Fallbacks if case study is completely empty
  const fallbackProblem = `Needed to build a robust, scalable ${category || 'software'} solution addressing core user requirements.`;
  const fallbackSolution = `Developed a comprehensive application utilizing ${techStack?.join(', ') || 'modern web technologies'} to ensure high performance.`;
  const fallbackImpact = `Successfully delivered a functional product meeting all technical and design specifications.`;

  // Generic fallback if features are empty
  const featuresList = (project.features && project.features.length > 0) ? project.features : [
    { title: "Focused Project Architecture", description: "Built with a clear structure, reusable components, and practical implementation details." },
    { title: "Responsive User Experience", description: "Designed to work cleanly across desktop and mobile screens." },
    { title: "Maintainable Implementation", description: "Organized with readable code, reusable patterns, and deployment-ready structure." }
  ];

  // Generic fallback if installation steps are empty
  const installationStepsList = (project.installationSteps && project.installationSteps.length > 0) ? project.installationSteps : [
    { label: "Clone the Repository", command: `git clone ${githubUrl || 'https://github.com/username/project.git'}` },
    { label: "Install Dependencies", command: "npm install" },
    { label: "Run Development Server", command: "npm run dev" }
  ];

  const highlightsList = project.highlights || ["Responsive UI", "REST API", "Optimized DB"];
  
  const challengesList = project.challenges || [
    { challenge: "Handling complex state management and reducing re-renders.", solution: "Implemented context providers and optimized component lifecycle hooks." },
    { challenge: "Ensuring secure authentication and data protection.", solution: "Integrated JWT tokens with strict route guarding and validation." }
  ];

  const galleryImages = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery.filter(Boolean)
    : [imageUrl].filter(Boolean);

  return (
    <article className="bg-navy-900 min-h-screen pt-24 pb-20 relative overflow-hidden">
      <Helmet>
        <title>{title} | Techartistry</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${title} | Techartistry`} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": title,
            "description": description,
            "applicationCategory": category === 'ml' ? 'UtilityApplication' : 'WebApplication',
            "url": canonicalUrl,
            "image": imageUrl
          })}
        </script>
      </Helmet>

      <div className="orb w-96 h-96 bg-blue-500 top-0 right-0 opacity-[0.03]" />
      <div className="orb w-64 h-64 bg-emerald-500 bottom-0 left-0 opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/#projects" 
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-blue-400 transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        {/* Hero Section */}
        <header className="mb-12 overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`text-xs font-mono px-3 py-1 rounded-md border ${CATEGORY_COLOR[category] || CATEGORY_COLOR.other}`}>
              {category}
            </span>
            {featured && (
              <span className="text-xs font-bold uppercase px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight break-words">
            {title}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            {description}
          </p>
        </header>

        {/* Image */}
        {galleryImages.length > 0 && !imgError ? (
          <div className="relative group w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-navy-950 shadow-2xl shadow-blue-900/10 mb-16 border border-navy-700">
            {galleryImages.map((img, idx) => (
              <img
                key={`${img}-${idx}`}
                src={img}
                alt={`${title || 'Project'} preview ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`project-image-fade absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
                  idx === activeImageIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-[1.01]'
                } group-hover:scale-[1.025]`}
                onError={() => {
                  if (import.meta.env.DEV) console.warn('Project detail image failed:', img);
                  setImgError(true);
                }}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent pointer-events-none" />

            {galleryImages.length > 1 && (
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex
                        ? 'w-8 bg-blue-400'
                        : 'w-2 bg-white/35 hover:bg-white/60'
                    }`}
                    aria-label={`Show screenshot ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-navy-800 shadow-2xl shadow-blue-900/10 mb-16 border border-navy-700 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-navy-900 border border-navy-700 flex items-center justify-center mb-4">
              <span className="font-display font-bold text-4xl text-blue-400/40">{title[0]}</span>
            </div>
            <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Project Preview</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            
            {/* About / Overview */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">About this Project</h2>
              <div className="prose prose-invert prose-blue max-w-none text-slate-300 leading-relaxed">
                {longDescription ? longDescription.split('\n').map((para, i) => (
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                )) : <p>{description}</p>}
              </div>
            </section>

            {/* Case Study */}
            <section className="bg-navy-800/50 rounded-2xl border border-navy-700 p-8 space-y-8">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Case Study
              </h2>
              
              <div>
                <h3 className="text-sm font-mono tracking-widest text-slate-400 uppercase mb-3">The Problem</h3>
                <p className="text-slate-300 leading-relaxed">
                  {hasCaseStudy ? caseStudy.problem : fallbackProblem}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-mono tracking-widest text-slate-400 uppercase mb-3">The Solution</h3>
                <p className="text-slate-300 leading-relaxed">
                  {hasCaseStudy ? caseStudy.solution : fallbackSolution}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-mono tracking-widest text-emerald-400 uppercase mb-3">The Impact</h3>
                <p className="text-emerald-400/90 leading-relaxed font-medium">
                  {hasCaseStudy ? caseStudy.impact : fallbackImpact}
                </p>
              </div>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Key Features</h2>
              <div className="space-y-4">
                {featuresList.map((feat, idx) => (
                  <div key={idx} className="bg-navy-800/40 border border-navy-700 rounded-xl p-5 hover:border-navy-600 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">{feat.title}</h4>
                        <p className="text-sm text-slate-400">{feat.description || feat.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights Badges */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Highlights</h2>
              <div className="flex flex-wrap gap-3">
                {highlightsList.map((highlight, idx) => (
                  <span key={idx} className="px-4 py-2 bg-navy-800 border border-navy-700 rounded-full text-sm font-medium text-slate-300">
                    {highlight}
                  </span>
                ))}
              </div>
            </section>

            {/* Challenges & Solutions */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Challenges & Solutions</h2>
              <div className="space-y-6">
                {challengesList.map((item, idx) => (
                  <div key={idx} className="bg-navy-800/30 border border-navy-700/50 rounded-xl p-6">
                    <div className="mb-5">
                      <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-red-400 mb-2">Challenge</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.challenge}</p>
                    </div>
                    <div className="pt-5 border-t border-navy-700/50">
                      <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-emerald-400 mb-2">Solution</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-navy-800/50 rounded-2xl border border-navy-700 p-6">
              <h3 className="text-sm font-mono tracking-widest text-white uppercase mb-4">Technologies</h3>
              {techStack?.length > 0 ? (
                <div className="flex flex-wrap gap-2 break-words">
                  {techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-navy-900 border border-navy-700 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 text-sm">Not specified</span>
              )}
            </div>

            <div className="space-y-3">
              {liveUrl && (
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Live Demo
                </a>
              )}
              
              {githubUrl && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackVisitorEvent('github_click', { slug, title })}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white font-medium rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.8 1.3 3.48.98.1-.76.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.22-3.22-.12-.3-.52-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 016 0c2.28-1.54 3.28-1.22 3.28-1.22.64 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.22 0 4.6-2.8 5.62-5.48 5.92.44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View Source Code
                </a>
              )}
            </div>

            {/* Installation - Collapsible */}
            <details className="bg-navy-800/50 rounded-2xl border border-navy-700 group overflow-hidden">
              <summary className="p-5 cursor-pointer flex items-center justify-between text-sm font-mono tracking-widest text-slate-300 uppercase select-none hover:text-white transition-colors">
                Installation Guide
                <svg className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-5 pt-0 space-y-4 border-t border-navy-700/50 mt-1 bg-navy-900/20">
                {installationStepsList.map((step, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-slate-400 mb-2">{step.label}</p>
                    <div className="bg-[#0d1117] border border-navy-700/50 rounded-lg p-3 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                      <span className="overflow-x-auto whitespace-nowrap scrollbar-hide">{step.command}</span>
                      <button
                        onClick={() => handleCopy(step.command, idx)}
                        className="shrink-0 flex items-center gap-1 px-2 py-1 bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white rounded border border-navy-700 transition-colors"
                        aria-label={`Copy ${step.label} command`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-wider text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-wider">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  );
}
