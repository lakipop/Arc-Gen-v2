/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { InputArea } from './components/InputArea';
import { LivePreview } from './components/LivePreview';
import { CreationHistory, Creation } from './components/CreationHistory';
import { bringToLife } from './services/architecture-generator.core';
import { ArrowUpTrayIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [activeCreation, setActiveCreation] = useState<Creation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<Creation[]>([]);
  const [appTheme, setAppTheme] = useState<'dark' | 'light'>('dark');
  const importInputRef = useRef<HTMLInputElement>(null);

  // Theme Toggle Logic
  useEffect(() => {
    if (appTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [appTheme]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('gemini_app_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({...item, timestamp: new Date(item.timestamp)})));
      } catch (e) { console.error("Failed load history", e); }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) localStorage.setItem('gemini_app_history', JSON.stringify(history));
  }, [history]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleGenerate = async (promptText: string, styles: string[], theme: 'dark' | 'light', file?: File) => {
    setIsGenerating(true);
    setActiveCreation(null);
    try {
      let imageBase64, mimeType;
      if (file) {
        imageBase64 = await fileToBase64(file);
        mimeType = file.type.toLowerCase();
      }
      const html = await bringToLife(promptText, styles, theme, imageBase64, mimeType);
      if (html) {
        const newCreation: Creation = {
          id: crypto.randomUUID(),
          name: file ? file.name : 'New System',
          html: html,
          originalImage: imageBase64 && mimeType ? `data:${mimeType};base64,${imageBase64}` : undefined,
          timestamp: new Date(),
        };
        setActiveCreation(newCreation);
        setHistory(prev => [newCreation, ...prev]);
      }
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target?.result as string);
            if (parsed.html) {
                const imp = { ...parsed, timestamp: new Date(), id: crypto.randomUUID() };
                setHistory(prev => [imp, ...prev]);
                setActiveCreation(imp);
            }
        } catch (err) { alert("Invalid file."); }
    };
    reader.readAsText(file);
  };

  const isFocused = !!activeCreation || isGenerating;

  return (
    <div className="h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-cyan-500/30 overflow-y-auto overflow-x-hidden relative flex flex-col transition-colors duration-300">
      
      {/* Theme Toggle (Top Right) */}
      <button 
        onClick={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
      >
        {appTheme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-zinc-600" />}
      </button>

      <div 
        className={`
          min-h-full flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 
          transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
          ${isFocused ? 'opacity-0 scale-95 blur-sm pointer-events-none h-[100dvh] overflow-hidden' : 'opacity-100 scale-100 blur-0'}
        `}
      >
        <div className="flex-1 flex flex-col justify-center items-center w-full py-12 md:py-20">
          <div className="w-full mb-8 md:mb-16"><Hero /></div>
          <div className="w-full flex justify-center mb-8">
              <InputArea onGenerate={handleGenerate} isGenerating={isGenerating} disabled={isFocused} />
          </div>
        </div>
        
        <div className="flex-shrink-0 pb-6 w-full mt-auto flex flex-col items-center gap-6">
            <div className="w-full px-2 md:px-0"><CreationHistory history={history} onSelect={setActiveCreation} /></div>
            <span className="text-zinc-400 text-xs font-mono pb-2">Created by @ammaar</span>
        </div>
      </div>

      <LivePreview creation={activeCreation} isLoading={isGenerating} isFocused={isFocused} onReset={() => {setActiveCreation(null); setIsGenerating(false);}} />
      
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={() => importInputRef.current?.click()} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors opacity-60 hover:opacity-100">
            <ArrowUpTrayIcon className="w-5 h-5" />
        </button>
        <input type="file" ref={importInputRef} onChange={handleImportFile} accept=".json" className="hidden" />
      </div>
    </div>
  );
};

export default App;