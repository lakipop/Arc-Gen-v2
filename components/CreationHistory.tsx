/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClipboardDocumentListIcon, ArrowRightIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; // Base64 data URL
  timestamp: Date;
}

interface CreationHistoryProps {
  history: Creation[];
  onSelect: (creation: Creation) => void;
}

export const CreationHistory: React.FC<CreationHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-3 mb-3 px-2">
        <ClipboardDocumentListIcon className="w-4 h-4 text-zinc-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Audit Logs</h2>
        <div className="h-px flex-1 bg-zinc-800"></div>
      </div>
      
      {/* Horizontal Scroll Container for Compact Layout */}
      <div className="flex overflow-x-auto space-x-4 pb-2 px-2 scrollbar-hide">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex-shrink-0 relative flex flex-col text-left w-44 h-28 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-900/50 rounded-sm transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 bg-zinc-800 rounded-sm group-hover:bg-zinc-700 transition-colors border border-zinc-700/50">
                      {isPdf ? (
                          <DocumentIcon className="w-3 h-3 text-zinc-400" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-3 h-3 text-zinc-400" />
                      ) : (
                          <DocumentIcon className="w-3 h-3 text-zinc-400" />
                      )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 group-hover:text-cyan-400">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-xs font-mono font-medium text-zinc-400 group-hover:text-cyan-100 truncate uppercase">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-cyan-500 font-mono">VIEW LOG</span>
                    <ArrowRightIcon className="w-3 h-3 text-cyan-500" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};