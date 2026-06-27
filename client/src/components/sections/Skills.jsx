import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import techStackIllustration from '../../assets/illustrations/tech-stack-illustration.webp';

const LEVEL_COLORS = {
  Frontend: 'text-blue-400 border-blue-400/20 bg-blue-500/10',
  Backend: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10',
  'ML / AI': 'text-purple-400 border-purple-400/20 bg-purple-500/10',
  Tools: 'text-amber-400 border-amber-400/20 bg-amber-500/10',
};

export default function Skills({ content }) {
  const techMedia = content?.mediaAssets?.techStackIllustration || { isActive: true, url: '', alt: '' };
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('skills');
        setSkills(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error loading skills:', err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {});

  if (loading) {
    return (
      <section id="skills" className="section-padding bg-navy-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-3/5">
            <div className="mb-16">
              <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">03 / Skills</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
                My <span className="gradient-text">tech stack</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-base p-6 animate-pulse">
                <div className="h-6 w-24 bg-navy-700 rounded mb-5" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-navy-800 rounded w-full" />
                  ))}
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

  return (
    <section id="skills" className="section-padding bg-navy-950 relative overflow-hidden">
      <div className="orb w-72 h-72 bg-purple-500 bottom-0 left-10 opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:items-start xl:items-center">
          <div className="w-full lg:w-3/5">
            <div className="mb-16">
              <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
                03 / Skills
              </p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
                My <span className="gradient-text">tech stack</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="card-base card-hover p-6">
              <h3
                className={`font-display font-semibold uppercase tracking-widest mb-5 px-2 py-1 rounded-md border w-fit text-xs text-center md:text-left ${LEVEL_COLORS[category] || 'text-slate-400 border-slate-400/20 bg-slate-500/10'}`}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skillName, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0" />
                    {skillName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

            {skills.length === 0 && (
              <div className="mt-20 text-center border border-dashed border-slate-800 p-10 rounded-xl">
                <p className="text-slate-500 font-mono text-sm">No skills found. Add them via Admin.</p>
              </div>
            )}
          </div>

          {techMedia.isActive && (
            <div className="relative hidden lg:flex w-full lg:w-2/5 items-center justify-center lg:mt-10 xl:mt-0">
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl" />
              <img
                src={techMedia.url || techStackIllustration}
                alt={techMedia.alt || "Web development tech stack illustration"}
                className="relative z-10 w-full max-w-[420px] object-contain drop-shadow-2xl opacity-90"
                onError={(e) => { e.target.src = techStackIllustration; }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
