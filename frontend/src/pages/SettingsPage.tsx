import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Settings,
  Users,
  Database,
  Shield,
  Bell,
  FileText,
  Sliders,
  Clock,
  Globe,
  Info,
  Eye,
  EyeOff,
  Server,
  CheckCircle2,
  AlertCircle,
  Key,
  Lock,
  Check,
  X,
  Search,
  Download,
  Volume2,
  Mail,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

type SettingsTab =
  | 'general'
  | 'users'
  | 'storage'
  | 'security'
  | 'notifications'
  | 'audit';

interface TabItem {
  id: SettingsTab;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_TABS: TabItem[] = [
  {
    id: 'general',
    title: 'General',
    subtitle: 'Basic platform settings',
    icon: Settings,
  },
  {
    id: 'users',
    title: 'Users & Roles',
    subtitle: 'Manage users and permissions',
    icon: Users,
  },
  {
    id: 'storage',
    title: 'Data & Storage',
    subtitle: 'Data retention and backup',
    icon: Database,
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Access control and password management',
    icon: Shield,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Alerts and system notifications',
    icon: Bell,
  },
  {
    id: 'audit',
    title: 'Audit Logs',
    subtitle: 'System activity and compliance logs',
    icon: FileText,
  },
];

interface AuditLogItem {
  id: string;
  timestamp: string;
  officer: string;
  badge: string;
  action: string;
  category: 'Security' | 'Biometrics' | 'Evidence' | 'System' | 'Access Control';
  details: string;
  ipAddress: string;
  station: string;
  severity: 'Critical' | 'Warning' | 'Info' | 'Success';
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-9402',
    timestamp: '2025-04-28 10:48:12',
    officer: 'Officer J. Miller',
    badge: 'BADGE-1104',
    action: 'Biometric Face Scan',
    category: 'Biometrics',
    details: '1:1 facial biometric comparison executed against criminal database; result: Discrepancy noted.',
    ipAddress: '10.0.4.18',
    station: 'HQ Terminal 01',
    severity: 'Info',
  },
  {
    id: 'LOG-9401',
    timestamp: '2025-04-28 10:35:40',
    officer: 'Sarah Chen',
    badge: 'ENG-0082',
    action: 'API Key Regenerated',
    category: 'Security',
    details: 'Regenerated primary production API Gateway credentials for external integrations.',
    ipAddress: '10.0.4.52',
    station: 'Admin Console',
    severity: 'Warning',
  },
  {
    id: 'LOG-9400',
    timestamp: '2025-04-28 10:14:02',
    officer: 'System Automated',
    badge: 'SYS-DAEMON',
    action: 'Suspicious Login Blocked',
    category: 'Access Control',
    details: 'Blocked brute force credential attempt from untrusted CIDR block (192.168.1.145).',
    ipAddress: '192.168.1.145',
    station: 'External Gateway',
    severity: 'Critical',
  },
  {
    id: 'LOG-9399',
    timestamp: '2025-04-28 09:52:19',
    officer: 'Insp. Sarah Chen',
    badge: 'BADGE-4092',
    action: 'Evidence File Uploaded',
    category: 'Evidence',
    details: 'Uploaded CCTV digital video evidence file "intersection_cam_04.mp4" with SHA-256 chain of custody.',
    ipAddress: '10.0.4.22',
    station: 'Forensics Lab',
    severity: 'Success',
  },
  {
    id: 'LOG-9398',
    timestamp: '2025-04-28 09:20:44',
    officer: 'Officer J. Miller',
    badge: 'BADGE-1104',
    action: 'Crime Analysis Heatmap Export',
    category: 'System',
    details: 'Queried and exported violent incident cluster density map for North Sector Ward.',
    ipAddress: '10.0.4.18',
    station: 'HQ Terminal 01',
    severity: 'Info',
  },
  {
    id: 'LOG-9397',
    timestamp: '2025-04-28 08:45:10',
    officer: 'Marcus Vance',
    badge: 'BADGE-3319',
    action: 'Grievance Priority Escalated',
    category: 'System',
    details: 'Citizen complaint #GRV-2025-081 escalated from Normal to Priority 1 (Armed Robbery Alert).',
    ipAddress: '10.0.4.30',
    station: 'Grievance Desk',
    severity: 'Warning',
  },
  {
    id: 'LOG-9396',
    timestamp: '2025-04-28 08:00:00',
    officer: 'System Automated',
    badge: 'SYS-DAEMON',
    action: 'Compliance Digest Generated',
    category: 'Security',
    details: 'Cryptographically signed automated compliance log digest generated for regulatory audit.',
    ipAddress: '127.0.0.1',
    station: 'Cluster Node 0',
    severity: 'Success',
  },
  {
    id: 'LOG-9395',
    timestamp: '2025-04-27 23:15:30',
    officer: 'Duty Lead Miller',
    badge: 'BADGE-1104',
    action: 'Officer Clearance Modified',
    category: 'Access Control',
    details: 'Granted Level 3 temporary elevated forensic access to Officer Marcus Vance for active case #882.',
    ipAddress: '10.0.4.18',
    station: 'HQ Terminal 01',
    severity: 'Warning',
  },
  {
    id: 'LOG-9394',
    timestamp: '2025-04-27 21:04:18',
    officer: 'Duty Lead Miller',
    badge: 'BADGE-1104',
    action: 'Session Authentication Passed',
    category: 'Security',
    details: 'Officer authenticated successfully via Hardware Token 2FA (TOTP + FIDO2 key).',
    ipAddress: '10.0.4.18',
    station: 'HQ Terminal 01',
    severity: 'Success',
  },
];

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabQuery = searchParams.get('tab') as SettingsTab;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    tabQuery && ['general', 'users', 'storage', 'security', 'notifications', 'audit'].includes(tabQuery)
      ? tabQuery
      : 'general'
  );

  useEffect(() => {
    const tabParam = new URLSearchParams(location.search).get('tab') as SettingsTab;
    if (tabParam && ['general', 'users', 'storage', 'security', 'notifications', 'audit'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // 1. Platform Information State
  const [platformName, setPlatformName] = useState('Public Safety AI Intelligence Platform');
  const [version, setVersion] = useState('v2.4.0');
  const [environment, setEnvironment] = useState('Production');
  const [timeZone, setTimeZone] = useState('(UTC+08:00) Shanghai');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 2. System Preferences Toggles
  const [realTimeProcessing, setRealTimeProcessing] = useState(true);
  const [dataAnonymization, setDataAnonymization] = useState(true);
  const [autoModelRetraining, setAutoModelRetraining] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // 3. Data Retention State
  const [complaintRetention, setComplaintRetention] = useState('3 years');
  const [mediaRetention, setMediaRetention] = useState('1 year');
  const [logRetention, setLogRetention] = useState('2 years');

  // 4. API Configuration State
  const [gatewayUrl, setGatewayUrl] = useState('https://api.publicsafety.ai');
  const [apiKey, setApiKey] = useState('psip_live_9a8f27c3e104b68e9102f43d');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyRegenerated, setKeyRegenerated] = useState(false);

  // 5. Localization State
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('24-hour (HH:mm)');

  // 6. Security / Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Security Policies State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');
  const [biometricAuthChallenge, setBiometricAuthChallenge] = useState(true);
  const [ipGeofencing, setIpGeofencing] = useState(true);

  // 7. Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifySound, setNotifySound] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('duty.officer@publicsafety.gov');
  const [notificationPhone, setNotificationPhone] = useState('+1 (555) 019-2834');

  const [notifyCriticalThreats, setNotifyCriticalThreats] = useState(true);
  const [notifyBiometricMatch, setNotifyBiometricMatch] = useState(true);
  const [notifyGrievanceUpdates, setNotifyGrievanceUpdates] = useState(true);
  const [notifySystemHealth, setNotifySystemHealth] = useState(false);
  const [notifyAuditDigest, setNotifyAuditDigest] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // 8. Audit Logs State
  const [auditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategory, setAuditCategory] = useState('All');
  const [auditSeverity, setAuditSeverity] = useState('All');
  const [auditToast, setAuditToast] = useState<string | null>(null);

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const passedCriteriaCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-rose-500';
  let strengthTextColor = 'text-rose-600';
  let strengthPercent = 20;

  if (newPassword.length === 0) {
    strengthLabel = 'None';
    strengthColor = 'bg-slate-200';
    strengthTextColor = 'text-slate-400';
    strengthPercent = 0;
  } else if (passedCriteriaCount <= 2) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-500';
    strengthTextColor = 'text-rose-600';
    strengthPercent = 25;
  } else if (passedCriteriaCount === 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-600';
    strengthPercent = 50;
  } else if (passedCriteriaCount === 4) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
    strengthTextColor = 'text-blue-600';
    strengthPercent = 75;
  } else {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-600';
    strengthPercent = 100;
  }

  const handleSavePlatformInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setApiKey(`psip_live_${randomHex}`);
    setKeyRegenerated(true);
    setTimeout(() => setKeyRegenerated(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Please enter your current account password.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Confirmation password does not match the new password.' });
      return;
    }
    if (passedCriteriaCount < 3) {
      setPasswordFeedback({ type: 'error', message: 'Please choose a stronger password meeting the security criteria.' });
      return;
    }
    setPasswordFeedback({ type: 'success', message: 'Password has been successfully updated! Cryptographic hash recorded.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationToast('Notification preferences successfully saved and synchronized.');
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleSendTestNotification = () => {
    // 1. Dispatch custom event to window so the Header Bell Symbol receives it immediately
    const testNotif = {
      id: `test-notif-${Date.now()}`,
      title: '🚨 Test Notification Received',
      message: 'Dispatch priority channel is active and functioning nominally.',
      timestamp: 'Just now',
      type: 'system',
      link: '/settings?tab=notifications',
      unread: true,
    };
    window.dispatchEvent(
      new CustomEvent('psip-new-notification', { detail: testNotif })
    );

    // 2. Play audible confirmation tone
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }

    // 3. Set toast alert in SettingsPage
    setNotificationToast('🚨 Test Notification Sent: Alert received in Notification Bell symbol at the top right!');
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      auditSearch === '' ||
      log.officer.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.badge.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesCategory =
      auditCategory === 'All' || log.category === auditCategory;

    const matchesSeverity =
      auditSeverity === 'All' || log.severity === auditSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportAuditLogs = () => {
    const headers = 'ID,Timestamp,Officer,Badge,Action,Category,Details,IPAddress,Station,Severity\n';
    const rows = filteredAuditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.officer}","${l.badge}","${l.action}","${l.category}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.station}","${l.severity}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Logs_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAuditToast('Audit log export initiated! CSV downloaded.');
    setTimeout(() => setAuditToast(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Page Heading */}
        <div className="flex items-center gap-3.5">
          <div className="text-slate-800 flex items-center justify-center">
            <Settings className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure system preferences, manage users, security, and platform settings.
            </p>
          </div>
        </div>

        {/* Global Toast Alerts */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Platform information saved successfully.</span>
          </div>
        )}
        {keyRegenerated && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-800 flex items-center gap-2 shadow-xs animate-in fade-in">
            <Key className="w-4 h-4 text-blue-600 shrink-0" />
            <span>New API Gateway key regenerated and activated.</span>
          </div>
        )}

        {/* Two-Column Layout: Left Nav Tabs & Right Content Cards */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Sub-Navigation Menu */}
          <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs space-y-1">
            {NAV_TABS.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3.5 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-blue-50/90 text-blue-600 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <IconComp
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <div className="overflow-hidden">
                    <p className={`text-xs sm:text-sm leading-snug ${isActive ? 'text-blue-600' : 'text-slate-900'}`}>
                      {tab.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {tab.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Main Grid */}
          {activeTab === 'general' ? (
            <div className="flex-1 w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Card 1: Platform Information */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Server className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Platform Information
                    </h3>
                  </div>

                  <form onSubmit={handleSavePlatformInfo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Version
                      </label>
                      <input
                        type="text"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Environment
                      </label>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="Production">Production</option>
                        <option value="Staging">Staging</option>
                        <option value="Development">Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Time Zone
                      </label>
                      <select
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="(UTC+08:00) Shanghai">(UTC+08:00) Shanghai</option>
                        <option value="(UTC+05:30) New Delhi / Mumbai">(UTC+05:30) New Delhi / Mumbai</option>
                        <option value="(UTC+00:00) London / UTC">(UTC+00:00) London / UTC</option>
                        <option value="(UTC-05:00) Eastern Time (US)">(UTC-05:00) Eastern Time (US)</option>
                        <option value="(UTC-08:00) Pacific Time (US)">(UTC-08:00) Pacific Time (US)</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Save Platform Info
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Card 2: System Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      System Preferences
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">Real-Time Processing</p>
                        <p className="text-slate-400 text-xs">Process video feeds and complaints in real-time</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRealTimeProcessing(!realTimeProcessing)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          realTimeProcessing ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            realTimeProcessing ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">Data Anonymization</p>
                        <p className="text-slate-400 text-xs">Anonymize citizen PII in analytical dashboards</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDataAnonymization(!dataAnonymization)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          dataAnonymization ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            dataAnonymization ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">Auto Model Retraining</p>
                        <p className="text-slate-400 text-xs">Trigger model retraining on weekly schedules</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoModelRetraining(!autoModelRetraining)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          autoModelRetraining ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            autoModelRetraining ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">Maintenance Mode</p>
                        <p className="text-slate-400 text-xs">Suspend incoming public submissions</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          maintenanceMode ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Data Retention Policies */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Data Retention Policies
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Complaint Records</p>
                        <p className="text-[11px] text-slate-400">Duration to store citizen grievances</p>
                      </div>
                      <select
                        value={complaintRetention}
                        onChange={(e) => setComplaintRetention(e.target.value)}
                        className="w-full sm:w-36 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="1 year">1 year</option>
                        <option value="3 years">3 years</option>
                        <option value="5 years">5 years</option>
                        <option value="Forever">Forever</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Video & Image Evidence</p>
                        <p className="text-[11px] text-slate-400">Retention for media evidence files</p>
                      </div>
                      <select
                        value={mediaRetention}
                        onChange={(e) => setMediaRetention(e.target.value)}
                        className="w-full sm:w-36 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Audit & Access Logs</p>
                        <p className="text-[11px] text-slate-400">Retention for immutable audit trails</p>
                      </div>
                      <select
                        value={logRetention}
                        onChange={(e) => setLogRetention(e.target.value)}
                        className="w-full sm:w-36 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="5 years">5 years</option>
                        <option value="7 years">7 years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: API Configuration */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      API Configuration
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        API Gateway URL
                      </label>
                      <input
                        type="text"
                        value={gatewayUrl}
                        onChange={(e) => setGatewayUrl(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          readOnly
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 pr-10 text-xs sm:text-sm font-mono text-slate-800 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                          title={showApiKey ? 'Hide API Key' : 'Reveal API Key'}
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleRegenerateKey}
                        className="px-4 py-2 border border-blue-500 hover:bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Regenerate API Key
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Localization */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Localization
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full sm:w-48 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Español">Español</option>
                        <option value="Français">Français</option>
                        <option value="Deutsch">Deutsch</option>
                        <option value="中文">中文</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Date Format
                      </label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full sm:w-48 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Time Format
                      </label>
                      <select
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="w-full sm:w-48 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="24-hour (HH:mm)">24-hour (HH:mm)</option>
                        <option value="12-hour (hh:mm A)">12-hour (hh:mm A)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: System Information */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      System Information
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
                      <span className="text-slate-500 font-medium">Platform Version</span>
                      <span className="font-mono font-semibold text-slate-800">v2.4.0</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
                      <span className="text-slate-500 font-medium">Build Number</span>
                      <span className="font-mono font-semibold text-slate-800">20250428.1</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100/80">
                      <span className="text-slate-500 font-medium">Last Updated</span>
                      <span className="text-slate-700 font-medium">Apr 28, 2025 10:24 AM</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-medium">Status</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated Tab Views for other categories */
            <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  {(() => {
                    const currentTab = NAV_TABS.find((t) => t.id === activeTab);
                    if (!currentTab) return <Settings className="w-5 h-5" />;
                    const IconC = currentTab.icon;
                    return <IconC className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 capitalize">
                    {NAV_TABS.find((t) => t.id === activeTab)?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {NAV_TABS.find((t) => t.id === activeTab)?.subtitle}
                  </p>
                </div>
              </div>

              {/* Users & Roles Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">Authorized Officer Personnel & System Administrators</p>
                    <button type="button" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold">
                      Add User
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-4 py-2.5 font-semibold text-slate-700 grid grid-cols-4">
                      <span>Name</span>
                      <span>Role</span>
                      <span>Clearance</span>
                      <span>Status</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="px-4 py-3 grid grid-cols-4 items-center">
                        <span className="font-medium text-slate-900">Officer J. Miller</span>
                        <span className="text-slate-600">Duty Operations Lead</span>
                        <span className="text-slate-600">Level 4</span>
                        <span className="text-emerald-600 font-semibold">Active</span>
                      </div>
                      <div className="px-4 py-3 grid grid-cols-4 items-center">
                        <span className="font-medium text-slate-900">Sarah Chen</span>
                        <span className="text-slate-600">Infrastructure Engineer</span>
                        <span className="text-slate-600">Level 4</span>
                        <span className="text-emerald-600 font-semibold">Active</span>
                      </div>
                      <div className="px-4 py-3 grid grid-cols-4 items-center">
                        <span className="font-medium text-slate-900">Marcus Vance</span>
                        <span className="text-slate-600">Critical Systems Analyst</span>
                        <span className="text-slate-600">Level 3</span>
                        <span className="text-emerald-600 font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage Tab */}
              {activeTab === 'storage' && (
                <div className="space-y-4 text-xs text-slate-600">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-400 font-medium">Database Volume</span>
                      <p className="text-xl font-bold font-mono text-slate-900 mt-1">14.8 GB</p>
                      <span className="text-[10px] text-slate-500">PostgreSQL / SQLite Cluster</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-400 font-medium">Media Storage</span>
                      <p className="text-xl font-bold font-mono text-slate-900 mt-1">82.4 GB</p>
                      <span className="text-[10px] text-slate-500">Biometric & Scene Evidence</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-400 font-medium">Backup Health</span>
                      <p className="text-xl font-bold text-emerald-600 mt-1">100% Synced</p>
                      <span className="text-[10px] text-slate-500">Daily snapshot at 02:00 UTC</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab: Password Management & Authentication */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  {/* Password Status Feedback */}
                  {passwordFeedback && (
                    <div
                      className={`p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm animate-in fade-in shadow-xs ${
                        passwordFeedback.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {passwordFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span>{passwordFeedback.message}</span>
                    </div>
                  )}

                  {/* Section 1: Password Management */}
                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          Password Management
                        </h4>
                        <p className="text-xs text-slate-500">
                          Rotate duty passwords regularly to safeguard law enforcement data and case access.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-2xl">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current account password"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                            title={showCurrentPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Change Password / New Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            Change Password (New Password)
                          </label>
                          {newPassword.length > 0 && (
                            <span className={`text-xs font-semibold ${strengthTextColor}`}>
                              Strength: {strengthLabel}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new strong password"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                            title={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Password Strength Indicator Meter */}
                        <div className="mt-2.5 space-y-2">
                          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden flex gap-1 p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                              style={{ width: `${strengthPercent}%` }}
                            />
                          </div>

                          {/* Checklist of strength criteria */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                              {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>8+ Characters</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                              {hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>Uppercase Letter</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                              {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>At least 1 Number</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                              {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>Special Symbol</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-type new password to confirm"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {confirmPassword.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                            {newPassword === confirmPassword ? (
                              <span className="text-emerald-600 font-medium flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Passwords match
                              </span>
                            ) : (
                              <span className="text-rose-600 font-medium flex items-center gap-1">
                                <X className="w-3.5 h-3.5" /> Passwords do not match
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-2xs hover:shadow-xs flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section 2: Authentication & Access Policies */}
                  <div className="border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          Authentication & Access Policies
                        </h4>
                        <p className="text-xs text-slate-500">
                          Enforce zero-trust multi-factor credentials and session expiration thresholds.
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                      <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">Two-Factor Authentication (2FA)</p>
                          <p className="text-xs text-slate-500">Require TOTP authenticator or FIDO2 hardware security key for login.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            twoFactorAuth ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">Session Inactivity Timeout</p>
                          <p className="text-xs text-slate-500">Automatically lock active officer console after idle period.</p>
                        </div>
                        <select
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(e.target.value)}
                          className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                        >
                          <option value="15 minutes">15 minutes</option>
                          <option value="30 minutes">30 minutes</option>
                          <option value="1 hour">1 hour</option>
                          <option value="4 hours">4 hours</option>
                        </select>
                      </div>

                      <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">Biometric Verification Challenge</p>
                          <p className="text-xs text-slate-500">Re-verify facial biometric scan before forensic record deletion or export.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBiometricAuthChallenge(!biometricAuthChallenge)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            biometricAuthChallenge ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              biometricAuthChallenge ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">Station IP Restriction / Geofencing</p>
                          <p className="text-xs text-slate-500">Restrict duty logins strictly to authorized precinct intranet IP subnets.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIpGeofencing(!ipGeofencing)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            ipGeofencing ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              ipGeofencing ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab: System & Dispatch Alerts */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Notification Toast Alert */}
                  {notificationToast && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 flex items-center gap-3 shadow-xs animate-in fade-in">
                      <Bell className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{notificationToast}</span>
                    </div>
                  )}

                  {/* Master Toggle Banner */}
                  <div className={`p-6 rounded-2xl border transition-all ${
                    notificationsEnabled
                      ? 'bg-blue-50/60 border-blue-200/80'
                      : 'bg-slate-100/70 border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notificationsEnabled ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
                        }`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            Master System Notifications
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {notificationsEnabled
                              ? 'All notification feeds, operational alerts, and threat dispatches are currently active.'
                              : 'All notifications are muted. You will not receive audio, email, or in-app emergency chimes.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          notificationsEnabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {notificationsEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Alert Channels & Delivery Options */}
                  <div className={`space-y-6 ${notificationsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            Delivery Channels
                          </h4>
                          <p className="text-xs text-slate-500">
                            Select how urgent alerts and daily summaries are routed to your terminal or mobile unit.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Volume2 className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-slate-900">Audio / Chime Alerts</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Audible warning chime on priority incidents.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifySound(!notifySound)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ml-3 ${
                              notifySound ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                              notifySound ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Bell className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-slate-900">Browser Push Alerts</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Desktop popup when window is minimized.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyPush(!notifyPush)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ml-3 ${
                              notifyPush ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                              notifyPush ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Mail className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                            <div className="w-full">
                              <p className="text-xs sm:text-sm font-semibold text-slate-900">Officer Email Dispatch</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Send incident reports to duty officer inbox.</p>
                              <input
                                type="email"
                                value={notificationEmail}
                                onChange={(e) => setNotificationEmail(e.target.value)}
                                className="mt-2 text-xs bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 w-full"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyEmail(!notifyEmail)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ml-3 ${
                              notifyEmail ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                              notifyEmail ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Smartphone className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                            <div className="w-full">
                              <p className="text-xs sm:text-sm font-semibold text-slate-900">Emergency SMS Alerts</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">Critical broadcast SMS for level-1 emergencies.</p>
                              <input
                                type="text"
                                value={notificationPhone}
                                onChange={(e) => setNotificationPhone(e.target.value)}
                                className="mt-2 text-xs bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 w-full"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifySMS(!notifySMS)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors shrink-0 ml-3 ${
                              notifySMS ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                              notifySMS ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Event Notification Toggles */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            Notification Triggers & Event Categories
                          </h4>
                          <p className="text-xs text-slate-500">
                            Toggle specific alert streams based on duty assignment and priority thresholds.
                          </p>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">Critical Threat & High-Risk Incidents</p>
                            <p className="text-xs text-slate-500">Immediate trigger for weapon detection, priority 1 crime, and perimeter breach.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyCriticalThreats(!notifyCriticalThreats)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              notifyCriticalThreats ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notifyCriticalThreats ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">Biometric & Facial Identification Matches</p>
                            <p className="text-xs text-slate-500">Notify when live camera feed or uploaded suspect matches warrant database.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyBiometricMatch(!notifyBiometricMatch)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              notifyBiometricMatch ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notifyBiometricMatch ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">Citizen Grievances & Case Escalations</p>
                            <p className="text-xs text-slate-500">Alerts when public grievance priority changes or requires immediate supervisor review.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyGrievanceUpdates(!notifyGrievanceUpdates)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              notifyGrievanceUpdates ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notifyGrievanceUpdates ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">System Diagnostics & Storage Thresholds</p>
                            <p className="text-xs text-slate-500">Resource monitor warnings for storage exceeding 85% or service heartbeat lapses.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifySystemHealth(!notifySystemHealth)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              notifySystemHealth ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notifySystemHealth ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">Daily Compliance & Security Digest</p>
                            <p className="text-xs text-slate-500">Automated daily summary of station audit events dispatched at 08:00 AM.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifyAuditDigest(!notifyAuditDigest)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                              notifyAuditDigest ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              notifyAuditDigest ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveNotifications}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Save Notification Preferences
                      </button>
                      <button
                        type="button"
                        onClick={handleSendTestNotification}
                        className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <Bell className="w-4 h-4 text-slate-500" />
                        Send Test Notification
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Audit Logs Tab: Activity & Compliance Records */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  {/* Export / Toast message */}
                  {auditToast && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{auditToast}</span>
                    </div>
                  )}

                  {/* Header with tamper-proof badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        Platform Activity & Compliance Audit Trail
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time forensic logs tracking authentication, biometric comparisons, data alterations, and system changes.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        SHA-256 Tamper-Proof Chain
                      </span>
                      <button
                        type="button"
                        onClick={handleExportAuditLogs}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Search & Filter Toolbar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                    <div className="sm:col-span-6 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        placeholder="Search by officer, badge, action, IP, or details..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={auditCategory}
                        onChange={(e) => setAuditCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        <option value="Security">Security</option>
                        <option value="Biometrics">Biometrics</option>
                        <option value="Evidence">Evidence</option>
                        <option value="Access Control">Access Control</option>
                        <option value="System">System</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={auditSeverity}
                        onChange={(e) => setAuditSeverity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                      >
                        <option value="All">All Severities</option>
                        <option value="Success">Success</option>
                        <option value="Info">Info</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Audit Log Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="py-3 px-4">Log ID & Time</th>
                            <th className="py-3 px-4">Officer / Origin</th>
                            <th className="py-3 px-4">Action & Details</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">IP / Station</th>
                            <th className="py-3 px-4">Severity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredAuditLogs.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-400">
                                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="font-semibold text-slate-700">No matching audit logs found</p>
                                <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search query or filter criteria.</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAuditSearch('');
                                    setAuditCategory('All');
                                    setAuditSeverity('All');
                                  }}
                                  className="mt-3 px-3 py-1.5 text-xs text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                >
                                  Reset Filters
                                </button>
                              </td>
                            </tr>
                          ) : (
                            filteredAuditLogs.map((log) => {
                              const severityBadge =
                                log.severity === 'Critical'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : log.severity === 'Warning'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : log.severity === 'Success'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200';

                              return (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <p className="font-mono font-semibold text-slate-900">{log.id}</p>
                                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{log.timestamp}</p>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <p className="font-medium text-slate-900">{log.officer}</p>
                                    <p className="text-[11px] font-mono text-slate-500">{log.badge}</p>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <p className="font-semibold text-slate-900">{log.action}</p>
                                    <p className="text-[11px] text-slate-500 line-clamp-1">{log.details}</p>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                                      {log.category}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <p className="font-mono text-xs text-slate-700">{log.ipAddress}</p>
                                    <p className="text-[11px] text-slate-400">{log.station}</p>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${severityBadge}`}>
                                      {log.severity}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="py-3 px-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Showing <strong className="text-slate-800">{filteredAuditLogs.length}</strong> of{' '}
                        <strong className="text-slate-800">{auditLogs.length}</strong> recorded audit events
                      </span>
                      <span className="text-[11px] text-slate-400">All log records are cryptographically sealed & tamper-evident</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
