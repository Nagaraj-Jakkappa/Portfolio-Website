import React from 'react';

const TIMELINE = [
  {
    year: '2024',
    title: 'Frontend Internship',
    org: 'Saiket Systems',
    desc: 'Built responsive UI components and integrated REST APIs.',
  },
  {
    year: '2024',
    title: 'BCA Graduate',
    org: 'Yadgir, Karnataka',
    desc: 'Completed Bachelor of Computer Applications with CGPA 8.26.',
  },
  {
    year: '2023',
    title: 'Pothole Detection App',
    org: 'Deep Learning Project',
    desc: 'Built a YOLOv8-based road pothole detection system using Python & Flask.',
  },
  {
    year: '2023',
    title: 'Open Source',
    org: 'GitHub',
    desc: 'Started contributing projects — portfolio, weather app, quiz app.',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="orb w-64 h-64 bg-blue-500 top-0 right-20 opacity-5" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            01 / About
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            The person behind <span className="gradient-text">the code</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio & Profile Image */}
          <div className="space-y-10">
            {/* --- PROFILE IMAGE START --- */}
            <div className="relative w-44 h-44 md:w-56 md:h-56 group">
              {/* Outer Decorative Glow */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500" />

              {/* Animated Border Frame */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-transparent to-cyan-400 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500"
                style={{ padding: '2px' }}
              >
                <div className="bg-navy-900 rounded-2xl h-full w-full" />
              </div>

              {/* The Image Container */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-navy-800">
                <img
                  src="/profile.jpg"
                  alt="Nagaraj Jakkappa"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=NJ';
                  }}
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2 bg-navy-950 border border-blue-500/50 px-3 py-1 rounded-full flex items-center gap-2 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white tracking-wider uppercase">
                  Open to Work
                </span>
              </div>
            </div>
            {/* --- PROFILE IMAGE END --- */}

            <div className="space-y-5 text-slate-400 leading-relaxed text-[1.05rem]">
              <p>
                Hey! I'm a passionate frontend developer from{' '}
                <span className="text-slate-200 font-medium">Yadgir, Karnataka</span>, currently
                hunting for my first full-time role after completing a BCA with a{' '}
                <span className="text-blue-400 font-bold tracking-tight">CGPA of 8.26</span>.
              </p>
              <p>
                I love building things that live on the internet — clean, fast, and accessible
                interfaces powered by React. I've also dipped my hands into machine learning,
                building a real{' '}
                <span className="text-slate-200 font-medium underline decoration-blue-500/30 underline-offset-4">
                  Pothole Detection
                </span>{' '}
                system using YOLOv8.
              </p>
              <p>
                When I'm not coding, I'm usually exploring new tech, reading about AI/ML research,
                or working on side projects that solve real problems.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="mailto:nagupoojary33@gmail.com"
                className="btn-ghost text-sm py-2.5 px-6 rounded-lg border border-white/10 hover:border-blue-500 transition-all"
              >
                Email Me
              </a>
              <a
                href="https://linkedin.com/in/nagaraj-jakkappa"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm py-2.5 px-6 rounded-lg border border-white/10 hover:border-blue-500 transition-all"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pt-4">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-navy-700" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative pl-10">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-navy-800 border-2 border-blue-400/50 flex items-center justify-center z-10 shadow-lg shadow-blue-500/10">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>

                  <div className="card-base p-5 group hover:translate-x-1 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="tag text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.year}
                      </span>
                      <span className="font-display font-semibold text-white text-[0.95rem]">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-blue-400 text-xs mb-2 font-mono italic opacity-80">
                      {item.org}
                    </p>
                    <p className="text-slate-400 text-sm leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
