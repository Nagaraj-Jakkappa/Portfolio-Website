import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get('/certificates');
        // Support both plain array and { data: [] } envelope
        const data = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
        setCerts(data);
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setCerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading) {
    return (
      <section id="certifications" className="section-padding bg-navy-950">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">02 / Recognition</p>
            <h2 className="font-display font-bold text-4xl text-white">Certifications & Education</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-base p-6 border-l-4 border-navy-700 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-navy-800 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-navy-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-navy-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-navy-800 rounded w-full" />
                  <div className="h-3 bg-navy-800 rounded w-5/6" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between">
                  <div className="h-3 bg-navy-800 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="section-padding bg-navy-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
              02 / Recognition
            </p>
            <h2 className="font-display font-bold text-4xl text-white">Certifications & Education</h2>
          </div>
          
          <a
            href="/Nagaraj_Jakkappa_Resume_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20 w-fit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Resume
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certs.length > 0 ? (
            certs.map((cert) => (
              <div
                key={cert._id}
                className="card-base relative p-6 border-l-4 border-blue-500/30 hover:border-blue-500 transition-all duration-300 group overflow-hidden"
              >
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>

                <div className="flex items-center gap-4 mb-4 mt-2">
                  {/* LOGO CONTAINER */}
                  <div className="w-14 h-14 shrink-0 bg-navy-900 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] group-hover:border-blue-500/30 transition-all duration-300">
                    {cert.organizationLogo ? (
                      <img
                        src={cert.organizationLogo}
                        alt={`${cert.organization || 'Organization'} logo`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = '<span class="text-2xl">📜</span>';
                        }}
                      />
                    ) : (
                      <span className="text-2xl">
                        {(cert.title || '').toLowerCase().includes('bachelor') ||
                        (cert.title || '').toLowerCase().includes('degree')
                          ? '🎓'
                          : '📜'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{cert.title}</h3>
                    <p className="text-blue-400 text-sm font-mono mt-1">{cert.organization}</p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {cert.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-slate-500 text-xs font-mono">
                    {cert.date
                      ? new Date(cert.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Ongoing'}
                  </span>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all duration-300 text-[11px] font-medium tracking-wide flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Credential
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 border border-dashed border-navy-700 rounded-2xl">
              <p className="text-slate-500 font-mono text-sm">No records found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
