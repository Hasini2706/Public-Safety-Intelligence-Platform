import React, { useEffect, useState } from 'react';
import { Menu, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendVersion, setBackendVersion] = useState<string>('');

  const checkConnection = async () => {
    setBackendStatus('checking');
    try {
      const data = await api.checkHealth();
      if (data && data.status === 'healthy') {
        setBackendStatus('online');
        setBackendVersion(data.version || '1.0.0');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // 30 sec poll
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Public Safety Intelligence Platform</span>
          <span>/</span>
          <span className="text-slate-600">Decision-Support Operations Console</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          Dev Environment
        </span>

        {/* Backend Connectivity Status Pill */}
        <div
          onClick={checkConnection}
          className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            backendStatus === 'online'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : backendStatus === 'offline'
              ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
          title="Click to re-check API connection"
        >
          {backendStatus === 'checking' && (
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
          )}
          {backendStatus === 'online' && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
          {backendStatus === 'offline' && (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          )}

          <div className="flex items-center gap-1">
            <span className="font-medium">Backend:</span>
            <span>
              {backendStatus === 'online'
                ? `Online (v${backendVersion})`
                : backendStatus === 'offline'
                ? 'Disconnected'
                : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
