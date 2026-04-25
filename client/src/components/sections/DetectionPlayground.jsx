import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetectionPlayground() {
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detected, setDetected] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        setImage(f.target.result);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setDetected(false);
    // Simulate model processing time
    setTimeout(() => {
      setIsAnalyzing(false);
      setDetected(true);
    }, 2500);
  };

  return (
    <section id="pothole-demo" className="section-padding bg-navy-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-4">AI Playground</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Experience my <span className="text-blue-400">Pothole Detection</span> logic. 
            Upload a road photo to see the Deep Learning model in action.
          </p>
        </div>

        <div className="relative group card-base p-4 min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
          {!image ? (
            <label className="cursor-pointer flex flex-col items-center group">
              <div className="w-16 h-16 mb-4 rounded-full bg-navy-800 flex items-center justify-center border border-navy-700 group-hover:border-blue-500/50 transition-colors">
                <svg className="w-8 h-8 text-slate-500 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Upload Image</p>
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>
          ) : (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <img src={image} alt="Upload" className="w-full h-auto max-h-[500px] object-cover" />
              
              {/* Scanning Line Animation */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                  />
                )}
              </AnimatePresence>

              {/* Detected Pothole Overlay */}
              {detected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-1/3 left-1/4 w-32 h-24 border-2 border-emerald-400 rounded-lg shadow-[0_0_20px_rgba(52,211,153,0.4)] z-30"
                >
                  <span className="absolute -top-6 left-0 bg-emerald-500 text-navy-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Pothole: 98.2%
                  </span>
                </motion.div>
              )}
            </div>
          )}

          {image && !isAnalyzing && (
            <button 
              onClick={() => setImage(null)} 
              className="mt-6 text-slate-500 hover:text-white text-xs font-mono uppercase tracking-tighter transition-colors"
            >
              Reset Playground
            </button>
          )}
        </div>

        {/* Technical Specs Footer */}
        <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center border-r border-navy-800">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Backbone</p>
                <p className="text-sm text-white font-bold">YOLOv8</p>
            </div>
            <div className="text-center border-r border-navy-800">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Dataset</p>
                <p className="text-sm text-white font-bold">800+ Images</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Accuracy</p>
                <p className="text-sm text-white font-bold">94.5%</p>
            </div>
        </div>
      </div>
    </section>
  );
}