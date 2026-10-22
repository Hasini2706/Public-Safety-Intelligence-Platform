import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { UserCheck, ArrowRight, Play, ShieldAlert, Upload, Eye } from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';

export const IdentityPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'identity')!;
  const [refId, setRefId] = useState('ID-GOV-2026-981');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasEvaluated(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title={metadata.name}
        description={metadata.description}
        branch={metadata.branch}
        apiStatus="active"
        mlStatus="not_configured"
        modelVersion="v0.1.0-uninitialized"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Pipeline Overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Target Biometric Verification Pipeline
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {metadata.workflowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < metadata.workflowSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Responsible AI & Biometric Safeguards Alert */}
        <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950">Ethical & Legal Safeguards (Decision-Support Only):</span>
            <p className="text-amber-800 leading-relaxed">
              Biometric similarity metrics are advisory tools for authorized human review officers. Automated scores
              never constitute definitive identity verification or legal proof. Do not upload or store unauthorized
              real-world citizen biometric data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Verification Intake Console</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">POST /api/v1/identity/verify</span>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Subject Identifier / Reference ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50/50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700">Reference Photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">Official ID Record</p>
                  <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-600">
                    Synthetic Placeholder
                  </span>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center bg-slate-50/50">
                  <Eye className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700">Probe Photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">Live Checkpoint Ingestion</p>
                  <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-600">
                    Synthetic Placeholder
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Synthetic input test preview</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Verification Pipeline</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Facial Match Similarity & Decision Support
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Model Unconfigured
                </span>
              </div>

              {!hasEvaluated ? (
                <EmptyState
                  title="No Verification Run"
                  description="Click 'Test Verification Pipeline' to check the integration contract response."
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Match Assessment</span>
                        <span className="font-mono text-slate-800 font-medium">Pending ML Embeddings</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Cosine Distance</span>
                        <span className="font-mono text-slate-800 font-medium">--</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Similarity Metric</span>
                        <span className="font-mono text-slate-800 font-medium">--%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Human Officer Signoff</span>
                        <span className="font-mono text-blue-700 font-medium">Required by Policy</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 space-y-1">
                    <span className="font-semibold block">Member 2 Next Steps:</span>
                    <p className="text-[11px] text-blue-700">
                      Build computer vision embedding extraction in <code className="font-mono">ml/identity/</code>.
                      Integrate with <code className="font-mono">backend/app/modules/identity/service.py</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Protocol Mandate: Human verification officer retains final signoff responsibility.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
