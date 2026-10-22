import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCard } from '../../components/common/AlertCard';
import { ArrowRight, Play, Radio } from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';

export const ThreatDetectionPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'threat-detection')!;
  const [zoneId, setZoneId] = useState('DATA-CENTER-ZONE-B');
  const [sensorType, setSensorType] = useState('cctv_motion_badge_reader');
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
            Target Anomaly & Intrusion Detection Pipeline
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
          title="Physical Infrastructure Anomaly Shell (Member 3)"
          message={`Telemetry ingestion and anomaly scoring models will be linked to 'backend/app/modules/threat_detection/service.py'. All values shown are simulation prototypes.`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>Physical Sensor Stream Ingestion</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">POST /api/v1/threat-detection/analyze</span>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Protected Critical Infrastructure Zone
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="DATA-CENTER-ZONE-B">Mainframe Room - Zone B (Tier 4)</option>
                  <option value="UPS-BATTERY-ROOM-01">Power Distribution / UPS Unit 01</option>
                  <option value="NETWORK-OPERATION-CENTER">NOC Operations Perimeter</option>
                  <option value="TELECOM-FIBER-VAULT">Telecom Optical Fiber Vault</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sensor / Telemetry Feed Type
                </label>
                <select
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="cctv_motion_badge_reader">CCTV Motion + Badge Reader Telemetry</option>
                  <option value="infrared_perimeter">Infrared Beam Barrier Sensor</option>
                  <option value="vibration_acoustic">Rack Vibration & Acoustic Sensor</option>
                  <option value="airlock_tailgating">Biometric Airlock Anti-Tailgating System</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <span className="font-semibold text-slate-700">Simulated Raw Event Payload:</span>
                <pre className="font-mono text-[11px] text-slate-600 overflow-x-auto">
{JSON.stringify({ zone: zoneId, sensor: sensorType, timestamp: '2026-10-22T23:55:00Z', badge_event: 'after_hours_entry' }, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Simulation environment</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Evaluate Anomaly Model</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Threat Risk Assessment & SOC Alert Dispatch
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Model Unconfigured
                </span>
              </div>

              {!hasEvaluated ? (
                <EmptyState
                  title="No Ingestion Stream Active"
                  description="Trigger 'Evaluate Anomaly Model' to simulate event triage against the API contract."
                />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Threat Level</span>
                        <span className="font-mono text-slate-800 font-medium">Model Required</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Anomaly Score</span>
                        <span className="font-mono text-slate-800 font-medium">--</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Alarm Dispatch Status</span>
                        <span className="font-mono text-slate-800 font-medium">Standby</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">SOC Verification</span>
                        <span className="font-mono text-slate-800 font-medium">Human Analyst Queue</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                    <span className="font-semibold block">Member 3 Development Path:</span>
                    <p className="text-[11px] text-slate-600">
                      Configure anomaly scoring pipelines (e.g. Isolation Forest, One-Class SVM) in <code className="font-mono">ml/threat_detection/</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Disclaimer: Automated anomaly scores assist SOC security engineers. They do not represent confirmed real-world security breaches.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
