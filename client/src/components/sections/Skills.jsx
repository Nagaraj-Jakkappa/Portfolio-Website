import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const LEVEL_COLORS = {
  Frontend: 'text-blue-400 border-blue-400/20 bg-blue-500/10',
  Backend: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10',
  'ML / AI': 'text-purple-400 border-purple-400/20 bg-purple-500/10',
  Tools: 'text-amber-400 border-amber-400/20 bg-amber-500/10',
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        // SAFETY: Ensure res.data is actually an array before setting state
        setSkills(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading skills:", err);
        setSkills([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Use optional chaining and fallback to prevent .reduce crash
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'Other'; // Fallback if category is missing
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="text-blue-400 font-mono animate-pulse">Loading Stack...</div>
      </div>
    );
  }

  return (
    <section id="skills" className="section-padding bg-navy-950 relative overflow-hidden">
      <div className="orb w-72 h-72 bg-purple-500 bottom-0 left-10 opacity-5" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">02 / Skills</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            My <span className="gradient-text">tech stack</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="card-base card-hover p-6">
              <h3 className={`font-display font-semibold uppercase tracking-widest mb-5 px-2 py-1 rounded-md border w-fit text-xs ${LEVEL_COLORS[category] || 'text-slate-400 border-slate-400/20 bg-slate-500/10'}`}>
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

        {/* Improved empty state message */}
        {skills.length === 0 && (
          <div className="mt-20 text-center border border-dashed border-slate-800 p-10 rounded-xl">
            <p className="text-slate-500 font-mono text-sm">
              Database is currently empty. Add your skills in the admin dashboard!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}