import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { ArrowRight, Play, ShieldAlert, FileText } from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';

export const CrimeAnalysisPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'crime-analysis')!;
  const [incidentId, setIncidentId] = useState('INC-2026-X892');
  const [narrative, setNarrative] = useState(
    'Commercial burglary reported at warehouse facility during night hours. Motion alarm tripped on north dock.'
  );
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
            Target Evidence Triage & Risk Correlation Pipeline
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

        {/* Responsible AI Disclaimer Alert */}
        <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-950">Ethical & Judicial Disclaimer:</span>
            <p className="text-rose-800 leading-relaxed">
              Automated analytical outputs are structured investigative decision-support cues for certified law
              enforcement investigators. Under no circumstances do algorithmic scores determine guilt, legal liability,
              probable cause, or criminal responsibility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Incident Case Narrative & Evidence Tags</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">POST /api/v1/crime-analysis/analyze</span>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Incident Case File ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={incidentId}
                  onChange={(e) => setIncidentId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Case Narrative / Physical Evidence Log
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <span className="font-semibold text-slate-700">Simulated Evidence Metadata:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-mono">
                    #forced_entry
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-mono">
                    #night_hours
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-mono">
                    #industrial_zone
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Synthetic crime report</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Assessment Simulation</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Incident Risk Indicators & Pattern Correlation
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Model Unconfigured
                </span>
              </div>

              {!hasEvaluated ? (
                <EmptyState
                  title="Awaiting Evidence Correlation"
                  description="Run the assessment simulation to preview the structured investigator output payload."
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pattern Risk Index</span>
                        <span className="font-mono text-slate-800 font-medium">Pending ML Model</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Corroboration Confidence</span>
                        <span className="font-mono text-slate-800 font-medium">--%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Repeat Modus Operandi</span>
                        <span className="font-mono text-slate-800 font-medium">Awaiting Pipeline</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Investigator Review</span>
                        <span className="font-mono text-emerald-700 font-medium">Primary Directive</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                    <span className="font-semibold block">Member 4 Development Path:</span>
                    <p className="text-[11px] text-slate-600">
                      Build evidence correlation and risk triage models in <code className="font-mono">ml/crime_analysis/</code>.
                      Integrate into <code className="font-mono">backend/app/modules/crime_analysis/service.py</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Judicial Safety: Machine outputs must be corroborated with physical forensics and human judicial review.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
