import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  X,
  Play,
  Loader2,
  Sparkles,
  Building2,
  Send,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';

interface ComplaintItem {
  id: string;
  dateTime: string;
  summary: string;
  category: string;
  status: 'Action Required' | 'Under Review' | 'Resolved';
  risk: 'High' | 'Medium' | 'Low';
  department?: string;
  confidence?: number;
}

interface ClassificationResult {
  category: string;
  confidence: number;
  priority: string;
  department: string;
  sla_hours: number;
  requires_human_review: boolean;
  key_risk_factors: string[];
  model_version: string;
}

const PRESET_QUERIES = [
  {
    label: '⚡ High-Voltage Cable Sparking',
    title: 'High voltage electrical wire sparking after thunderstorm',
    description: 'Multiple live high-tension cables snapped and touching water ponding near Sector 12 school gate.',
    hint: 'Power Utilities',
  },
  {
    label: '🚰 Raw Sewage Hospital Overflow',
    title: 'Sewage main line burst flooding medical clinic access',
    description: 'Black wastewater overflowing from broken manhole cap directly into clinic entrance, severe biohazard odor.',
    hint: 'Sanitation',
  },
  {
    label: '🕳️ Highway Sinkhole Collapse',
    title: 'Deep 2-meter sinkhole collapsed on expressway bypass',
    description: 'Road surface caved in suddenly on national highway fast lane, trucks swerving into median barrier.',
    hint: 'Highways',
  },
  {
    label: '📱 Mobile Phone Stolen at Bus Stand',
    title: 'Mobile phone stolen at bus stand during rush hour',
    description: 'Victim reported smartphone snatched while boarding city bus near Kakinada central bus stand.',
    hint: 'Police / Law Enforcement',
  },
];

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'PS-2026-001',
    dateTime: '24 Oct 10:24',
    summary: 'Mobile phone stolen at bus stand',
    category: 'Theft',
    status: 'Action Required',
    risk: 'High',
    department: 'Law Enforcement',
    confidence: 0.94,
  },
  {
    id: 'PS-2026-002',
    dateTime: '24 Oct 09:11',
    summary: 'Suspicious person near school',
    category: 'Suspicious Activity',
    status: 'Under Review',
    risk: 'Medium',
    department: 'Public Safety',
    confidence: 0.88,
  },
  {
    id: 'PS-2026-003',
    dateTime: '23 Oct 18:45',
    summary: 'Street light not working',
    category: 'Civic Issue',
    status: 'Resolved',
    risk: 'Low',
    department: 'Municipal Corporation',
    confidence: 0.98,
  },
  {
    id: 'PS-2026-004',
    dateTime: '23 Oct 15:30',
    summary: 'Unauthorized construction blocking water drainage',
    category: 'Encroachment',
    status: 'Action Required',
    risk: 'Medium',
    department: 'Urban Development',
    confidence: 0.91,
  },
  {
    id: 'PS-2026-005',
    dateTime: '22 Oct 20:15',
    summary: 'Cyber fraud phishing SMS reported by senior citizen',
    category: 'Cybercrime',
    status: 'Under Review',
    risk: 'High',
    department: 'Cyber Crime Cell',
    confidence: 0.96,
  },
];

const CATEGORY_STATS = [
  { name: 'Theft', count: 312, pct: 25, color: '#3B82F6' },
  { name: 'Harassment', count: 260, pct: 21, color: '#6366F1' },
  { name: 'Cybercrime', count: 198, pct: 16, color: '#8B5CF6' },
  { name: 'Violence', count: 176, pct: 14, color: '#EC4899' },
  { name: 'Missing Person', count: 152, pct: 12, color: '#F59E0B' },
  { name: 'Others', count: 150, pct: 12, color: '#64748B' },
];

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Modal / Triage Form States
  const [complaintText, setComplaintText] = useState('High voltage electrical wire sparking after thunderstorm');
  const [description, setDescription] = useState(
    'Multiple live high-tension cables snapped and touching water ponding near Sector 12 school gate.'
  );
  const [departmentHint, setDepartmentHint] = useState('Power Utilities');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim() && !description.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setIsDispatched(false);

    try {
      const response = await api.request<ClassificationResult>('/complaints/classify', {
        method: 'POST',
        body: JSON.stringify({
          title: complaintText,
          description: description,
          department_hint: departmentHint || undefined,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Failed to classify complaint.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while contacting classification engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAndAdd = () => {
    if (!result) return;
    const newId = `PS-2026-00${complaints.length + 1}`;
    const newComplaint: ComplaintItem = {
      id: newId,
      dateTime: 'Just now',
      summary: complaintText,
      category: result.category,
      status: 'Action Required',
      risk: result.priority === 'Urgent' || result.priority === 'High' ? 'High' : result.priority === 'Medium' ? 'Medium' : 'Low',
      department: result.department,
      confidence: result.confidence,
    };
    setComplaints([newComplaint, ...complaints]);
    setIsDispatched(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setResult(null);
      setIsDispatched(false);
    }, 1200);
  };

  const loadPreset = (preset: (typeof PRESET_QUERIES)[0]) => {
    setComplaintText(preset.title);
    setDescription(preset.description);
    setDepartmentHint(preset.hint);
    setResult(null);
    setIsDispatched(false);
  };

  const getStatusBadge = (status: ComplaintItem['status']) => {
    switch (status) {
      case 'Action Required':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getRiskBadge = (risk: ComplaintItem['risk']) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800 font-semibold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 font-medium';
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 font-medium';
    }
  };

  const getCategoryColor = (cat: string) => {
    const item = CATEGORY_STATS.find((c) => c.name.toLowerCase() === cat.toLowerCase());
    return item ? item.color : '#3B82F6';
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complaint Classification</h1>
          <p className="text-sm text-slate-500 mt-0.5">Submit, classify and manage public complaints with AI</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Total Complaints</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">1,248</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <span>↑ 12%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Action Required</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">368</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 mt-1">
              <span>↑ 8%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Under Review</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">214</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 mt-1">
              <span>↓ 5%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Resolved</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">666</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <span>↑ 15%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 2: Complaints by Category & 7-Day Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints by Category (Donut Chart) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Complaints by Category</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="15" />
                {/* Segments: 25%, 21%, 16%, 14%, 12%, 12% -> circumference = 2 * PI * 38 ≈ 238.76 */}
                {/* Theft 25% (59.7) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="15"
                  strokeDasharray="59.7 179"
                  strokeDashoffset="0"
                />
                {/* Harassment 21% (50.1) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="15"
                  strokeDasharray="50.1 188.6"
                  strokeDashoffset="-59.7"
                />
                {/* Cybercrime 16% (38.2) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="15"
                  strokeDasharray="38.2 200.5"
                  strokeDashoffset="-109.8"
                />
                {/* Violence 14% (33.4) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="15"
                  strokeDasharray="33.4 205.3"
                  strokeDashoffset="-148"
                />
                {/* Missing Person 12% (28.6) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="15"
                  strokeDasharray="28.6 210.1"
                  strokeDashoffset="-181.4"
                />
                {/* Others 12% (28.6) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="15"
                  strokeDasharray="28.6 210.1"
                  strokeDashoffset="-210"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900 leading-tight">1,248</span>
                <span className="text-[11px] font-medium text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs text-xs">
              {CATEGORY_STATS.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {item.count} <span className="text-slate-400 font-normal">({item.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complaint Trend (Last 7 Days) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Complaint Trend (Last 7 Days)</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              14.8% ↑
            </span>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="relative w-full h-48 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Y Axis Grid lines */}
              <line x1="30" y1="20" x2="390" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="55" x2="390" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="90" x2="390" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
              <text x="5" y="24" className="text-[9px] fill-slate-400 font-mono">80</text>
              <text x="5" y="59" className="text-[9px] fill-slate-400 font-mono">60</text>
              <text x="5" y="94" className="text-[9px] fill-slate-400 font-mono">40</text>

              {/* Area */}
              <path
                d="M 40 95 Q 90 85, 140 70 T 240 85 T 320 40 T 385 25 L 385 110 L 40 110 Z"
                fill="url(#trendGradient)"
              />
              {/* Line */}
              <path
                d="M 40 95 Q 90 85, 140 70 T 240 85 T 320 40 T 385 25"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Points */}
              {[[40, 95], [95, 84], [150, 72], [210, 80], [270, 74], [325, 42], [385, 25]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
              ))}
            </svg>

            {/* X Axis Dates */}
            <div className="flex justify-between text-[11px] font-medium text-slate-400 pt-3 px-3">
              <span>Oct 24</span>
              <span>Oct 25</span>
              <span>Oct 26</span>
              <span>Oct 27</span>
              <span>Oct 28</span>
              <span>Oct 29</span>
              <span>Oct 30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Complaints</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            + File New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Case ID</th>
                <th className="py-3 px-6">Date & Time</th>
                <th className="py-3 px-6">Complaint Summary</th>
                <th className="py-3 px-6">AI Category</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Risk</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-semibold text-slate-900">{item.id}</td>
                  <td className="py-3.5 px-6 text-slate-500">{item.dateTime}</td>
                  <td className="py-3.5 px-6 text-slate-900 font-medium max-w-xs truncate">{item.summary}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: getCategoryColor(item.category) }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${getRiskBadge(item.risk)}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{selectedComplaint.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedComplaint.summary}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported At</span>
                  <span className="text-slate-800 font-semibold">{selectedComplaint.dateTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                  <span className="text-slate-800 font-semibold">{selectedComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Status</span>
                  <span className="text-slate-800 font-semibold">{selectedComplaint.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Routing Dept</span>
                  <span className="text-slate-800 font-semibold">{selectedComplaint.department || 'Law Enforcement'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal (AI Classifier & Triage) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">New Public Complaint</h3>
                  <p className="text-xs text-slate-500">Submit and triage with AI classification pipeline</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setResult(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Quick Test Scenarios:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors text-slate-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleClassify} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile phone stolen at bus stand..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Grievance Narrative
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed facts, incident location, and circumstances..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Routing Hint (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Police, Municipal Corporation, Public Safety"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={departmentHint}
                  onChange={(e) => setDepartmentHint(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Classifying...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run AI Classification</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* AI Result Card */}
            {result && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Category Prediction</span>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{result.category}</div>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full border bg-red-50 text-red-700 border-red-200 font-semibold">
                    {result.priority} Priority
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Confidence Score</span>
                    <span className="font-mono font-bold text-blue-600">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, result.confidence * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Routed Department</span>
                      <span className="text-xs font-semibold text-slate-800">{result.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Target SLA</span>
                      <span className="text-xs font-semibold text-slate-800">{result.sla_hours} Hours</span>
                    </div>
                  </div>
                </div>

                {isDispatched ? (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Complaint added to dashboard and dispatched!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApproveAndAdd}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors mt-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Add to Dashboard</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
