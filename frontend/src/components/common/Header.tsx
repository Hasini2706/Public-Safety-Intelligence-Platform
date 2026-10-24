import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, User, ChevronDown, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [searchQuery, setSearchQuery] = useState('');

  const checkConnection = async () => {
    setBackendStatus('checking');
    try {
      const data = await api.checkHealth();
      if (data && data.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input matching photo */}
        <div className="relative w-full max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by complaint ID, name, or location..."
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right: Notifications & Officer Profile */}
      <div className="flex items-center gap-4">
        {/* Backend health mini indicator */}
        <div
          onClick={checkConnection}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          title="Backend Connection Status (Click to verify)"
        >
          {backendStatus === 'checking' ? (
            <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" />
          ) : (
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
            />
          )}
          <span className="text-[11px] font-medium capitalize hidden md:inline">
            {backendStatus}
          </span>
        </div>

        {/* Notification Bell with Badge 3 */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="3 New Alerts"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute 1 top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
              3
            </span>
          </button>
        </div>

        {/* Officer User Profile */}
        <div className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
            Officer
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

