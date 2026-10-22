import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCard } from '../../components/common/AlertCard';
import { MessageSquareText, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';

export const ComplaintsPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'complaints')!;
  const [complaintText, setComplaintText] = useState('');
  const [departmentHint, setDepartmentHint] = useState('');
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
        {/* Module Workflow Overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Target ML Pipeline Architecture
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

        {/* Developer Branch Notice */}
        <AlertCard
          type="info"
          title="Module Foundation Ready (Member 1)"
          message={`This UI is the standardized shell for 'feature/complaints'. The NLP classifier pipeline should be developed in ml/complaints/ and connected to backend/app/modules/complaints/service.py.`}
        />

        {/* Two column layout: Input Console & Prediction Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-blue-600" />
                <span>Citizen Grievance Input</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">POST /api/v1/complaints/classify</span>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Complaint Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hazardous open pothole causing traffic risk"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Citizen Grievance Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter full text of the citizen complaint or incident report..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={departmentHint}
                  onChange={(e) => setDepartmentHint(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setComplaintText('High voltage electrical wire sparking after thunderstorm');
                    setDepartmentHint('Multiple exposed lines touching water ponding near Sector 12 public school gate.');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Load Sample Query
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Pipeline Preview</span>
                </button>
              </div>
            </form>
          </div>

          {/* Prediction / Results Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Model Prediction & Triage Output
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Model Unconfigured
                </span>
              </div>

              {!hasEvaluated ? (
                <EmptyState
                  title="Awaiting Input Evaluation"
                  description="Submit a complaint text or load a sample query to inspect the classification contract."
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Contract Verification:</span>
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> API Connected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Predicted Category</span>
                        <span className="font-mono text-slate-800 font-medium">Pending ML Model</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Confidence Score</span>
                        <span className="font-mono text-slate-800 font-medium">--%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Calculated Priority</span>
                        <span className="font-mono text-slate-800 font-medium">--</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Review Required</span>
                        <span className="font-mono text-emerald-700 font-medium">Mandatory (Human)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800">
                    <p className="font-semibold mb-1">Developer Implementation Checklist:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-700 text-[11px]">
                      <li>Prepare NLP model in <code className="font-mono">ml/complaints/</code></li>
                      <li>Update <code className="font-mono">backend/app/modules/complaints/service.py</code></li>
                      <li>Do not commit large model weights directly to Git</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Responsible AI Note: Citizen complaint classifications must include human oversight prior to enforcement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
