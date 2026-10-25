import React, { useState } from 'react';
import {
  Folder,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Plus,
  FileText,
  User,
  Package,
  Camera,
  Search,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

interface EvidenceItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
}

const SAMPLE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-1',
    name: 'bus_stand_cam1.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ev-2',
    name: 'suspect_clothes.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ev-3',
    name: 'phone_receipt.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
  },
];

const SIMILAR_CASES = [
  { id: 'PS-2025-118', title: 'Mobile theft at bus stand', match: 82 },
  { id: 'PS-2025-016', title: 'Snatching near market', match: 74 },
  { id: 'PS-2025-041', title: 'Theft at railway station', match: 71 },
];

export const CrimeAnalysisPage: React.FC = () => {
  const [evidenceTab, setEvidenceTab] = useState<'images' | 'videos' | 'documents'>('images');
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

  // New Case Intake Form
  const [caseTitle, setCaseTitle] = useState('Mobile phone stolen at bus stand');
  const [caseNarrative, setCaseNarrative] = useState(
    'Mobile phone stolen at bus stand. Suspect seen running towards main road.'
  );
  const [caseLocation, setCaseLocation] = useState('Bus stand, Kakinada');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      await api.request<any>('/crime-analysis/correlate', {
        method: 'POST',
        body: JSON.stringify({
          incident_id: 'PS-2026-002',
          location: caseLocation,
          narrative: caseNarrative,
          evidence_tags: ['surveillance_match', 'weapon_recovered'],
        }),
      });
    } catch {
      // Fallback
    } finally {
      setIsAnalyzing(false);
      setIsNewCaseOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crime Scene Evidence Analysis</h1>
          <p className="text-sm text-slate-500 mt-0.5">Analyze evidence, identify patterns and assess incident risk</p>
        </div>
        <button
          onClick={() => setIsNewCaseOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Total Cases</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">482</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <span>↑ 14%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Folder className="w-6 h-6" />
          </div>
        </div>

        {/* Evidence Analyzed */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Evidence Analyzed</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">1,320</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <span>↑ 23%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* High Risk Cases */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">High Risk Cases</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">68</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 mt-1">
              <span>↑ 6%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Patterns Identified */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Patterns Identified</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">24</div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <span>↑ 18%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row: 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Case Details */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Case Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900">PS-2026-001</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Under Investigation
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incident Type</span>
                <span className="font-semibold text-slate-800">Theft</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date & Time</span>
                <span className="font-medium text-slate-700">24 Oct 2026, 07:30 PM</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                <span className="font-medium text-slate-700">Bus stand, Kakinada</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Description</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Mobile phone stolen at bus stand. Suspect seen running towards main road.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  AI Risk Assessment
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                  High Risk (0.87)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                <span className="font-semibold text-slate-800">Under Investigation</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned To</span>
                <span className="font-semibold text-slate-800">Inspector R. Kumar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Evidence Analysis */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Evidence Analysis</h2>

            {/* Media Sub-tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs">
              <button
                onClick={() => setEvidenceTab('images')}
                className={`pb-2 font-semibold transition-colors relative ${
                  evidenceTab === 'images'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Images (3)
              </button>
              <button
                onClick={() => setEvidenceTab('videos')}
                className={`pb-2 font-semibold transition-colors relative ${
                  evidenceTab === 'videos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Videos (1)
              </button>
              <button
                onClick={() => setEvidenceTab('documents')}
                className={`pb-2 font-semibold transition-colors relative ${
                  evidenceTab === 'documents'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Documents (2)
              </button>
            </div>

            {/* Thumbnails Gallery */}
            <div className="grid grid-cols-4 gap-2.5">
              {SAMPLE_EVIDENCE.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex flex-col group cursor-pointer"
                >
                  <div className="h-16 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="p-1 text-[9px] font-mono text-slate-600 truncate block bg-white">
                    {item.name}
                  </span>
                </div>
              ))}
              <div className="border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 cursor-pointer">
                <Plus className="w-4 h-4 text-slate-400 mb-0.5" />
                <span className="text-[10px] font-medium text-slate-500">Upload More</span>
              </div>
            </div>

            {/* AI Analysis Results Breakdown */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-900 block mb-2">AI Analysis Results</span>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium text-slate-700">Person Detection</span>
                </div>
                <span className="text-slate-800 font-semibold">1 person detected (confidence: 92%)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium text-slate-700">Object Detection</span>
                </div>
                <span className="text-slate-800 font-semibold">Mobile phone, backpack (confidence: 88%)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-medium text-slate-700">Scene Analysis</span>
                </div>
                <span className="text-slate-800 font-semibold">Bus stand environment, evening time</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-medium text-slate-700">Text Extraction</span>
                </div>
                <span className="text-slate-800 font-semibold">Phone receipt details detected</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Face Similarity</span>
                </div>
                <span className="text-slate-800 font-semibold">Possible match in database (72%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Incident Risk Assessment & Similar Cases */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Incident Risk Assessment Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Incident Risk Assessment</h2>

            <div className="flex items-center gap-6 mb-4">
              {/* Circular Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="12"
                    strokeDasharray="208 238"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-slate-900">0.87</span>
                  <span className="text-[9px] font-bold text-red-600 uppercase">High Risk</span>
                </div>
              </div>

              {/* Factors */}
              <div className="flex-1 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Severity of crime</span>
                  <span className="font-bold text-red-600">0.9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location risk</span>
                  <span className="font-bold text-orange-600">0.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Time of incident</span>
                  <span className="font-bold text-amber-600">0.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Victim vulnerability</span>
                  <span className="font-bold text-amber-600">0.6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Repeat incidents</span>
                  <span className="font-bold text-amber-600">0.6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Cases Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Similar Cases</h2>
              <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                View All →
              </span>
            </div>

            <div className="space-y-2.5">
              {SIMILAR_CASES.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 block">{item.id}</span>
                    <span className="text-xs font-medium text-slate-800">{item.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.match}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Case Intake Modal */}
      {isNewCaseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Register New Investigation Case</h3>
              <button
                onClick={() => setIsNewCaseOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crime Location</label>
                <input
                  type="text"
                  required
                  value={caseLocation}
                  onChange={(e) => setCaseLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Narrative & Clues</label>
                <textarea
                  rows={3}
                  required
                  value={caseNarrative}
                  onChange={(e) => setCaseNarrative(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCaseOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Correlating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
