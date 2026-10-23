import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileCheck,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Activity,
  Wind,
  Flame,
  FileDown,
} from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';
import { api } from '../../services/api';

interface ComplianceReportResult {
  mine_site_id: string;
  compliance_status: string;
  hazard_index: number;
  safety_score: number;
  flagged_violations: string[];
  recommended_mitigation: string[];
  inspector_signoff_needed: boolean;
  inspection_urgency: string;
  sensor_telemetry_snapshot: {
    methane_ppm: number;
    dust_mg_m3: number;
    airflow_m3_s: number;
    seismic_g: number;
    inspection_days_ago: number;
  };
  model_version: string;
}

const PRESET_MINE_CONDITIONS = [
  {
    label: '🚨 Critical Methane Evacuation Warning',
    site: 'MINE-JH-04',
    methane: 1.85,
    dust: 3.8,
    airflow: 22.0,
    seismic: 0.045,
    days: 35,
  },
  {
    label: '⚠️ High Combustible Coal Dust',
    site: 'MINE-BOKARO-02',
    methane: 0.95,
    dust: 5.8,
    airflow: 32.0,
    seismic: 0.02,
    days: 18,
  },
  {
    label: '💨 Ventilation Velocity Failure',
    site: 'MINE-SINGRAULI-01',
    methane: 1.1,
    dust: 3.1,
    airflow: 18.5,
    seismic: 0.015,
    days: 12,
  },
  {
    label: '✅ Fully Compliant Extraction',
    site: 'MINE-JH-04',
    methane: 0.45,
    dust: 1.8,
    airflow: 44.0,
    seismic: 0.012,
    days: 8,
  },
];

export const GovernancePage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'governance')!;
  const [mineSiteId, setMineSiteId] = useState('MINE-JH-04');
  const [methaneLevel, setMethaneLevel] = useState(1.85);
  const [dustDensity, setDustDensity] = useState(3.8);
  const [ventilationAirflow, setVentilationAirflow] = useState(22.0);
  const [seismicVibration, setSeismicVibration] = useState(0.045);
  const [inspectionDays, setInspectionDays] = useState(35);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComplianceReportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noticeGenerated, setNoticeGenerated] = useState(false);

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setNoticeGenerated(false);

    try {
      const response = await api.request<ComplianceReportResult>('/governance/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          mine_site_id: mineSiteId,
          methane_level_ppm: methaneLevel,
          dust_density_mg_m3: dustDensity,
          ventilation_airflow_m3_s: ventilationAirflow,
          seismic_vibration_g: seismicVibration,
          last_inspection_days_ago: inspectionDays,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Compliance evaluation failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with mine governance service.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_MINE_CONDITIONS)[0]) => {
    setMineSiteId(preset.site);
    setMethaneLevel(preset.methane);
    setDustDensity(preset.dust);
    setVentilationAirflow(preset.airflow);
    setSeismicVibration(preset.seismic);
    setInspectionDays(preset.days);
    setNoticeGenerated(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Critical Violation':
        return {
          banner: 'bg-red-600 text-white',
          badge: 'bg-red-100 text-red-800 border-red-300',
          scoreText: 'text-red-600',
        };
      case 'Action Required':
        return {
          banner: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          scoreText: 'text-amber-600',
        };
      default:
        return {
          banner: 'bg-emerald-600 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          scoreText: 'text-emerald-600',
        };
    }
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

        {/* Presets */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Atmospheric Sensor Profiles:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MINE_CONDITIONS.map((preset, idx) => (
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
          {/* Telemetry Input Form */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Mine Atmospheric Telemetry Intake</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  POST /api/v1/governance/evaluate
                </span>
              </div>

              <form onSubmit={handleEvaluate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Coal Mine Facility Identifier
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={mineSiteId}
                    onChange={(e) => setMineSiteId(e.target.value)}
                  >
                    <option value="MINE-JH-04">MINE-JH-04 (Jharia Underground Deep Seam)</option>
                    <option value="MINE-BOKARO-02">MINE-BOKARO-02 (Central Incline)</option>
                    <option value="MINE-SINGRAULI-01">MINE-SINGRAULI-01 (Shaft 2)</option>
                  </select>
                </div>

                {/* Sensor Sliders */}
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  {/* Methane */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>Methane Gas (CH4) Concentration</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">{methaneLevel.toFixed(2)} PPM</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.5}
                      step={0.05}
                      value={methaneLevel}
                      onChange={(e) => setMethaneLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>0.1 (Safe)</span>
                      <span className="text-amber-600">1.0 (Statutory Max)</span>
                      <span className="text-red-600">1.5+ (Critical)</span>
                    </div>
                  </div>

                  {/* Dust */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-semibold">Respirable Coal Dust Density</span>
                      <span className="font-mono font-bold text-slate-900">{dustDensity.toFixed(1)} mg/m³</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={8.0}
                      step={0.1}
                      value={dustDensity}
                      onChange={(e) => setDustDensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>0.5 mg/m³</span>
                      <span className="text-amber-600">3.0 mg/m³ Max</span>
                      <span className="text-red-600">5.0+ Explosion Hazard</span>
                    </div>
                  </div>

                  {/* Ventilation */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-blue-600" />
                        <span>Intake Ventilation Airflow Velocity</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">{ventilationAirflow.toFixed(1)} m³/s</span>
                    </div>
                    <input
                      type="range"
                      min={15.0}
                      max={60.0}
                      step={1.0}
                      value={ventilationAirflow}
                      onChange={(e) => setVentilationAirflow(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span className="text-red-600">&lt;20 Deficit</span>
                      <span className="text-amber-600">30 Min Required</span>
                      <span className="text-emerald-600">45+ Optimal</span>
                    </div>
                  </div>

                  {/* Seismic */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-semibold">Microseismic Rockburst Vibration</span>
                      <span className="font-mono font-bold text-slate-900">{seismicVibration.toFixed(3)} g</span>
                    </div>
                    <input
                      type="range"
                      min={0.005}
                      max={0.12}
                      step={0.005}
                      value={seismicVibration}
                      onChange={(e) => setSeismicVibration(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Days since audit */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-semibold">Days Since Last Formal DGMS Audit</span>
                      <span className="font-mono font-bold text-slate-900">{inspectionDays} days</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={45}
                      value={inspectionDays}
                      onChange={(e) => setInspectionDays(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">DGMS 1957/2017 & MSHA 30 CFR Rules</span>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Compliance...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Audit Mine Safety Compliance</span>
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

          {/* Compliance Audit Output */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Statutory Compliance & Safety Assessment</span>
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Model Ready (v1.0.0)
                </span>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Sensor Telemetry"
                  description="Adjust environmental sliders or select a preset profile to generate compliance violation report."
                />
              ) : (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg ${getStatusStyle(result.compliance_status).banner} space-y-1 shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                        DGMS Compliance Status
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/20 font-bold">
                        {result.mine_site_id}
                      </span>
                    </div>
                    <div className="text-2xl font-black">{result.compliance_status.toUpperCase()}</div>
                    <div className="text-xs opacity-95">Urgency: {result.inspection_urgency}</div>
                  </div>

                  {/* Dual Score Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Composite Safety Score
                      </span>
                      <span className={`text-2xl font-mono font-black ${getStatusStyle(result.compliance_status).scoreText}`}>
                        {result.safety_score} / 100
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Hazard Index
                      </span>
                      <span className="text-2xl font-mono font-black text-slate-800">
                        {(result.hazard_index * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Flagged Statutory Violations */}
                  <div className="p-3.5 rounded-lg bg-red-50/70 border border-red-200 text-xs">
                    <span className="font-semibold text-red-950 block mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Statutory Violations & Regulatory Threshold Breaches:
                    </span>
                    {result.flagged_violations.length === 0 ? (
                      <span className="text-emerald-700 font-medium">
                        Zero statutory threshold violations detected. Normal operations approved.
                      </span>
                    ) : (
                      <ul className="space-y-1 text-red-900 text-[11px]">
                        {result.flagged_violations.map((v, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-600 font-bold">•</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Mandatory Directives & Signoff */}
                  <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                    <span className="font-semibold text-blue-950 block">
                      Mandatory Mine Safety Directives:
                    </span>
                    <ul className="space-y-1 text-blue-900 text-[11px]">
                      {result.recommended_mitigation.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-600">→</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-blue-200/60">
                      {noticeGenerated ? (
                        <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Formal DGMS Safety Audit Notice Exported and Logged for Regulators.</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setNoticeGenerated(true)}
                          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Generate & Sign Formal Inspection Notice</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Responsible AI Note: Environmental safety evaluations are automated decision-support cues. Certified DGMS / OSHA safety officers hold ultimate operational shutdown authority.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
