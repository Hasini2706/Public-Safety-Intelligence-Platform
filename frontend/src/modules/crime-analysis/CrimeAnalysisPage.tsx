import React, { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Play,
  AlertTriangle,
  Sparkles,
  Loader2,
  FileText,
  Tag,
  Crosshair,
  BadgeAlert,
} from 'lucide-react';
import { api } from '../../services/api';

interface CrimeAnalysisResult {
  incident_id: string;
  location: string;
  risk_level: string;
  escalation_score: number;
  corroboration_score: number;
  pattern_indicators: string[];
  corroboration_notes: string[];
  investigator_guidance: string;
  ethical_disclaimer: string;
  model_version: string;
}

const AVAILABLE_EVIDENCE_ITEMS = [
  { id: 'weapon_recovered', label: '🔫 Weapon Recovered' },
  { id: 'ballistic_residue', label: '💥 Ballistic Residue' },
  { id: 'forced_entry', label: '🚪 Forced Entry' },
  { id: 'tool_marks', label: '🔨 Tool Marks' },
  { id: 'dna_sample', label: '🧬 DNA Trace Sample' },
  { id: 'fingerprints_lifted', label: '🖐️ Fingerprints Lifted' },
  { id: 'surveillance_match', label: '📹 CCTV Match' },
  { id: 'vehicle_sighted', label: '🚗 Vehicle Sighted' },
  { id: 'insider_badge_usage', label: '🪪 Insider Badge Exploit' },
  { id: 'cyber_tampering', label: '💻 Cyber Tampering' },
];

const PRESET_INCIDENTS = [
  {
    label: '🚨 Armed Commercial Robbery',
    id: 'INC-2026-X892',
    location: 'Sector 4 Industrial Warehouse',
    narrative: 'Armed suspects brandishing firearms confronted security guards at night loading dock and took high-value electronics.',
    evidence: ['weapon_recovered', 'ballistic_residue', 'forced_entry', 'vehicle_sighted'],
  },
  {
    label: '💼 Night Commercial Safe Cracking',
    id: 'INC-2026-B410',
    location: 'Financial District Sector 1',
    narrative: 'Backdoor lock cylinder pried open and heavy steel safe cut with industrial oxy-acetylene torch during non-operating hours.',
    evidence: ['forced_entry', 'tool_marks', 'insider_badge_usage'],
  },
  {
    label: '⚡ Copper Wiring Infrastructure Theft',
    id: 'INC-2026-M104',
    location: 'Substation Rail Corridor',
    narrative: 'High-voltage copper ground spools stripped and removed from trackside electrical housing over holiday weekend.',
    evidence: ['tool_marks', 'vehicle_sighted'],
  },
  {
    label: '🎨 Retail Storefront Vandalism',
    id: 'INC-2026-V022',
    location: 'Downtown Commercial Plaza',
    narrative: 'Exterior storefront display windows tagged with spray paint and decorative glass panel cracked.',
    evidence: ['surveillance_match'],
  },
];

export const CrimeAnalysisPage: React.FC = () => {
  const [incidentId, setIncidentId] = useState('INC-2026-X892');
  const [location, setLocation] = useState('Sector 4 Industrial Warehouse');
  const [narrative, setNarrative] = useState(
    'Armed suspects brandishing firearms confronted security guards at night loading dock and took high-value electronics.'
  );
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([
    'weapon_recovered',
    'ballistic_residue',
    'forced_entry',
    'vehicle_sighted',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CrimeAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleEvidence = (id: string) => {
    setSelectedEvidence((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!narrative.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.request<CrimeAnalysisResult>('/crime-analysis/analyze', {
        method: 'POST',
        body: JSON.stringify({
          incident_id: incidentId,
          location: location,
          incident_narrative: narrative,
          evidence_items: selectedEvidence,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Evidence correlation analysis failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with crime analysis service.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_INCIDENTS)[0]) => {
    setIncidentId(preset.id);
    setLocation(preset.location);
    setNarrative(preset.narrative);
    setSelectedEvidence(preset.evidence);
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'Elevated':
        return {
          badge: 'bg-red-100 text-red-800 border-red-300',
          barColor: 'bg-red-600',
          card: 'border-red-400 bg-red-50/40',
        };
      case 'Moderate':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          barColor: 'bg-amber-500',
          card: 'border-amber-400 bg-amber-50/40',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          barColor: 'bg-slate-500',
          card: 'border-slate-300 bg-slate-50',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Presets */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Standard Incident Archetypes:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_INCIDENTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors text-slate-700"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Crime Scene Evidence Intake Console</span>
                </h3>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Incident Identifier
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={incidentId}
                      onChange={(e) => setIncidentId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Location / Sector
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    First Responder Narrative / Incident Report
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full narrative of the scene observations..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                  />
                </div>

                {/* Evidence Tags Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    Corroborating Evidence Items (Click to toggle):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_EVIDENCE_ITEMS.map((item) => {
                      const selected = selectedEvidence.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleEvidence(item.id)}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
                            selected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Selected Evidence Factors: {selectedEvidence.length}
                  </span>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Correlating Evidence...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Evidence Correlation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Results Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-blue-600" />
                  <span>Investigative Intelligence Brief</span>
                </h3>
                {/* 1. Model Ready */}
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Model Ready (v1.0.0)
                </span>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Incident Intake"
                  description="Submit an incident narrative and tag evidence items or select a preset archetype above."
                />
              ) : (
                <div className="space-y-4">
                  {/* Risk Level Banner */}
                  <div className={`p-4 rounded-lg border ${getRiskStyle(result.risk_level).card} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BadgeAlert className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-bold text-slate-900">
                          {result.risk_level.toUpperCase()} INCIDENT RISK
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRiskStyle(result.risk_level).badge}`}>
                        {result.incident_id}
                      </span>
                    </div>

                    {/* Gauges Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-2.5 rounded bg-white border border-slate-200">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                          Escalation Risk Score
                        </span>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base font-mono font-bold text-red-700">
                            {(result.escalation_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${getRiskStyle(result.risk_level).barColor}`}
                            style={{ width: `${Math.min(100, Math.max(10, result.escalation_score * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-white border border-slate-200">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                          Corroboration Index
                        </span>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base font-mono font-bold text-blue-700">
                            {(result.corroboration_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(10, result.corroboration_score * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pattern & Modus Operandi Indicators */}
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 block mb-2">
                      Modus Operandi (M.O.) Pattern Indicators:
                    </span>
                    <ul className="space-y-1.5">
                      {result.pattern_indicators.map((pat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{pat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detective Guidance */}
                  <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
                    <span className="font-semibold text-blue-950 block">
                      Lead Investigator Decision-Support Guidance:
                    </span>
                    <p className="text-blue-900 leading-relaxed text-[11px]">
                      {result.investigator_guidance}
                    </p>

                    {result.corroboration_notes.length > 0 && (
                      <div className="pt-2 border-t border-blue-200/60">
                        <span className="font-semibold text-blue-900 block text-[11px] mb-1">
                          Corroborating Evidence Action Steps:
                        </span>
                        <ul className="space-y-1 text-blue-800 text-[11px]">
                          {result.corroboration_notes.map((note, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-600">→</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Response AI */}
            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Responsible AI Note: Crime analysis outputs are probabilistic aids for sworn human investigators. Never proclaim guilt or arrest mandates automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
