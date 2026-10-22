import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCard } from '../../components/common/AlertCard';
import { ArrowRight, Play, Gauge } from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';

export const GovernancePage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'governance')!;
  const [mineId, setMineId] = useState('MINE-JH-04 (Underground Shaft 2)');
  const [methaneLevel, setMethaneLevel] = useState(0.8);
  const [dustDensity, setDustDensity] = useState(2.1);
  const [ventilation, setVentilation] = useState(42.5);
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
            Target Regulatory Compliance & Hazardous Condition Pipeline
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

        {/* Developer Info */}
        <AlertCard
          type="info"
          title="Mining Environmental Safety Shell (Member 5)"
          message={`Sensor telemetry validation rules and hazardous trend models will be connected to 'backend/app/modules/governance/service.py'. All values shown are simulation prototypes.`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Mine Telemetry & Inspection Ingestion</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">POST /api/v1/governance/evaluate</span>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mine Site & Shaft Designation
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={mineId}
                  onChange={(e) => setMineId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Methane (CH₄ ppm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={methaneLevel}
                    onChange={(e) => setMethaneLevel(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400">Normal: &lt;1.0 ppm</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Coal Dust (mg/m³)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={dustDensity}
                    onChange={(e) => setDustDensity(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400">Normal: &lt;3.0 mg</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Airflow (m³/s)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={ventilation}
                    onChange={(e) => setVentilation(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400">Req: &gt;35 m³/s</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Sample telemetry test input</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Compliance Audit</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Compliance Report & Violation Indicators
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Model Unconfigured
                </span>
              </div>

              {!hasEvaluated ? (
                <EmptyState
                  title="Awaiting Compliance Evaluation"
                  description="Submit environmental values to test the structured regulatory audit response schema."
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Compliance Status</span>
                        <span className="font-mono text-slate-800 font-medium">Pending ML Evaluation</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Calculated Hazard Index</span>
                        <span className="font-mono text-slate-800 font-medium">--</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Flagged Violations</span>
                        <span className="font-mono text-slate-800 font-medium">0 Flagged</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Safety Inspector Signoff</span>
                        <span className="font-mono text-emerald-700 font-medium">Required for Audit</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                    <span className="font-semibold block">Member 5 Development Path:</span>
                    <p className="text-[11px] text-slate-600">
                      Construct regression/classification algorithms in <code className="font-mono">ml/governance/</code> for early danger trend forecasting.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Safety Advisory: Automated mine monitoring triggers certified physical site inspection protocols.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
