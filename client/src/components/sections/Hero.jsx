import React, { useState, useEffect } from 'react';
import { trackVisitorEvent } from '../../utils/visitorTracking';

export default function Hero({ content }) {
  const hero = content?.hero || {};
  const resume = content?.resume || {};

  const headline = hero.headline || "Crafting Digital\nArtistry Through Code";
  const role = hero.role || 'Nagaraj Jakkappa @ Techartistry.in';
  const subtitle =
    hero.subtitle ||
    'BCA Graduate & Full-Stack Developer specializing in the MERN stack. I transform complex logic into elegant, high-performance web experiences with a focus on deep learning integration and minimalist UI.';

  const primaryCtaText = hero.primaryCtaText || 'Explore Projects';
  const primaryCtaHref = hero.primaryCtaHref || '#projects';
  const secondaryCtaText = hero.secondaryCtaText || 'View Resume';
  const resumeUrl = resume.resumeUrl || '/Nagaraj_Jakkappa_Resume_2026.pdf';

  const handleScroll = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrimaryCta = () => {
    if (primaryCtaHref.startsWith('#')) {
      handleScroll(primaryCtaHref);
    } else {
      window.open(primaryCtaHref, '_blank', 'noopener,noreferrer');
    }
  };

  const viewResume = () => {
    trackVisitorEvent('resume_click');
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  // Parse headline for gradient styling
  const headlineParts = headline.split('\n');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-950">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* Gradient orbs */}
      <div className="orb w-96 h-96 bg-blue-600 top-20 -left-32 opacity-20" />
      <div className="orb w-80 h-80 bg-cyan-400 bottom-20 right-0 opacity-10" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-transparent to-navy-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-3xl stagger-children">
          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest font-mono mb-8 animate-fade-up"
            style={{ animationDelay: '0ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Open for Frontend & Fullstack Roles
          </div>

          {/* Heading */}
          <h1
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white mb-6 animate-fade-up"
            style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            {headlineParts.length > 1 ? (
              <>
                {headlineParts[0]}
                <br />
                <span className="gradient-text italic pr-2">{headlineParts[1].split(' ')[0]}</span>{' '}
                {headlineParts[1].split(' ').slice(1).join(' ')}
              </>
            ) : (
              headline
            )}
          </h1>

          {/* Role / Sub-brand */}
          <p
            className="font-display text-xl md:text-2xl text-slate-300 mb-4 animate-fade-up"
            style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            {role.includes('@') ? (
              <>
                {role.split('@')[0]}
                <span className="text-blue-500 font-bold">@ {role.split('@')[1]}</span>
              </>
            ) : (
              role
            )}
          </p>

          {/* Targeted Description */}
          <p
            className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-up font-light"
            style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-2 mt-6 animate-fade-up"
            style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            <button
              onClick={handlePrimaryCta}
              className="btn-primary rounded-full px-8 flex items-center gap-2"
            >
              {primaryCtaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <button
              onClick={viewResume}
              className="btn-ghost rounded-full px-8 flex items-center gap-2 border-blue-500/30 hover:border-blue-500/60"
            >
              {secondaryCtaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button
              onClick={() => handleScroll('#contact')}
              className="btn-ghost rounded-full px-8 flex items-center gap-2"
            >
              Contact Me
            </button>
          </div>

          {/* Social Proof Stats */}
          <div
            className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-navy-800 animate-fade-up"
            style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            {[
              { val: '8.26', label: 'BCA CGPA' },
              { val: 'MERN', label: 'Stack' },
              { val: '6+', label: 'Live Projects' },
              { val: '1', label: 'Internship' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="font-display font-bold text-2xl text-white">{val}</div>
                <div className="text-[10px] text-blue-400/60 mt-0.5 tracking-widest uppercase font-mono">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex justify-center z-20">
        <button
          onClick={() => handleScroll('#currently-building')}
          className="group flex flex-col items-center gap-3 p-2 focus:outline-none"
          aria-label="Scroll down to discover more"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 group-hover:text-blue-400 transition-colors">
            Discover
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-700 flex justify-center p-1 group-hover:border-blue-500/50 transition-colors">
            <div className="w-1 h-1.5 bg-slate-500 rounded-full animate-bounce group-hover:bg-blue-400 transition-colors" />
          </div>
        </button>
      </div>
    </section>
  );
}
