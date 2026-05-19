import React from 'react'

const highlights = [
  {
    title: 'AI Road Intelligence System',
    description:
      'Built an AI-powered pothole detection platform using YOLO and GPS mapping to improve road condition monitoring and real-time detection workflows.'
  },
  {
    title: 'Production Engineering Stack',
    description:
      'Experience building full-stack applications with React, Node.js, Express, MongoDB, JWT authentication, REST APIs, responsive UI systems, and deployment workflows.'
  },
  {
    title: 'System & Performance Thinking',
    description:
      'Focused on scalable architecture, reusable component systems, accessibility, optimized frontend performance, and maintainable engineering practices.'
  }
]

export default function RecruiterMode() {
  return (
    <section
      id="engineering-highlights"
      className="py-24 px-6 md:px-12 bg-[#08111f] border-y border-white/5"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs font-semibold mb-4">
              Engineering Highlights
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl">
              Building scalable AI-powered full-stack systems.
            </h2>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5 max-w-md">
            <p className="text-slate-300 text-sm leading-relaxed">
              Focused on real-world engineering, scalable product development,
              modern frontend architecture, and AI-integrated applications with
              production-oriented thinking.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05]"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6">
                <div className="w-3 h-3 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform duration-300" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                {item.title}
              </h3>

              <p className="text-slate-400 leading-relaxed text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}