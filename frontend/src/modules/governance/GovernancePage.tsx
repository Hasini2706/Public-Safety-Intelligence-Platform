import React, { useState } from 'react';
import {
  Scale,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
  Plus,
  Calendar,
  MoreVertical,
  Play,
  ArrowRight,
  FileText,
  X,
  Check,
  Edit3,
} from 'lucide-react';

interface ComplaintCase {
  id: string;
  date: string;
  dateTime: string;
  summary: string;
  fullDetails: string;
  classification: string;
  confidence: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  threatScore: number;
  status: 'Action Required' | 'Pending Review' | 'No Action Required';
  whyActionRequired: string[];
  evidenceImages: number;
  hasVideo: boolean;
  notes?: string[];
}

const INITIAL_CASES: ComplaintCase[] = [
  {
    id: 'PS-2026-001',
    date: '24 Oct 2026',
    dateTime: '24 Oct 2026, 10:24 AM',
    summary: 'Theft of mobile phone at bus stand',
    fullDetails: 'Mobile phone stolen at bus stand. Suspect seen running towards main road.',
    classification: 'Theft',
    confidence: 92,
    riskLevel: 'High',
    threatScore: 0.87,
    status: 'Action Required',
    evidenceImages: 1,
    hasVideo: true,
    whyActionRequired: [
      'Credible indication of a safety risk',
      'Serious allegation requiring investigation',
      'Missing property and suspect information',
      'Requires follow-up and police investigation',
    ],
  },
  {
    id: 'PS-2026-002',
    date: '24 Oct 2026',
    dateTime: '24 Oct 2026, 09:15 AM',
    summary: 'Suspicious person near school',
    fullDetails: 'Unidentified adult observed loitering near school boundary wall during morning entry hours.',
    classification: 'Suspicious Activity',
    confidence: 88,
    riskLevel: 'Medium',
    threatScore: 0.64,
    status: 'Pending Review',
    evidenceImages: 2,
    hasVideo: false,
    whyActionRequired: [
      'Proximity to vulnerable public school zone',
      'Requires patrol unit verification and interview',
      'Awaiting officer field assessment',
    ],
  },
  {
    id: 'PS-2026-003',
    date: '23 Oct 2026',
    dateTime: '23 Oct 2026, 08:40 PM',
    summary: 'Street light not working',
    fullDetails: 'Street lighting pole #42 dark on municipal roadway corridor; scheduled for city power repair.',
    classification: 'Civic Issue',
    confidence: 96,
    riskLevel: 'Low',
    threatScore: 0.18,
    status: 'No Action Required',
    evidenceImages: 1,
    hasVideo: false,
    whyActionRequired: [
      'Non-criminal civil infrastructure concern',
      'Automated referral routed to Municipal Electrical Dept',
    ],
  },
  {
    id: 'PS-2026-004',
    date: '23 Oct 2026',
    dateTime: '23 Oct 2026, 02:10 PM',
    summary: 'Harassment complaint in college',
    fullDetails: 'Female student reported verbal intimidation and stalker harassment near campus library.',
    classification: 'Harassment',
    confidence: 94,
    riskLevel: 'High',
    threatScore: 0.82,
    status: 'Action Required',
    evidenceImages: 2,
    hasVideo: true,
    whyActionRequired: [
      'Immediate student safety and protection protocol',
      'Formal campus police report initiated',
      'Security video review pending',
    ],
  },
  {
    id: 'PS-2026-005',
    date: '22 Oct 2026',
    dateTime: '22 Oct 2026, 11:30 PM',
    summary: 'Noise pollution from event',
    fullDetails: 'Commercial venue played loud music beyond permitted 10 PM curfew; sound permit checked.',
    classification: 'Public Nuisance',
    confidence: 91,
    riskLevel: 'Low',
    threatScore: 0.22,
    status: 'No Action Required',
    evidenceImages: 0,
    hasVideo: false,
    whyActionRequired: [
      'First-time sound decibel excess warning issued',
      'Sound equipment volume adjusted by event organizer',
    ],
  },
  {
    id: 'PS-2026-006',
    date: '22 Oct 2026',
    dateTime: '22 Oct 2026, 04:15 PM',
    summary: 'Duplicate complaint (same as PS-2026-011)',
    fullDetails: 'Report matched existing open case PS-2026-011 regarding minor traffic accident.',
    classification: 'Duplicate',
    confidence: 99,
    riskLevel: 'Low',
    threatScore: 0.05,
    status: 'No Action Required',
    evidenceImages: 0,
    hasVideo: false,
    whyActionRequired: [
      'Merged into primary investigation case PS-2026-011',
      'No duplicate police allocation needed',
    ],
  },
  {
    id: 'PS-2026-007',
    date: '21 Oct 2026',
    dateTime: '21 Oct 2026, 06:50 PM',
    summary: 'Threat message received online',
    fullDetails: 'Aggressive extortion and physical harm threat received via encrypted messaging service.',
    classification: 'Cyber Threat',
    confidence: 95,
    riskLevel: 'High',
    threatScore: 0.89,
    status: 'Action Required',
    evidenceImages: 2,
    hasVideo: false,
    whyActionRequired: [
      'Direct safety threat requiring digital forensics trace',
      'Cybercrime division dispatch notification active',
    ],
  },
  {
    id: 'PS-2026-008',
    date: '21 Oct 2026',
    dateTime: '21 Oct 2026, 01:25 PM',
    summary: 'Unclear information, needs verification',
    fullDetails: 'Incomplete witness statement submitted without contact details or precise scene location.',
    classification: 'Other',
    confidence: 67,
    riskLevel: 'Medium',
    threatScore: 0.52,
    status: 'Pending Review',
    evidenceImages: 1,
    hasVideo: false,
    whyActionRequired: [
      'Insufficient preliminary metadata for categorization',
      'Manual officer interview needed to corroborate statement',
    ],
  },
];

const AUDIT_ACTIVITIES = [
  {
    timestamp: '24 Oct 2026, 11:20 AM',
    action: 'Status changed to Action Required',
    officer: 'Officer: R. Kumar',
  },
  {
    timestamp: '24 Oct 2026, 10:45 AM',
    action: 'Evidence added (CCTV image)',
    officer: 'Officer: R. Kumar',
  },
  {
    timestamp: '23 Oct 2026, 04:12 PM',
    action: 'Marked as No Action Required',
    officer: 'Officer: S. Devi',
  },
  {
    timestamp: '23 Oct 2026, 11:30 AM',
    action: 'Case assigned for review',
    officer: 'Officer: A. Khan',
  },
];

export const GovernancePage: React.FC = () => {
  const [cases, setCases] = useState<ComplaintCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('PS-2026-001');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [riskFilter, setRiskFilter] = useState<string>('All Risk Levels');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');

  // Modal states
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  // Form states
  const [newSummary, setNewSummary] = useState('');
  const [newClassification, setNewClassification] = useState('Theft');
  const [newRisk, setNewRisk] = useState<'High' | 'Medium' | 'Low'>('High');
  const [officerNoteText, setOfficerNoteText] = useState('');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Filter complaints
  const filteredCases = cases.filter((c) => {
    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All Categories' && c.classification !== categoryFilter) return false;
    if (riskFilter !== 'All Risk Levels' && c.riskLevel !== riskFilter) return false;
    return true;
  });

  const handleUpdateStatus = (newStatus: 'Action Required' | 'Pending Review' | 'No Action Required') => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: newStatus } : c))
    );
    setIsUpdateStatusOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNoteText.trim()) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, notes: [...(c.notes || []), officerNoteText.trim()] }
          : c
      )
    );
    setOfficerNoteText('');
    setIsAddNoteOpen(false);
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    const newId = `PS-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCaseItem: ComplaintCase = {
      id: newId,
      date: '25 Oct 2026',
      dateTime: '25 Oct 2026, 10:00 AM',
      summary: newSummary.trim(),
      fullDetails: newSummary.trim(),
      classification: newClassification,
      confidence: 90,
      riskLevel: newRisk,
      threatScore: newRisk === 'High' ? 0.85 : newRisk === 'Medium' ? 0.55 : 0.2,
      status: 'Action Required',
      evidenceImages: 1,
      hasVideo: false,
      whyActionRequired: [
        'Newly filed citizen complaint awaiting full detective triage',
        'Credible initial safety indicators flagged by intake pipeline',
      ],
    };
    setCases([newCaseItem, ...cases]);
    setSelectedCaseId(newId);
    setNewSummary('');
    setIsNewComplaintOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Banner matching Photo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Governance <span className="text-amber-500 font-serif italic">& Compliance</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ensure fair, transparent and accountable use of AI in public safety.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Golden Scales of Justice graphic */}
            <div className="hidden lg:flex items-center justify-center text-amber-500">
              <Scale className="w-10 h-10 stroke-[1.8]" />
            </div>

            {/* Responsible AI Shield Badge */}
            <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-300/80 rounded-xl px-4 py-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-amber-950">Responsible AI.</p>
                <p className="text-[11px] text-amber-800 font-medium">Safer Communities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric / KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">128</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Total Complaints</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600">↑ +12%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">This month</p>
            </div>
          </div>

          {/* Card 2: Action Required */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">42</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Action Required</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-red-600">↑ +8%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Needs attention</p>
            </div>
          </div>

          {/* Card 3: No Action Required */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">56</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">No Action Required</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600">↑ +15%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Closed/Resolved</p>
            </div>
          </div>

          {/* Card 4: Pending Review */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">30</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Pending Review</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-600">↓ -5%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Awaiting review</p>
            </div>
          </div>
        </div>

        {/* Main Content: Left Complaints Table & Right Case Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table Section (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            {/* Header: Title + New Complaint Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Complaint Oversight</h2>
                  <p className="text-xs text-slate-500">
                    Review AI classifications, evidence and officer decisions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewComplaintOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Complaint</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-1 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Action Required">Action Required</option>
                <option value="Pending Review">Pending Review</option>
                <option value="No Action Required">No Action Required</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Theft">Theft</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Civic Issue">Civic Issue</option>
                <option value="Harassment">Harassment</option>
                <option value="Public Nuisance">Public Nuisance</option>
                <option value="Duplicate">Duplicate</option>
                <option value="Cyber Threat">Cyber Threat</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Risk Levels">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Locations">All Locations</option>
                <option value="Downtown">Downtown Sector 1</option>
                <option value="Industrial">Sector 4 Industrial</option>
                <option value="Campus">North Campus</option>
              </select>

              <button
                type="button"
                className="col-span-2 sm:col-span-4 lg:col-span-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Select Date Range</span>
              </button>
            </div>

            {/* Complaints Table */}
            <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                    <th className="py-3 px-3.5">Case ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Complaint Summary</th>
                    <th className="py-3 px-3">AI Classification</th>
                    <th className="py-3 px-3">Risk Level</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((item) => {
                    const isSelected = item.id === selectedCase.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedCaseId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-50/40 font-medium'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3.5 px-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-3 text-slate-800 max-w-[200px] truncate">
                          {item.summary}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {item.classification}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.riskLevel === 'High'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : item.riskLevel === 'Medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.status === 'Action Required'
                                ? 'bg-red-50 text-red-700 border border-red-300'
                                : item.status === 'Pending Review'
                                ? 'bg-amber-50 text-amber-700 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseId(item.id);
                              setIsUpdateStatusOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
              <span>Showing 1 - {filteredCases.length} of 128 complaints</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-2xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  5
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  16
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Case Details Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            {/* Header: Case Details + View Full Report */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Case Details</h3>
              <button
                type="button"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Case ID and Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Case ID</span>
                <span className="text-sm font-mono font-bold text-slate-900">{selectedCase.id}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedCase.status === 'Action Required'
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : selectedCase.status === 'Pending Review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}
              >
                {selectedCase.status}
              </span>
            </div>

            {/* Date & Time */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Date & Time</span>
              <span className="text-xs font-medium text-slate-800">{selectedCase.dateTime}</span>
            </div>

            {/* Complaint Details */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Complaint Details
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedCase.fullDetails}
              </p>
            </div>

            {/* AI Classification & Risk Level Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  AI Classification
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                    {selectedCase.classification}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    {selectedCase.confidence}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Risk Level
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedCase.riskLevel === 'High'
                        ? 'bg-red-100 text-red-800'
                        : selectedCase.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedCase.riskLevel}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    Score: {selectedCase.threatScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Thumbnails */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Evidence
              </span>
              <div className="flex items-center gap-2">
                {/* Photo 1: Scene Thumbnail */}
                <div className="w-16 h-12 rounded-lg bg-slate-800 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-mono">
                    Scene
                  </div>
                </div>

                {/* Photo 2: CCTV Video Thumbnail with Play Button */}
                <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden relative flex items-center justify-center group cursor-pointer">
                  <div className="w-full h-full bg-gradient-to-tr from-blue-950 to-slate-800 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Item 3: +2 more files */}
                <div className="w-16 h-12 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors">
                  <FileText className="w-3.5 h-3.5 mb-0.5 text-slate-400" />
                  <span className="text-[10px] font-semibold text-slate-600">+2 more</span>
                </div>
              </div>
            </div>

            {/* Why Action Required Callout Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Why Action Required?</span>
              </div>
              <ul className="space-y-1 text-[11px] text-amber-900/90 pl-1">
                {selectedCase.whyActionRequired.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes if any */}
            {selectedCase.notes && selectedCase.notes.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Officer Notes</span>
                {selectedCase.notes.map((n, i) => (
                  <p key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                    {n}
                  </p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUpdateStatusOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddNoteOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                <span>Add Officer Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Audit Activity (Note: AI Governance Controls and Compliance & Audit removed as requested) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Audit Activity</h3>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {AUDIT_ACTIVITIES.map((act, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1 text-xs"
              >
                <span className="text-[10px] text-slate-400 font-mono block">{act.timestamp}</span>
                <p className="font-semibold text-slate-800 leading-snug">{act.action}</p>
                <span className="text-[11px] text-slate-500 block">{act.officer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: New Complaint */}
      {isNewComplaintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">File New Citizen Complaint</h3>
              <button
                type="button"
                onClick={() => setIsNewComplaintOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Complaint Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details of the citizen grievance or incident..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">AI Classification</label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
                    <option value="Civic Issue">Civic Issue</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Cyber Threat">Cyber Threat</option>
                    <option value="Public Nuisance">Public Nuisance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Level</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewComplaintOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-2xs"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {isUpdateStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update Case Status</h3>
              <button
                type="button"
                onClick={() => setIsUpdateStatusOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the new governance status for case{' '}
              <strong className="text-slate-900 font-mono">{selectedCase.id}</strong>:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus('Action Required')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-800 text-xs font-bold transition-colors"
              >
                <span>Action Required</span>
                {selectedCase.status === 'Action Required' && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('Pending Review')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-xs font-bold transition-colors"
              >
                <span>Pending Review</span>
                {selectedCase.status === 'Pending Review' && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('No Action Required')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold transition-colors"
              >
                <span>No Action Required</span>
                {selectedCase.status === 'No Action Required' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Officer Note */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Officer Case Note</h3>
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
              <p className="text-slate-600">
                Attach an operational or evidentiary note to case{' '}
                <strong className="text-slate-900 font-mono">{selectedCase.id}</strong>:
              </p>

              <textarea
                rows={3}
                required
                placeholder="Enter officer notes or investigation instructions..."
                value={officerNoteText}
                onChange={(e) => setOfficerNoteText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-2xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
