
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-4 lg:pt-12">
      
      {/* Animated Background Globs (CSS Only) - Visible in Dark Mode */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:block hidden"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:block hidden"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:block hidden"></div>

      {/* Light Mode Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob dark:hidden block"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 dark:hidden block"></div>

      <div className="relative">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
             </span>
             <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-widest uppercase">V1.0 Generator Online</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
          Architect <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500">
             The Future
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light mb-10">
          Turn ideas into enterprise-grade architecture diagrams.
          <br className="hidden sm:block" />
          <span className="font-medium text-zinc-900 dark:text-zinc-200">Instant. Interactive. Professional.</span>
        </p>

        {/* Feature Grid - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
                { title: "Multi-Style Engine", desc: "Generate Cyberpunk, Blueprint, or Classic grids instantly." },
                { title: "Interactive Layers", desc: "Deep-dive flowcharts mixed with high-level diagrams." },
                { title: "Export Ready", desc: "Download as HTML5, PNG, or 60fps Animation." }
            ].map((feature, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-800/50 transition-colors">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">{feature.desc}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
