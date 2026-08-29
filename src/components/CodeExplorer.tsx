import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES } from '../data/projectFiles';
import { ProjectFile } from '../types';
import { FileCode, Copy, Check, FileText, Download } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[1]); // MainActivity
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[780px]">
      {/* Top Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-sm text-slate-200">Android Studio Project Files</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition font-medium border border-slate-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy File'}
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-64 bg-slate-950/60 border-r border-slate-800 overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">
            Core Modules
          </div>
          {ANDROID_PROJECT_FILES.map(file => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 text-xs font-mono text-slate-400 truncate">
            {selectedFile.path}
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed selection:bg-rose-500/30">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
