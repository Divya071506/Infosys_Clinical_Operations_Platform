import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading clinical data...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#060913]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyan-400 text-xs font-bold font-mono">ICOP</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <span className="text-sm text-slate-400">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
