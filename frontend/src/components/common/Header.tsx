import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  Info,
  ShieldCheck,
  X,
  AlertCircle,
  Activity,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onOpenMobile: () => void;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'system';
}

export interface OfficerProfileData {
  name: string;
  role: string;
  badgeNumber: string;
  department: string;
  clearanceLevel: string;
  station: string;
  status: 'Active on Duty' | 'Off Duty';
}

const DEFAULT_OFFICER: OfficerProfileData = {
  name: 'Officer J. Miller',
  role: 'Duty Operations Officer',
  badgeNumber: 'PSIP-4821',
  department: 'Public Safety Intelligence Command',
  clearanceLevel: 'Level 4 Intelligence Access',
  station: 'Central Command Center',
  status: 'Active on Duty',
};

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Platform AI Services Operational',
    message: 'All 5 analytical and decision-support models are connected and ready.',
    timestamp: 'Just now',
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'FastAPI Intelligence Gateway Active',
    message: 'Backend server connection verified on 127.0.0.1:8000.',
    timestamp: '5m ago',
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'System Diagnostics Passed',
    message: 'All module endpoints healthy with zero critical service warnings.',
    timestamp: '15m ago',
    type: 'system',
  },
];

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Officer Profile state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [officer, setOfficer] = useState<OfficerProfileData | null>(DEFAULT_OFFICER);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Handle outside clicks and ESC key for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input */}
        <div className="relative w-full max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by incident ID, name, or location..."
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Right: Notifications & Officer Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
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
                backendStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          )}
          <span className="text-[11px] font-medium capitalize hidden md:inline">
            {backendStatus}
          </span>
        </div>

        {/* Notifications Button & Dropdown Panel */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            className={`p-2 rounded-lg transition-colors relative ${
              isNotificationsOpen
                ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                      {notifications.length} unread
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-[11px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Notifications List or Empty State */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-10 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">No notifications</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                      You are all caught up! No active system alerts or notifications at this time.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 relative group"
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'success' ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : item.type === 'system' ? (
                          <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Info className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pr-4">
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                          {item.timestamp}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => dismissNotification(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 p-1 transition-opacity absolute top-3 right-3"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Panel Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Live Platform Telemetry
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    navigate('/system-status');
                  }}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  System Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Button & Dropdown Panel */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={toggleProfile}
            className={`flex items-center gap-2.5 pl-2 py-1 rounded-lg transition-all ${
              isProfileOpen
                ? 'bg-slate-100 ring-1 ring-slate-200'
                : 'hover:bg-slate-50 cursor-pointer'
            }`}
            title="Officer Profile"
            aria-label="Officer Profile"
            aria-expanded={isProfileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center shadow-xs text-xs font-semibold relative">
              <User className="w-4 h-4" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              {officer ? officer.name.split(' ')[0] : 'Officer'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                isProfileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Officer Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {officer ? (
                <div>
                  {/* Officer Header Card */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-700/80 border border-slate-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        JM
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white truncate">{officer.name}</h3>
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-300 truncate mt-0.5">{officer.role}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-200 border border-blue-400/30">
                          {officer.badgeNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Officer Information Details */}
                  <div className="p-4 space-y-2.5 text-xs text-slate-600 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Department</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[170px]">
                        {officer.department}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Clearance</span>
                      <span className="font-medium text-slate-800 text-right">
                        {officer.clearanceLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Station</span>
                      <span className="font-medium text-slate-800 text-right">
                        {officer.station}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Status</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {officer.status}
                      </span>
                    </div>
                  </div>

                  {/* Supported Navigation Actions */}
                  <div className="p-2 space-y-1 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/system-status');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Activity className="w-4 h-4 text-slate-400" />
                      <span>System & Model Status</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/about');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Platform Information</span>
                    </button>
                  </div>

                  {/* Session Footer */}
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-[10px]">Session: Authenticated</span>
                    <button
                      type="button"
                      onClick={() => setOfficer(null)}
                      className="text-slate-500 hover:text-rose-600 text-xs font-medium transition-colors"
                      title="Lock or clear current officer session"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                /* Clear Fallback Message State if officer info is unavailable */
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Officer Profile Unavailable
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                    No officer profile data found for the current active session.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOfficer(DEFAULT_OFFICER)}
                    className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Profile</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
