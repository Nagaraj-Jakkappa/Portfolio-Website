import React, { useEffect, useState } from 'react';
// Import your custom axios instance
import api from '../../api/axios';

export default function Certifications() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                // Use 'api' instance and the relative path '/certificates'
                const res = await api.get('/certificates');
                setCerts(res.data);
            } catch (err) {
                console.error("Error fetching certifications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    if (loading) return null;

    return (
        <section id="certifications" className="section-padding bg-navy-950">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">02 / Recognition</p>
                    <h2 className="font-display font-bold text-4xl text-white">Certifications & Education</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {certs.map((cert) => (
                        <div key={cert._id} className="card-base p-6 border-l-4 border-blue-500/30 hover:border-blue-500 transition-all duration-300 group">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl bg-navy-900 p-3 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                                    {cert.title.toLowerCase().includes('bachelor') || cert.title.toLowerCase().includes('degree') ? '🎓' : '🚀'}
                                </span>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{cert.title}</h3>
                                    <p className="text-blue-400 text-sm font-mono">{cert.organization}</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                {cert.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-mono">{cert.date}</span>
                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-xs hover:underline font-mono"
                                    >
                                        Verify →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {certs.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-navy-700 rounded-2xl">
                        <p className="text-slate-500 font-mono text-sm">No records found. Add them via the Admin Panel.</p>
                    </div>
                )}
            </div>
        </section>
    );
}