import React, { useState } from 'react';
import {
  Settings,
  Users,
  Database,
  Cpu,
  Link as LinkIcon,
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
} from 'lucide-react';

type SettingsTab =
  | 'general'
  | 'users'
  | 'storage'
  | 'models'
  | 'integrations'
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
    id: 'models',
    title: 'AI Model Settings',
    subtitle: 'Model configuration and tuning',
    icon: Cpu,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    subtitle: 'Third-party systems & APIs',
    icon: LinkIcon,
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Access control and authentication',
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

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

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

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Main Page Heading matching Photo */}
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
          {/* Left Sub-Navigation Menu matching photo */}
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

          {/* Right Main Grid matching photo */}
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
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs cursor-pointer"
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
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs cursor-pointer"
                      >
                        <option value="(UTC+08:00) Shanghai">(UTC+08:00) Shanghai</option>
                        <option value="(UTC+05:30) New Delhi / Mumbai">(UTC+05:30) New Delhi / Mumbai</option>
                        <option value="(UTC+00:00) London / UTC">(UTC+00:00) London / UTC</option>
                        <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option value="(UTC-08:00) Pacific Time (US & Canada)">(UTC-08:00) Pacific Time (US & Canada)</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Card 2: System Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      System Preferences
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {/* Toggle 1: Enable real-time processing */}
                    <div className="flex items-center justify-between py-3.5">
                      <div className="pr-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                          Enable real-time processing
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Process incoming data in real time
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={realTimeProcessing}
                        onClick={() => setRealTimeProcessing(!realTimeProcessing)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          realTimeProcessing ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            realTimeProcessing ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 2: Enable data anonymization */}
                    <div className="flex items-center justify-between py-3.5">
                      <div className="pr-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                          Enable data anonymization
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Protect personal information in analytics
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={dataAnonymization}
                        onClick={() => setDataAnonymization(!dataAnonymization)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          dataAnonymization ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            dataAnonymization ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 3: Auto model retraining */}
                    <div className="flex items-center justify-between py-3.5">
                      <div className="pr-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                          Auto model retraining
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Automatically retrain models with new data
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoModelRetraining}
                        onClick={() => setAutoModelRetraining(!autoModelRetraining)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          autoModelRetraining ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            autoModelRetraining ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 4: System maintenance mode */}
                    <div className="flex items-center justify-between py-3.5">
                      <div className="pr-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                          System maintenance mode
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Temporarily disable non-essential services
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={maintenanceMode}
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          maintenanceMode ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Data Retention */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Data Retention
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Complaint Data Retention
                      </label>
                      <select
                        value={complaintRetention}
                        onChange={(e) => setComplaintRetention(e.target.value)}
                        className="w-full sm:w-44 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="5 years">5 years</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Video/Image Retention
                      </label>
                      <select
                        value={mediaRetention}
                        onChange={(e) => setMediaRetention(e.target.value)}
                        className="w-full sm:w-44 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Log Retention
                      </label>
                      <select
                        value={logRetention}
                        onChange={(e) => setLogRetention(e.target.value)}
                        className="w-full sm:w-44 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white shadow-2xs cursor-pointer"
                      >
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="5 years">5 years</option>
                      </select>
                    </div>

                    {/* Notice Callout */}
                    <div className="mt-4 p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Data older than the retention period will be automatically deleted in accordance with compliance policies.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: API Configuration */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4" />
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
            <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
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

              {activeTab === 'models' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600">Active Machine Learning Models & Operational Thresholds</p>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Complaints NLP Classifier</p>
                        <p className="text-[11px] text-slate-500">TF-IDF + Ridge Classifier</p>
                      </div>
                      <span className="font-mono text-emerald-600 font-semibold">Ready (v1.0.0)</span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Biometric Face Embedding Matcher</p>
                        <p className="text-[11px] text-slate-500">Cosine Similarity (Threshold: 0.78)</p>
                      </div>
                      <span className="font-mono text-emerald-600 font-semibold">Ready (v1.0.0)</span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Physical Security Threat Anomaly Detector</p>
                        <p className="text-[11px] text-slate-500">Isolation Forest Anomaly Scoring</p>
                      </div>
                      <span className="font-mono text-emerald-600 font-semibold">Ready (v1.0.0)</span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Crime Analysis & Risk Escalation</p>
                        <p className="text-[11px] text-slate-500">Multi-Factor Pattern Correlation</p>
                      </div>
                      <span className="font-mono text-emerald-600 font-semibold">Ready (v1.0.0)</span>
                    </div>
                  </div>
                </div>
              )}

              {['integrations', 'security', 'notifications', 'audit'].includes(activeTab) && (
                <div className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">
                    {NAV_TABS.find((t) => t.id === activeTab)?.title} Configured
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    All parameters for this section are active and operating under the platform compliance defaults.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
