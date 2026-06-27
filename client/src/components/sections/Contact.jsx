import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const DEFAULT_CONTACT = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    label: 'Email',
    value: 'nagupoojary33@gmail.com',
    href: 'mailto:nagupoojary33@gmail.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    label: 'Phone',
    value: '+91 6362835904',
    href: 'tel:+916362835904',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    label: 'Location',
    value: 'Yadgir, Karnataka, India',
    href: 'https://maps.google.com/?q=Yadgir,Karnataka',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.8 1.3 3.48.98.1-.76.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.22-3.22-.12-.3-.52-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 016 0c2.28-1.54 3.28-1.22 3.28-1.22.64 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.22 0 4.6-2.8 5.62-5.48 5.92.44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/Nagaraj-Jakkappa',
    href: 'https://github.com/Nagaraj-Jakkappa',
  },
];

function buildContactInfo(content) {
  const social = content?.socialLinks;
  if (!social) return DEFAULT_CONTACT;

  // Only override if admin has provided values
  const items = DEFAULT_CONTACT.map((item) => {
    if (item.label === 'Email' && social.email) {
      return { ...item, value: social.email, href: `mailto:${social.email}` };
    }
    if (item.label === 'Phone' && social.phone) {
      return { ...item, value: social.phone, href: `tel:${social.phone.replace(/\s/g, '')}` };
    }
    if (item.label === 'Location' && social.location) {
      return { ...item, value: social.location, href: `https://maps.google.com/?q=${encodeURIComponent(social.location)}` };
    }
    if (item.label === 'GitHub' && social.github) {
      const display = social.github.replace(/^https?:\/\//, '');
      return { ...item, value: display, href: social.github };
    }
    return item;
  });
  return items;
}

export default function Contact({ content }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/messages', form);
      toast.success("Message sent! I'll get back to you soon.");
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send. Try emailing directly.');
      setApiError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-navy-950 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-blue-600 top-10 left-10 opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="font-mono text-blue-400 text-sm tracking-widest uppercase mb-3">
            06 / Contact
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            Let's <span className="gradient-text">work together</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl">
            Actively looking for Frontend and MERN Stack roles. Have a project or role in mind? Drop me a message and I'll reply within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {buildContactInfo(content).map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-base card-hover p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5 font-mono uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-slate-300 text-sm">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Availability badge */}
            <div className="card-base p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-emerald-400 text-sm font-medium">Available for work</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Actively looking for junior frontend / full-stack roles and internships. Based in
                Karnataka, open to remote.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 card-base p-6 md:p-8">
            {apiError ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-white text-xl mb-2">
                  Service Unavailable
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                  Message service is temporarily unavailable. You can email me directly.
                </p>
                <a 
                  href="mailto:nagupoojary33@gmail.com" 
                  className="btn-primary py-2 px-6 rounded-lg text-sm"
                >
                  Email Me Directly
                </a>
                <button onClick={() => setApiError(false)} className="btn-ghost text-sm py-2 px-4 mt-4">
                  Try Again
                </button>
              </div>
            ) : sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-white text-xl mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button onClick={() => setSent(false)} className="btn-ghost text-sm py-2 px-4">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-mono uppercase tracking-wide mb-2">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-mono uppercase tracking-wide mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="hello@company.com"
                      className="input-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono uppercase tracking-wide mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Job Opportunity / Collaboration"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-mono uppercase tracking-wide mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about the role or project..."
                    className="input-base resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
