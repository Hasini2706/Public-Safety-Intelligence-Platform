import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  Siren,
  Server,
  Sparkles,
  Loader2,
  ShieldCheck,
  Radio,
  Lock,
} from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';
import { api } from '../../services/api';

interface ThreatAnalysisResult {
  threat_level: string;
  anomaly_score: number;
  detected_indicators: string[];
  alert_triggered: boolean;
  soc_escalation_advised: boolean;
  zone_id: string;
  sensor_type: string;
  recommended_playbook: string[];
  model_version: string;
}

const PRESET_EVENTS = [
  {
    label: '🚨 Critical Forced Entry & Off-Hours Breach',
    zone: 'DATA-CENTER-ZONE-B',
    sensor: 'cctv_motion_badge_reader',
    afterHours: true,
    failedBadges: 3,
    persons: 2,
    forcedDoor: true,
    dwellSeconds: 75,
    vibration: 0.45,
    thermal: 1.2,
  },
  {
    label: '⚠️ Off-Hours Tailgating on Single Badge',
    zone: 'SERVER-POD-ALPHA',
    sensor: 'cctv_motion_badge_reader',
    afterHours: true,
    failedBadges: 1,
    persons: 2,
    forcedDoor: false,
    dwellSeconds: 22,
    vibration: 0.04,
    thermal: 0.9,
  },
  {
    label: '🌡️ Battery Room Thermal Anomaly',
    zone: 'BATTERY-VAULT-02',
    sensor: 'thermal_ir_rack_sensor',
    afterHours: false,
    failedBadges: 0,
    persons: 1,
    forcedDoor: false,
    dwellSeconds: 15,
    vibration: 0.02,
    thermal: 5.4,
  },
  {
    label: '✅ Routine Daylight Maintenance Entry',
    zone: 'NOC-MAIN-ENTRANCE',
    sensor: 'cctv_motion_badge_reader',
    afterHours: false,
    failedBadges: 0,
    persons: 1,
    forcedDoor: false,
    dwellSeconds: 10,
    vibration: 0.02,
    thermal: 0.5,
  },
];

export const ThreatDetectionPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'threat-detection')!;
  const [zoneId, setZoneId] = useState('DATA-CENTER-ZONE-B');
  const [sensorType, setSensorType] = useState('cctv_motion_badge_reader');
  const [afterHours, setAfterHours] = useState(true);
  const [failedBadges, setFailedBadges] = useState(3);
  const [personCount, setPersonCount] = useState(2);
  const [doorDwellSeconds, setDoorDwellSeconds] = useState(75);
  const [rackVibration, setRackVibration] = useState(0.45);
  const [thermalDelta, setThermalDelta] = useState(1.2);
  const [forcedDoor, setForcedDoor] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ThreatAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alarmAcknowledged, setAlarmAcknowledged] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setAlarmAcknowledged(false);

    try {
      const response = await api.request<ThreatAnalysisResult>('/threat-detection/analyze', {
        method: 'POST',
        body: JSON.stringify({
          zone_id: zoneId,
          sensor_type: sensorType,
          event_payload: {
            after_hours: afterHours,
            failed_badge_attempts: failedBadges,
            person_count: personCount,
            door_dwell_seconds: doorDwellSeconds,
            rack_vibration_g: rackVibration,
            thermal_delta_c: thermalDelta,
            forced_door: forcedDoor,
          },
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Threat analysis failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with threat detection service.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_EVENTS)[0]) => {
    setZoneId(preset.zone);
    setSensorType(preset.sensor);
    setAfterHours(preset.afterHours);
    setFailedBadges(preset.failedBadges);
    setPersonCount(preset.persons);
    setForcedDoor(preset.forcedDoor);
    setDoorDwellSeconds(preset.dwellSeconds);
    setRackVibration(preset.vibration);
    setThermalDelta(preset.thermal);
    setAlarmAcknowledged(false);
  };

  const getThreatStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          banner: 'bg-red-500 text-white',
          badge: 'bg-red-100 text-red-800 border-red-300',
          barColor: 'bg-red-600',
        };
      case 'High':
        return {
          banner: 'bg-orange-500 text-white',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          barColor: 'bg-orange-600',
        };
      case 'Medium':
        return {
          banner: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          barColor: 'bg-amber-500',
        };
      default:
        return {
          banner: 'bg-emerald-600 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          barColor: 'bg-emerald-600',
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
            Simulate Facility Security Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_EVENTS.map((preset, idx) => (
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

        {/* Two-Column Form & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Telemetry Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Facility Telemetry Intake Console</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  POST /api/v1/threat-detection/analyze
                </span>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Monitored Zone ID
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    >
                      <option value="DATA-CENTER-ZONE-B">DATA-CENTER-ZONE-B (Primary)</option>
                      <option value="SERVER-POD-ALPHA">SERVER-POD-ALPHA (High Density)</option>
                      <option value="BATTERY-VAULT-02">BATTERY-VAULT-02 (UPS Core)</option>
                      <option value="NOC-MAIN-ENTRANCE">NOC-MAIN-ENTRANCE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Primary Sensor Stream
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={sensorType}
                      onChange={(e) => setSensorType(e.target.value)}
                    >
                      <option value="cctv_motion_badge_reader">CCTV Motion + Badge Reader</option>
                      <option value="thermal_ir_rack_sensor">Thermal IR + Rack Vibration</option>
                      <option value="door_contact_magnetic">Magnetic Door Interlock</option>
                    </select>
                  </div>
                </div>

                {/* Telemetry Sliders and Toggles */}
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span>Off-Hours / Inactive Shift Window</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={afterHours}
                      onChange={(e) => setAfterHours(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      <span>Forced Door Contact Alert</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={forcedDoor}
                      onChange={(e) => setForcedDoor(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Failed Badge Attempts</span>
                      <span className="font-mono font-bold text-slate-900">{failedBadges} attempts</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      value={failedBadges}
                      onChange={(e) => setFailedBadges(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">CCTV Detected Personnel</span>
                      <span className="font-mono font-bold text-slate-900">{personCount} persons</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={personCount}
                      onChange={(e) => setPersonCount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Door Dwell Time</span>
                      <span className="font-mono font-bold text-slate-900">{doorDwellSeconds} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={doorDwellSeconds}
                      onChange={(e) => setDoorDwellSeconds(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Server Rack Vibration</span>
                      <span className="font-mono font-bold text-slate-900">{rackVibration.toFixed(2)} g</span>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={0.80}
                      step={0.02}
                      value={rackVibration}
                      onChange={(e) => setRackVibration(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">Model: Isolation Forest Telemetry Anomaly Scorer</span>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Analyze Threat Event</span>
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
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>Security Operations Center (SOC) Triage</span>
                </h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Model Ready (v1.0.0)
                </span>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Sensor Telemetry"
                  description="Adjust parameters or click a preset to evaluate anomaly score and SOC playbook directives."
                />
              ) : (
                <div className="space-y-4">
                  {/* Threat Level Banner */}
                  {(() => {
                    const style = getThreatStyle(result.threat_level);
                    return (
                      <div className={`p-4 rounded-lg ${style.banner} shadow-sm space-y-1`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                            Physical Threat Level
                          </span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-black/20">
                            {result.zone_id}
                          </span>
                        </div>
                        <div className="text-2xl font-black">{result.threat_level} THREAT</div>
                        <div className="text-xs opacity-95">
                          {result.alert_triggered
                            ? '🚨 Security Alert Triggered. Immediate human investigation advised.'
                            : 'Standard operational baseline. No breach detected.'}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Anomaly Gauge */}
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Calculated Anomaly Score</span>
                      <span className="font-mono font-bold text-blue-700">
                        {(result.anomaly_score * 100).toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          getThreatStyle(result.threat_level).barColor
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, result.anomaly_score * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Detected Indicators */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 block mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Detected Physical Security Indicators:
                    </span>
                    <ul className="space-y-1.5">
                      {result.detected_indicators.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* SOC Playbook Action Items */}
                  <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                    <span className="font-semibold text-blue-950 block flex items-center gap-1.5">
                      <Siren className="w-3.5 h-3.5 text-blue-700" />
                      Mandated SOC Defensive Playbook:
                    </span>
                    <ul className="space-y-1 text-blue-900 text-[11px]">
                      {result.recommended_playbook.map((action, idx) => (
                        <li key={idx} className="font-medium">
                          {action}
                        </li>
                      ))}
                    </ul>

                    {result.soc_escalation_advised && (
                      <div className="pt-2">
                        {alarmAcknowledged ? (
                          <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Alarm Acknowledged by On-Duty SOC Analyst. Guard Dispatched.</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAlarmAcknowledged(true)}
                            className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Acknowledge SOC Alert & Dispatch Guard</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Responsible AI Note: Facility threat scores provide decision support for Security Operations Centers. Automated alerts must be corroborated by guard physical verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
