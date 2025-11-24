/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, PlayIcon, CpuChipIcon, MoonIcon, SunIcon, CheckCircleIcon, SparklesIcon, Square3Stack3DIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface InputAreaProps {
  onGenerate: (prompt: string, styles: string[], theme: 'dark' | 'light', file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CyclingText = () => {
    const words = [
        "Microservices for Netflix...",
        "E-Commerce Payment Gateway...",
        "Real-time Chat Architecture...",
        "Crypto Exchange Engine...",
        "IoT Data Pipeline..."
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true);
            }, 500);
        }, 3000); 
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} text-cyan-600 dark:text-cyan-400 font-medium`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [promptText, setPromptText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['neon']);
  const [diagramTheme, setDiagramTheme] = useState<'dark' | 'light'>('dark');

  const stylesList = [
    { 
        id: 'neon', 
        label: 'Neon Flow', 
        desc: 'Interactive, Glowing',
        // Active: Cyan/Blue theme
        activeClass: 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50' 
    },
    { 
        id: 'brainstorming', 
        label: 'Brainstorm', 
        desc: 'Strategic Analysis',
        // Active: Purple theme
        activeClass: 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50' 
    },
    { 
        id: 'component', 
        label: 'Bento Grid', 
        desc: 'Component System',
        // Active: Amber theme
        activeClass: 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50' 
    },
    { 
        id: 'modern', 
        label: 'Cyberpunk', 
        desc: 'Futuristic, Detailed',
        // Active: Pink theme
        activeClass: 'bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/50' 
    },
  ];

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => {
        if (prev.includes(id)) {
            if (prev.length === 1) return prev; // Keep at least one
            return prev.filter(s => s !== id);
        }
        return [...prev, id];
    });
  };

  const isAllSelected = selectedStyles.length === stylesList.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
        setSelectedStyles(['neon']); // Reset to default
    } else {
        setSelectedStyles(stylesList.map(s => s.id));
    }
  };

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        const styles = selectedStyles.length > 0 ? selectedStyles : ['neon'];
        if (!promptText.trim() && !selectedFile) {
            onGenerate("A modern cloud-native web application architecture with Load Balancer, API Gateway, Microservices, and Database Sharding.", styles, diagramTheme, undefined);
        } else {
            onGenerate(promptText, styles, diagramTheme, selectedFile || undefined);
        }
        setPromptText("");
        setSelectedFile(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div 
        className={`relative group bg-white/80 dark:bg-zinc-900/30 backdrop-blur-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${isDragging ? 'border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'hover:border-zinc-300 dark:hover:border-zinc-700'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-2xl overflow-hidden" 
             style={{backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Text Input Area */}
            <div className="flex-1 flex flex-col gap-3 z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 shrink-0">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-cyan-500" />
                        System Prompt
                    </label>
                    <div className="text-xs font-mono hidden sm:block"><CyclingText /></div>
                </div>
                <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder={selectedFile ? "Add any additional context or instructions about the image..." : "Describe the system you want to visualize... (e.g., 'Uber Backend Architecture')"}
                    className="w-full flex-1 min-h-[16rem] lg:min-h-0 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all resize-none font-sans text-sm font-light tracking-wide leading-relaxed shadow-inner"
                    disabled={isGenerating || disabled}
                />
            </div>

            {/* Right Column: Settings */}
            <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 z-10">
                 
                 {/* File Upload */}
                 <div className="flex-1">
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Reference</label>
                     <label 
                        className={`
                            flex flex-col items-center justify-center h-24
                            border border-dashed rounded-xl cursor-pointer
                            transition-all duration-200
                            ${isDragging ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/10' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
                            ${selectedFile ? 'border-solid border-cyan-600 bg-cyan-50 dark:bg-cyan-900/5' : ''}
                        `}
                     >
                        <div className="text-center p-2 w-full">
                            {selectedFile ? (
                                <div className="flex items-center justify-center gap-2">
                                    <ArrowUpTrayIcon className="w-4 h-4 text-cyan-600" />
                                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[120px]">{selectedFile.name}</span>
                                    <button onClick={(e) => { e.preventDefault(); setSelectedFile(null); }} className="text-xs text-red-500 hover:text-red-600 px-2">x</button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-zinc-500 font-medium">Upload Image / PDF</span>
                                </div>
                            )}
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" disabled={isGenerating || disabled} />
                     </label>
                 </div>

                 {/* Configuration Grid */}
                 <div className="grid grid-cols-1 gap-4">
                    {/* Style Selector */}
                     <div>
                        <div className="flex items-center justify-between mb-2">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Output Style</label>
                        </div>
                        
                        {/* Select All Button */}
                        <button 
                            onClick={handleSelectAll}
                            className={`
                                w-full mb-2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                                ${isAllSelected 
                                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm' 
                                    : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-700 border border-transparent dark:hover:bg-zinc-800'
                                }
                            `}
                        >
                            <Square3Stack3DIcon className="w-3 h-3" />
                            {isAllSelected ? 'Clear Selection' : 'Generate All Styles'}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            {stylesList.map((style) => {
                                const isActive = selectedStyles.includes(style.id);
                                return (
                                    <button
                                        key={style.id}
                                        onClick={() => toggleStyle(style.id)}
                                        disabled={isGenerating || disabled}
                                        className={`
                                            relative flex flex-col items-start justify-center p-2.5 rounded-xl border text-left transition-all duration-200 h-16
                                            ${isActive 
                                                ? style.activeClass
                                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between w-full mb-0.5">
                                            <span className={`text-xs font-bold ${isActive ? '' : 'text-zinc-600 dark:text-zinc-300'}`}>{style.label}</span>
                                            {isActive && <CheckCircleIcon className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-[9px] leading-tight ${isActive ? 'opacity-80' : 'text-zinc-400'}`}>{style.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                     </div>

                     {/* Diagram Theme Selector */}
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Diagram Theme</label>
                        <div className="bg-zinc-100 dark:bg-zinc-950/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-1">
                            <button
                                onClick={() => setDiagramTheme('dark')}
                                className={`
                                    flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all
                                    ${diagramTheme === 'dark' 
                                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700' 
                                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                                    }
                                `}
                            >
                                <MoonIcon className="w-3 h-3" /> Dark
                            </button>
                            <button
                                onClick={() => setDiagramTheme('light')}
                                className={`
                                    flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all
                                    ${diagramTheme === 'light' 
                                        ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' 
                                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                                    }
                                `}
                            >
                                <SunIcon className="w-3 h-3" /> Light
                            </button>
                        </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Generate Button */}
        <div className="px-4 pb-4 md:px-6 md:pb-6 z-10 relative">
            <button
                onClick={handleGenerateClick}
                disabled={isGenerating || disabled}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 opacity-100" />
                <div className="relative bg-white dark:bg-zinc-900 hover:bg-opacity-90 dark:hover:bg-opacity-90 rounded-xl py-4 transition-all duration-300 flex items-center justify-center space-x-3">
                    {isGenerating ? (
                        <>
                            <CpuChipIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                            <span className="font-bold text-sm text-cyan-700 dark:text-cyan-400 tracking-widest uppercase">Architecture Compiler Running...</span>
                        </>
                    ) : selectedFile ? (
                        <>
                            <MagnifyingGlassIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                            <span className="font-bold text-sm text-zinc-800 dark:text-white tracking-widest uppercase">Analyze & Generate</span>
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                            <span className="font-bold text-sm text-zinc-800 dark:text-white tracking-widest uppercase">Generate Architecture</span>
                        </>
                    )}
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};