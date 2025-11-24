
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, CodeBracketIcon, XMarkIcon, CameraIcon, VideoCameraIcon, StopIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

declare global {
  interface Window {
    pdfjsLib: any;
    html2canvas: any;
  }
}

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState(0);
    const [showSplitView, setShowSplitView] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stages = [
        { text: "Initializing compiler...", detail: "Setting up environment" },
        { text: "Analyzing requirements...", detail: "Parsing structural nodes" },
        { text: "Drafting architecture...", detail: "Calculating flow paths" },
        { text: "Optimizing data flow...", detail: "Applying latency constraints" },
        { text: "Applying visual themes...", detail: "Rendering neon effects" },
        { text: "Finalizing output...", detail: "Preparing interactive elements" }
    ];

    useEffect(() => {
        if (isLoading) {
            setProgress(0);
            setLoadingStage(0);
            
            const totalDuration = 15000; // Approx 15 sec total
            const intervalTime = 100;
            const steps = totalDuration / intervalTime;
            let currentStep = 0;
            
            const timer = setInterval(() => {
                currentStep++;
                const newProgress = Math.min((currentStep / steps) * 100, 99);
                setProgress(newProgress);
                
                // Update stage based on progress
                const stageIndex = Math.floor((newProgress / 100) * stages.length);
                setLoadingStage(Math.min(stageIndex, stages.length - 1));

            }, intervalTime);

            return () => {
                clearInterval(timer);
            };
        } else {
            setProgress(100);
        }
    }, [isLoading]);

    useEffect(() => {
        if (creation?.originalImage) setShowSplitView(true);
    }, [creation]);

    const handleDownloadHtml = () => {
        if (!creation || !creation.html) return;
        const blob = new Blob([creation.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name}_diagram.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDownloadPng = async () => {
        if (!iframeRef.current || !window.html2canvas) return;
        try {
            const body = iframeRef.current.contentDocument?.body;
            if (!body) return;

            // STRICT Background Detection Logic
            let bgColor = '#09090b'; // Default Dark
            
            if (iframeRef.current.contentWindow) {
                const style = iframeRef.current.contentWindow.getComputedStyle(body);
                const bgVar = style.getPropertyValue('--bg-main').trim();
                
                if (bgVar === '#ffffff' || bgVar.toLowerCase() === '#fff') {
                    bgColor = '#ffffff';
                } else {
                    bgColor = '#09090b'; 
                }
            }

            const canvas = await window.html2canvas(body, { 
                backgroundColor: bgColor, 
                scale: 2, 
                useCORS: true,
                logging: false,
                allowTaint: true
            });
            const a = document.createElement('a');
            a.href = canvas.toDataURL("image/png");
            a.download = `${creation?.name}_snapshot.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) { 
            console.error(e);
            alert("Snapshot failed. Try downloading HTML."); 
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: false });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
            mediaRecorderRef.current = recorder;
            
            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${creation?.name}_animation.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);
        } catch (err: any) {
            console.error("Recording failed", err);
            if (err.name === 'NotAllowedError') {
                alert("Sandbox Restriction: Screen recording is blocked in this preview. Please download the HTML file to use the Record feature.");
            }
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

  return (
    <div className={`fixed z-40 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#0E0E10] shadow-2xl transition-all duration-700 ${isFocused ? 'inset-0 md:inset-4 opacity-100 scale-100' : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'}`}>
      <div className="bg-[#121214] px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
        <div className="flex space-x-2">
            <button onClick={onReset} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 shadow-sm"></button>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
        </div>
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">{creation ? creation.name : 'System Status: Active'}</span>
        <div className="flex items-center space-x-2">
            {creation && (
                <>
                    <button onClick={handleDownloadPng} title="Snapshot" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"><CameraIcon className="w-4 h-4"/></button>
                    
                    {!isRecording ? (
                        <button onClick={handleStartRecording} title="Record Video" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors flex items-center gap-1">
                            <VideoCameraIcon className="w-4 h-4"/>
                        </button>
                    ) : (
                        <button onClick={handleStopRecording} title="Stop Recording" className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded flex items-center gap-1 animate-pulse">
                            <StopIcon className="w-4 h-4"/>
                        </button>
                    )}

                    <button onClick={handleDownloadHtml} title="Download HTML" className="p-1.5 text-cyan-400 hover:text-cyan-300 bg-cyan-950 border border-cyan-900 rounded hover:bg-cyan-900 transition-colors"><ArrowDownTrayIcon className="w-4 h-4"/></button>
                </>
            )}
        </div>
      </div>
      <div className="flex-1 bg-zinc-950 relative overflow-hidden">
        {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] z-50">
                {/* Modern Loading Interface */}
                <div className="w-full max-w-md p-8 relative">
                     {/* Background Glow */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <CommandLineIcon className="w-5 h-5 text-cyan-500 animate-pulse" />
                                <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">System Compilation</span>
                            </div>
                            <span className="text-sm font-mono text-zinc-500">{Math.round(progress)}%</span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                                className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-600 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Stage Indicators */}
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-white text-center transition-all duration-300">
                                {stages[loadingStage].text}
                            </h3>
                            <p className="text-xs text-zinc-500 text-center font-mono uppercase tracking-wider">
                                {stages[loadingStage].detail}
                            </p>
                        </div>
                        
                        {/* Terminal-like Output (Decoration) */}
                        <div className="mt-8 p-3 bg-black/40 rounded border border-zinc-800/50 font-mono text-[10px] text-zinc-600 h-24 overflow-hidden flex flex-col justify-end">
                            <div className="opacity-40">> allocating_resources... OK</div>
                            <div className="opacity-60">> loading_modules... OK</div>
                            <div className="opacity-80">> parsing_user_prompt... OK</div>
                            <div className="text-cyan-500/80">> {stages[loadingStage].detail.toLowerCase().replace(/ /g, '_')}...</div>
                            <span className="animate-pulse">_</span>
                        </div>
                     </div>
                </div>
            </div>
        ) : creation?.html && (
            <iframe ref={iframeRef} srcDoc={creation.html} className="w-full h-full border-none" title="preview" sandbox="allow-scripts allow-same-origin allow-modals" />
        )}
      </div>
    </div>
  );
};
