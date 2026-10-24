import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  ChevronDown,
  MessageSquare,
  User,
  ShieldAlert,
  BarChart2,
  Scale,
  AlertTriangle,
  Info,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState('Oct 1, 2026 - Oct 31, 2026');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [hoveredTrendDay, setHoveredTrendDay] = useState<{ day: string; count: number } | null>(null);

  const dateOptions = [
    'Oct 1, 2026 - Oct 31, 2026',
    'Sep 1, 2026 - Sep 30, 2026',
    'Last 7 Days',
    'Year to Date (2026)',
  ];

  const locationOptions = [
    'All Locations',
    'Downtown Sector 1',
    'Sector 4 Industrial Warehouse',
    'Data Center Zone B',
    'Coal Mine Site JH-04',
  ];

  // Complaints by category data matching photo
  const categoryData = [
    { label: 'Theft', count: 68, pct: 27, color: '#3B82F6' },
    { label: 'Harassment', count: 52, pct: 21, color: '#F97316' },
    { label: 'Cybercrime', count: 42, pct: 17, color: '#06B6D4' },
    { label: 'Violence', count: 34, pct: 14, color: '#EF4444' },
    { label: 'Missing Person', count: 26, pct: 10, color: '#8B5CF6' },
    { label: 'Others', count: 26, pct: 10, color: '#94A3B8' },
  ];

  // Crime trend (Last 7 Days) matching photo
  const trendData = [
    { date: 'Oct 25', count: 26, x: 25, y: 110 },
    { date: 'Oct 26', count: 31, x: 85, y: 100 },
    { date: 'Oct 27', count: 33, x: 145, y: 95 },
    { date: 'Oct 28', count: 43, x: 205, y: 75 },
    { date: 'Oct 29', count: 33, x: 265, y: 95 },
    { date: 'Oct 30', count: 46, x: 325, y: 68 },
    { date: 'Oct 31', count: 60, x: 385, y: 40 },
  ];

  // SVG Donut Calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  let accumulatedOffset = 0;

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] min-h-screen">
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header: Title, Subtitle, and Date/Location Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI-powered insights for a safer community
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range Selector */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsLocationOpen(false);
                }}
                className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedDateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isDateOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedDateRange(opt);
                        setIsDateOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors ${
                        selectedDateRange === opt ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Selector */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen);
                  setIsDateOpen(false);
                }}
                className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isLocationOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                  {locationOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(opt);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 transition-colors ${
                        selectedLocation === opt ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1. Top 5 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Complaints */}
          <div
            onClick={() => navigate('/complaints')}
            className="cursor-pointer bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4 fill-white/10" />
            </div>
            <div className="mt-3.5">
              <span className="text-xs font-semibold text-slate-600">Total Complaints</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">248</span>
                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
                  ↑ 12%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">vs. last month</p>
            </div>
          </div>

          {/* Card 2: Pending Review */}
          <div
            onClick={() => navigate('/identity')}
            className="cursor-pointer bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDBA74] text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="mt-3.5">
              <span className="text-xs font-semibold text-slate-600">Pending Review</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">48</span>
                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
                  ↑ 6%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">vs. last month</p>
            </div>
          </div>

          {/* Card 3: Threat Alerts */}
          <div
            onClick={() => navigate('/threat-detection')}
            className="cursor-pointer bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F87171] text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="mt-3.5">
              <span className="text-xs font-semibold text-slate-600">Threat Alerts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">12</span>
                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
                  ↑ 33%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">vs. last month</p>
            </div>
          </div>

          {/* Card 4: Resolved Cases */}
          <div
            onClick={() => navigate('/crime-analysis')}
            className="cursor-pointer bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4ADE80] text-white flex items-center justify-center shadow-xs">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div className="mt-3.5">
              <span className="text-xs font-semibold text-slate-600">Resolved Cases</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">182</span>
                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
                  ↑ 15%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">vs. last month</p>
            </div>
          </div>

          {/* Card 5: Compliance Status */}
          <div
            onClick={() => navigate('/governance')}
            className="cursor-pointer bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl p-5 shadow-xs hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C084FC] text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div className="mt-3.5">
              <span className="text-xs font-semibold text-slate-600">Compliance Status</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">98%</span>
                <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
                  ↑ 2%
                </span>
              </div>
              <p className="text-[11px] text-purple-600/70 font-medium mt-1">Policy aligned</p>
            </div>
          </div>
        </div>

        {/* 2. Middle Row: 3 Analytics Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card A: Complaints by Category (Donut Chart) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-4">
              Complaints by Category
            </h2>

            <div className="flex items-center justify-between gap-4">
              {/* SVG Donut */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {categoryData.map((cat, idx) => {
                    const strokeDasharray = `${(cat.pct / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedOffset;
                    accumulatedOffset += (cat.pct / 100) * circumference;

                    return (
                      <circle
                        key={idx}
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="16"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Donut Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-800 tracking-tight">248</span>
                  <span className="text-[11px] text-slate-400 font-medium">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-1.5 pl-2">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-slate-600 font-medium text-[11px]">{cat.label}</span>
                    </div>
                    <span className="text-slate-800 font-semibold text-[11px]">
                      {cat.count} ({cat.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card B: Crime Trend (Last 7 Days) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Crime Trend (Last 7 Days)
              </h2>
              {hoveredTrendDay && (
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {hoveredTrendDay.day}: {hoveredTrendDay.count} cases
                </span>
              )}
            </div>

            {/* SVG Line Chart */}
            <div className="relative w-full h-44">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 410 140">
                <defs>
                  <linearGradient id="crimeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines & Y-axis labels */}
                <line x1="25" y1="20" x2="395" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <text x="12" y="24" textAnchor="end" className="text-[9px] fill-slate-400 font-medium">80</text>

                <line x1="25" y1="50" x2="395" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <text x="12" y="54" textAnchor="end" className="text-[9px] fill-slate-400 font-medium">60</text>

                <line x1="25" y1="80" x2="395" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                <text x="12" y="84" textAnchor="end" className="text-[9px] fill-slate-400 font-medium">40</text>

                <line x1="25" y1="110" x2="395" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                <text x="12" y="114" textAnchor="end" className="text-[9px] fill-slate-400 font-medium">20</text>

                <line x1="25" y1="130" x2="395" y2="130" stroke="#E2E8F0" strokeWidth="1" />
                <text x="12" y="133" textAnchor="end" className="text-[9px] fill-slate-400 font-medium">0</text>

                {/* Area Gradient Fill */}
                <polygon
                  points={`25,130 25,110 85,100 145,95 205,75 265,95 325,68 385,40 385,130`}
                  fill="url(#crimeAreaGrad)"
                />

                {/* Trend Polyline */}
                <polyline
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="25,110 85,100 145,95 205,75 265,95 325,68 385,40"
                />

                {/* Data Points */}
                {trendData.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:r-5 transition-all"
                    onMouseEnter={() => setHoveredTrendDay({ day: pt.date, count: pt.count })}
                    onMouseLeave={() => setHoveredTrendDay(null)}
                  />
                ))}
              </svg>
            </div>

            {/* X-axis date labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-2 mt-1">
              {trendData.map((pt, idx) => (
                <span key={idx}>{pt.date}</span>
              ))}
            </div>
          </div>

          {/* Card C: Crime Hotspots */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight mb-2">
              Crime Hotspots
            </h2>

            {/* Simulated Geographic Heatmap Canvas */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200/70 bg-[#EEF2F6]">
              {/* Street grid background lines */}
              <svg className="absolute inset-0 w-full h-full stroke-white/80" strokeWidth="2.5">
                <line x1="0" y1="40" x2="100%" y2="40" />
                <line x1="0" y1="85" x2="100%" y2="85" />
                <line x1="0" y1="125" x2="100%" y2="125" />
                <line x1="45" y1="0" x2="45" y2="100%" />
                <line x1="120" y1="0" x2="120" y2="100%" />
                <line x1="190" y1="0" x2="190" y2="100%" />
                <line x1="250" y1="0" x2="250" y2="100%" />
                {/* Diagonal boulevard */}
                <line x1="0" y1="120" x2="260" y2="10" strokeWidth="4" stroke="#FFFFFF" />
              </svg>

              {/* Heatmap Glow Spots matching photo positions */}
              {/* Upper-right High cluster */}
              <div className="absolute top-4 right-6 w-14 h-14 rounded-full bg-red-500/70 blur-md pointer-events-none" />
              <div className="absolute top-6 right-8 w-8 h-8 rounded-full bg-amber-400/80 blur-sm pointer-events-none" />

              {/* Mid-left High cluster */}
              <div className="absolute top-12 left-8 w-14 h-14 rounded-full bg-red-500/70 blur-md pointer-events-none" />
              <div className="absolute top-14 left-10 w-7 h-7 rounded-full bg-amber-400/80 blur-sm pointer-events-none" />

              {/* Lower-right High cluster */}
              <div className="absolute bottom-5 right-12 w-14 h-14 rounded-full bg-red-500/70 blur-md pointer-events-none" />
              <div className="absolute bottom-7 right-14 w-6 h-6 rounded-full bg-amber-400/80 blur-sm pointer-events-none" />

              {/* Center Medium cluster */}
              <div className="absolute top-12 left-28 w-10 h-10 rounded-full bg-amber-400/60 blur-md pointer-events-none" />

              {/* Lower-left Low/Medium cluster */}
              <div className="absolute bottom-6 left-12 w-10 h-10 rounded-full bg-emerald-400/60 blur-md pointer-events-none" />
            </div>

            {/* Heatmap Legend matching photo */}
            <div className="flex items-center justify-start gap-4 mt-3 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Recent Activity</h2>
              <button
                type="button"
                onClick={() => navigate('/complaints')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Item 1 */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">New complaint received</h4>
                    <p className="text-[11px] text-slate-400">#C-2026-1054 &nbsp;|&nbsp; Theft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-400">2 hours ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                    New
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">
                      Identity verification completed
                    </h4>
                    <p className="text-[11px] text-slate-400">#ID-8932 &nbsp;|&nbsp; Documents Verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-400">3 hours ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">Threat alert detected</h4>
                    <p className="text-[11px] text-slate-400">#T-4412 &nbsp;|&nbsp; Suspicious Activity</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-400">5 hours ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
                    High
                  </span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">
                      Crime analysis report updated
                    </h4>
                    <p className="text-[11px] text-slate-400">#CA-7781 &nbsp;|&nbsp; Burglary Trends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-400">6 hours ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                    Report
                  </span>
                </div>
              </div>

              {/* Item 5 */}
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">
                      Policy compliance check completed
                    </h4>
                    <p className="text-[11px] text-slate-400">#GC-2210 &nbsp;|&nbsp; Data Retention</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-slate-400">8 hours ago</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Compliant
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Notifications */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">Notifications</h2>
              <button
                type="button"
                onClick={() => navigate('/system-status')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {/* Notif 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-slate-800">
                    3 high severity threat alerts need review
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Check the latest alerts in Threat Detection.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
              </div>

              {/* Notif 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-slate-800">
                    12 new complaints pending classification
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Review and assign cases in Complaint Classification.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
                </div>
              </div>

              {/* Notif 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-slate-800">
                    Identity match suggestions available
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    5 possible duplicate records flagged.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5 hours ago</span>
                </div>
              </div>

              {/* Notif 4 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-slate-800">
                    Monthly compliance report ready
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Access the Governance & Compliance section.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
