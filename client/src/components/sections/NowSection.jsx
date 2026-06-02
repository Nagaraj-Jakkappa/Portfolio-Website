import React from 'react';
import { motion } from 'framer-motion';

export default function NowSection() {
  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Header Area */}
          <div className="md:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                Live Status
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl text-white mb-6 italic">now</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This is a snapshot of my current professional focus and personal interests. Inspired
              by the "Now Page" movement.
            </p>
            <p className="text-xs font-mono text-slate-500 italic">Last updated: April 2026</p>
          </div>

          {/* Grid Area */}
          <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
            {/* Learning Item */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-base p-6 border-l-4 border-blue-500 bg-navy-900/50"
            >
              <div className="text-xl mb-4 text-blue-400">🚀 Learning</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Mastering{' '}
                <span className="text-white font-semibold">MongoDB Aggregation Pipelines</span> and
                deep-diving into <span className="text-white font-semibold">Redux Toolkit</span> for
                global state management.
              </p>
            </motion.div>

            {/* Building Item */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-base p-6 border-l-4 border-emerald-500 bg-navy-900/50"
            >
              <div className="text-xl mb-4 text-emerald-400">🛠️ Building</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Refining <span className="text-white font-semibold">TechArtistry.in</span> and
                adding interactive AI simulations to showcase Deep Learning concepts.
              </p>
            </motion.div>

            {/* Reading Item */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-base p-6 border-l-4 border-amber-500 bg-navy-900/50"
            >
              <div className="text-xl mb-4 text-amber-400">📖 Reading</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Currently reading <span className="text-white font-semibold">"Clean Code"</span> by
                Robert C. Martin to improve my architectural decision-making.
              </p>
            </motion.div>

            {/* Focus Item */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card-base p-6 border-l-4 border-purple-500 bg-navy-900/50"
            >
              <div className="text-xl mb-4 text-purple-400">🎯 Current Goal</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Securing a{' '}
                <span className="text-white font-semibold">Full-Stack Developer role</span> in
                Bengaluru to contribute to high-impact web products.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
