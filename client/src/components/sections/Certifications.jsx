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

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-navy-950">
        <div className="text-blue-400 font-mono animate-pulse">Loading Records...</div>
      </div>
    );

  return (
    <section id="certifications" className="section-padding bg-navy-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            02 / Recognition
          </p>
          <h2 className="font-display font-bold text-4xl text-white">Certifications & Education</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certs.length > 0 ? (
            certs.map((cert) => (
              <div
                key={cert._id}
                className="card-base p-6 border-l-4 border-blue-500/30 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* LOGO CONTAINER */}
                  <div className="w-14 h-14 shrink-0 bg-navy-900 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
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
                      className="text-blue-400 text-xs hover:text-white transition-colors font-mono flex items-center gap-1"
                    >
                      Verify Credentials <span>→</span>
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
