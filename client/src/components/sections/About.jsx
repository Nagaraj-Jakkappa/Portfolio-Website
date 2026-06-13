import React, { useState } from 'react';
import { trackVisitorEvent } from '../../utils/visitorTracking';

const getWhatsAppHref = (value) => {
  if (!value) return 'https://wa.me/916362835904';
  if (value.startsWith('http')) return value;
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('91') ? digits : `91${digits}`;
  return `https://wa.me/${normalized}`;
};const DEFAULT_TIMELINE = [
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

const DEFAULT_BIO = [
  <>
    Hey! I'm a passionate frontend developer from{' '}
    <span className="text-slate-200 font-medium">Yadgir, Karnataka</span>, currently
    hunting for my first full-time role after completing a BCA with a{' '}
    <span className="text-blue-400 font-bold tracking-tight">CGPA of 8.26</span>.
  </>,
  <>
    I love building things that live on the internet — clean, fast, and accessible
    interfaces powered by React. I've also dipped my hands into machine learning,
    building a real{' '}
    <span className="text-slate-200 font-medium underline decoration-blue-500/30 underline-offset-4">
      Pothole Detection
    </span>{' '}
    system using YOLOv8.
  </>,
  <>
    When I'm not coding, I'm usually exploring new tech, reading about AI/ML research,
    or working on side projects that solve real problems.
  </>,
];

export default function About({ content }) {
  const [imgError, setImgError] = useState(false);
  const about = content?.about || {};
  const social = content?.socialLinks || {};

  const profileImage = about.imageUrl || '/profile.jpg';
  const location = about.location || 'Yadgir, Karnataka';
  const whatsappUrl = getWhatsAppHref(social.whatsapp);
  const emailHref = social.email && !social.email.startsWith('mailto:') ? `mailto:${social.email}` : social.email || 'mailto:nagupoojary33@gmail.com';
  const githubUrl = social.github || 'https://github.com/Nagaraj-Jakkappa';
  const linkedinUrl = social.linkedin || 'https://www.linkedin.com/in/nagaraj-jakkappa/';

  // Use admin intro if provided, otherwise use hardcoded bio
  const hasAdminIntro = about.intro && about.intro.trim().length > 0;

  // Use admin highlights as timeline if provided
  const hasAdminHighlights = Array.isArray(about.highlights) && about.highlights.length > 0;
  const timeline = hasAdminHighlights
    ? about.highlights.map((h) => ({
        year: '',
        title: h.title || '',
        org: '',
        desc: h.description || '',
      }))
    : DEFAULT_TIMELINE;

  return (
    <section id="about" className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="orb w-64 h-64 bg-blue-500 top-0 right-20 opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            01 / About
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white text-center md:text-left">
            {about.title || (
              <>
                The person behind <span className="gradient-text">the code</span>
              </>
            )}
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
                {profileImage && !imgError ? (
                  <img
                    src={profileImage}
                    alt={about.title || "Nagaraj Jakkappa - Profile"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                    onError={(e) => {
                      if (import.meta.env.DEV) console.warn('Profile image failed:', profileImage);
                      setImgError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-900">
                    <span className="font-display font-bold text-6xl text-blue-400/30">NJ</span>
                  </div>
                )}
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
              {hasAdminIntro ? (
                about.intro.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
              ) : (
                DEFAULT_BIO.map((node, i) => <p key={i}>{node}</p>)
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-3 sm:gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackVisitorEvent('whatsapp_click')}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-navy-800/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={emailHref}
                onClick={() => trackVisitorEvent('email_click')}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-navy-800/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackVisitorEvent('github_click')}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-navy-800/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackVisitorEvent('linkedin_click')}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-navy-800/50 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 text-slate-300 transition-all duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pt-4">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-navy-700" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-10">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-navy-800 border-2 border-blue-400/50 flex items-center justify-center z-10 shadow-lg shadow-blue-500/10">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>

                  <div className="card-base p-5 group hover:translate-x-1 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      {item.year && (
                        <span className="tag text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.year}
                        </span>
                      )}
                      <span className="font-display font-semibold text-white text-[0.95rem]">
                        {item.title}
                      </span>
                    </div>
                    {item.org && (
                      <p className="text-blue-400 text-xs mb-2 font-mono italic opacity-80">
                        {item.org}
                      </p>
                    )}
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
