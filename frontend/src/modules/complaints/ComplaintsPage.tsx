import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import {
  MessageSquareText,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { MODULE_REGISTRY } from '../../config/navigation';
import { api } from '../../services/api';

interface ClassificationResult {
  category: string;
  confidence: number;
  priority: string;
  department: string;
  sla_hours: number;
  requires_human_review: boolean;
  key_risk_factors: string[];
  model_version: string;
}

const PRESET_QUERIES = [
  {
    label: '⚡ High-Voltage Cable Sparking',
    title: 'High voltage electrical wire sparking after thunderstorm',
    description: 'Multiple live high-tension cables snapped and touching water ponding near Sector 12 school gate.',
    hint: 'Power Utilities',
  },
  {
    label: '🚰 Raw Sewage Hospital Overflow',
    title: 'Sewage main line burst flooding medical clinic access',
    description: 'Black wastewater overflowing from broken manhole cap directly into clinic entrance, severe biohazard odor.',
    hint: 'Sanitation',
  },
  {
    label: '🕳️ Highway Sinkhole Collapse',
    title: 'Deep 2-meter sinkhole collapsed on expressway bypass',
    description: 'Road surface caved in suddenly on national highway fast lane, trucks swerving into median barrier.',
    hint: 'Highways',
  },
  {
    label: '☣️ Toxic Chemical Barrels Dumped',
    title: 'Leaking industrial chemical drums abandoned in green belt',
    description: 'Ten rusted metal barrels leaking acidic pungent solvent into storm canal, stinging residents eyes.',
    hint: 'Environment',
  },
  {
    label: '📢 Midnight Loudspeaker Noise',
    title: 'High-decibel sound system blasting past 2:30 AM',
    description: 'Continuous unauthorized public address system operating in residential neighborhood silence zone.',
    hint: 'Public Order',
  },
];

export const ComplaintsPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'complaints')!;
  const [complaintText, setComplaintText] = useState('High voltage electrical wire sparking after thunderstorm');
  const [description, setDescription] = useState(
    'Multiple live high-tension cables snapped and touching water ponding near Sector 12 school gate.'
  );
  const [departmentHint, setDepartmentHint] = useState('Power Utilities');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim() && !description.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setIsDispatched(false);

    try {
      const response = await api.request<ClassificationResult>('/complaints/classify', {
        method: 'POST',
        body: JSON.stringify({
          title: complaintText,
          description: description,
          department_hint: departmentHint || undefined,
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(response.error?.message || 'Failed to classify complaint.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while contacting classification engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_QUERIES)[0]) => {
    setComplaintText(preset.title);
    setDescription(preset.description);
    setDepartmentHint(preset.hint);
    setIsDispatched(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-semibold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title={metadata.name}
        description={metadata.description}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

        {/* Preset Query Chips */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Test Scenarios (Click to load realistic test cases):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
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

        {/* Two-Column Grid: Form & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-blue-600" />
                  <span>Citizen Grievance Input Console</span>
                </h3>
              </div>

              <form onSubmit={handleClassify} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Complaint Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High voltage electrical wire sparking..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Grievance Full Narrative
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed report of the citizen complaint or hazard..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department Routing Hint (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Power Utilities, Public Works, Sanitation"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={departmentHint}
                    onChange={(e) => setDepartmentHint(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Classify & Triage</span>
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

          {/* Prediction & Triage Output Area */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Model Prediction & Triage Intelligence</span>
                </h3>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Grievance Input"
                  description="Submit a complaint text or click a quick test preset above to execute the NLP triage pipeline."
                />
              ) : (
                <div className="space-y-4">
                  {/* Category & Confidence */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                          Predicted Category
                        </span>
                        <span className="text-sm font-bold text-slate-900">{result.category}</span>
                      </div>
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${getPriorityBadge(result.priority)}`}>
                        {result.priority} Priority
                      </span>
                    </div>

                    {/* Confidence Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Confidence Score</span>
                        <span className="font-mono font-bold text-blue-700">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(10, result.confidence * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Department & SLA Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">
                            Routed Department
                          </span>
                          <span className="text-xs font-semibold text-slate-800">{result.department}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">
                            Target SLA Turnaround
                          </span>
                          <span className="text-xs font-semibold text-slate-800">{result.sla_hours} Hours</span>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Human-in-the-Loop Workflow Decision */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Human-in-the-Loop Review:</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mandated Protocol Active
                      </span>
                    </div>

                    {isDispatched ? (
                      <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Work Order Dispatched to <strong>{result.department}</strong>. Incident Logged.</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsDispatched(true)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Approve & Dispatch Field Unit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
