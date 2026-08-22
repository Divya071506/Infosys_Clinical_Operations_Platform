import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#060913] text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold font-mono text-gradient-cyan">404</h1>
          <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested clinical endpoint or route does not exist in the platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary w-full text-xs !py-2.5">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full text-xs !py-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
