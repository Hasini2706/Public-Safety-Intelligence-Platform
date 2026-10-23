import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import {
  UserCheck,
  Play,
  ShieldAlert,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scan,
  Sparkles,
  Loader2,
  FileBadge,
  User,
} from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';
import { api } from '../../services/api';

interface FeatureBreakdownItem {
  feature: string;
  similarity_pct: number;
  conformance: string;
}

interface VerificationResult {
  match_status: string;
  similarity_score: number;
  confidence_level: string;
  human_review_required: boolean;
  verdict_summary: string;
  match_threshold_used: number;
  liveness_score: number;
  quality_metrics: {
    sharpness_score?: number;
    contrast_ratio?: number;
    overall_quality?: number;
  };
  subject_profile: {
    name?: string;
    role?: string;
    clearance?: string;
  };
  features_breakdown: FeatureBreakdownItem[];
  audit_id: string;
  disclaimer: string;
  model_version: string;
}

const PRESET_IDENTITIES = [
  {
    label: '✅ Verified Employee Match',
    refId: 'REF-ID-98214',
    scenario: 'match',
    desc: 'Authorized Level 4 Data Center Engineer (Sarah Chen)',
  },
  {
    label: '⚠️ Borderline Low-Light Capture',
    refId: 'ID-GOV-2026-981',
    scenario: 'borderline',
    desc: 'Critical Systems Operator with off-angle illumination',
  },
  {
    label: '❌ Impostor Suspect Mismatch',
    refId: 'REF-ID-98214',
    scenario: 'mismatch',
    desc: 'Unregistered probe face attempting restricted clearance',
  },
];

export const IdentityPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'identity')!;
  const [refId, setRefId] = useState('REF-ID-98214');
  const [scenario, setScenario] = useState('match');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.request<VerificationResult>('/identity/verify', {
        method: 'POST',
        body: JSON.stringify({
          reference_id: refId,
          test_scenario: scenario,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with identity service.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_IDENTITIES)[0]) => {
    setRefId(preset.refId);
    setScenario(preset.scenario);
  };

  const getStatusStyle = (status: string) => {
    if (status.includes('Verified')) {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        border: 'border-emerald-500 bg-emerald-50/50',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      };
    }
    if (status.includes('Borderline')) {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        border: 'border-amber-500 bg-amber-50/50',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      };
    }
    return {
      badge: 'bg-red-100 text-red-800 border-red-300',
      border: 'border-red-500 bg-red-50/50',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title={metadata.name}
        description={metadata.description}
        branch={metadata.branch}
        apiStatus="active"
        mlStatus="ready"
        modelVersion="v1.0.0-calibrated"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Responsible AI Notice */}
        <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950">Ethical & Legal Safeguards (Decision-Support Only):</span>
            <p className="text-amber-800 leading-relaxed">
              Biometric similarity metrics are advisory tools for authorized human review officers. Automated scores
              never constitute definitive identity verification or legal proof. Do not upload unauthorized real citizen data.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Standard Test Biometric Pairs:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_IDENTITIES.map((preset, idx) => (
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

        {/* Input Console & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Biometric Verification Console</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  POST /api/v1/identity/verify
                </span>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subject Record / Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Biometric Ingestion Scenario
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                  >
                    <option value="match">Match (High Conformance - ~95% Cosine)</option>
                    <option value="borderline">Borderline (Partial Occlusion / Lighting Shift - ~68%)</option>
                    <option value="mismatch">Mismatch / Impostor Divergence (&lt;50%)</option>
                  </select>
                </div>

                {/* Simulated Photo Cards */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50 relative overflow-hidden">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2 border border-blue-200">
                      <User className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Reference Photo</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{refId}</p>
                    <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800">
                      Enrolled Identity
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50 relative overflow-hidden">
                    <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 border border-indigo-200 relative">
                      <Eye className="w-8 h-8" />
                      <Scan className="w-12 h-12 text-indigo-400 absolute opacity-50 animate-pulse" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Live Probe Capture</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Terminal Cam 01</p>
                    <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800">
                      {scenario.toUpperCase()} TEST
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-[11px] text-slate-400">Decision Threshold: 0.78 Cosine</span>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Comparing Embeddings...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Biometric Comparison</span>
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

          {/* Verification Results Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-blue-600" />
                  <span>Biometric Comparison Report</span>
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Model Ready (v1.0.0)
                </span>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Probe Comparison"
                  description="Choose a reference ID and trigger comparison to inspect biometric spatial embedding similarity."
                />
              ) : (
                <div className="space-y-4">
                  {/* Verdict Status Card */}
                  {(() => {
                    const style = getStatusStyle(result.match_status);
                    return (
                      <div className={`p-4 rounded-lg border-2 ${style.border} space-y-2`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {style.icon}
                            <span className="text-sm font-bold text-slate-900">{result.match_status}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
                            {result.confidence_level} Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{result.verdict_summary}</p>
                      </div>
                    );
                  })()}

                  {/* Similarity Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">
                        Similarity Score
                      </span>
                      <span className="text-lg font-bold font-mono text-blue-700">
                        {(result.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">
                        Threshold Target
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-700">
                        {(result.match_threshold_used * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">
                        Liveness Index
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-700">
                        {(result.liveness_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Profile & Features Table */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 flex justify-between">
                      <span>Biometric Geometric Landmarks</span>
                      <span>Conformance</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {result.features_breakdown.map((item, idx) => (
                        <div key={idx} className="px-3 py-2 flex items-center justify-between bg-white">
                          <span className="text-slate-600">{item.feature}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-slate-900">
                              {item.similarity_pct}%
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                item.conformance === 'Acceptable'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {item.conformance}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Audit Reference: <code className="font-mono text-slate-700">{result.audit_id}</code></span>
                    <span>Review Mandate: {result.human_review_required ? 'Required' : 'Standard'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Responsible AI Note: Biometric verification outputs are advisory cues for trained human verification officers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
