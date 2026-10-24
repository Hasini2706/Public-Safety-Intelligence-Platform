import React, { useState, useRef } from 'react';
import {
  Shield,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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

type InputTab = 'text' | 'image_url' | 'file_upload';

const SAMPLE_INCIDENTS = [
  {
    label: '🚨 Forced Entry Breach',
    text: 'Forced entry detected after hours at server room pod. Multiple failed badge attempts recorded with high vibration.',
  },
  {
    label: '⚠️ Off-Hours Tailgating',
    text: 'Two unauthorized individuals detected entering data center zone after midnight following single badge swipe.',
  },
  {
    label: '✅ Routine Daylight Inspection',
    text: 'Authorized technician entered NOC entrance during standard business hours for scheduled hardware maintenance.',
  },
];

export const ThreatDetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InputTab>('text');

  // Input states
  const [textInput, setTextInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ThreatAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alarmAcknowledged, setAlarmAcknowledged] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFilePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Run Threat Detection submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);
    setAlarmAcknowledged(false);

    // Client-side input validation
    if (activeTab === 'text') {
      if (!textInput.trim()) {
        setErrorMsg('Please enter an incident description or threat text to analyze.');
        return;
      }
    } else if (activeTab === 'image_url') {
      if (!imageUrl.trim()) {
        setErrorMsg('Please enter an image URL to analyze.');
        return;
      }
    } else if (activeTab === 'file_upload') {
      if (!filePreview) {
        setErrorMsg('Please select or upload an image file to analyze.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await api.request<ThreatAnalysisResult>('/threat-detection/analyze', {
        method: 'POST',
        body: JSON.stringify({
          input_type: activeTab,
          text: activeTab === 'text' ? textInput.trim() : undefined,
          image_url: activeTab === 'image_url' ? imageUrl.trim() : undefined,
          image_b64: activeTab === 'file_upload' ? filePreview : undefined,
          zone_id: 'DATA-CENTER-ZONE-B',
          sensor_type: activeTab === 'text' ? 'incident_text_report' : 'cctv_vision_stream',
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrorMsg(
          response.error?.message ||
          response.message ||
          'Threat detection could not be completed. Please check your input and try again.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with threat detection service.');
    } finally {
      setIsLoading(false);
    }
  };

  const getThreatStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          banner: 'bg-red-600 text-white',
          badge: 'bg-red-100 text-red-800 border-red-300',
        };
      case 'High':
        return {
          banner: 'bg-orange-500 text-white',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
        };
      case 'Medium':
        return {
          banner: 'bg-amber-500 text-white',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      default:
        return {
          banner: 'bg-emerald-600 text-white',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. Page Title Header */}
      <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Shield className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Threat Detection</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Analyze input data to detect potential threats using AI-powered models.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Error Alert Message (Displayed when detection fails or validation errors) */}
        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-950">Threat Detection Notice</p>
              <p className="text-red-800 mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* 2. Input Data Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Input Data</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the data you want to analyze. You can provide text, image URL, or upload a file (if supported).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Format Tab Selector */}
            <div className="grid grid-cols-3 border border-slate-200 rounded-lg overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('text');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 flex items-center justify-center gap-2 transition-colors border-r border-slate-200 ${
                  activeTab === 'text'
                    ? 'bg-blue-50 text-blue-700 font-semibold border-b-2 border-b-blue-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Text</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('image_url');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 flex items-center justify-center gap-2 transition-colors border-r border-slate-200 ${
                  activeTab === 'image_url'
                    ? 'bg-blue-50 text-blue-700 font-semibold border-b-2 border-b-blue-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image URL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('file_upload');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'file_upload'
                    ? 'bg-blue-50 text-blue-700 font-semibold border-b-2 border-b-blue-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>File Upload</span>
              </button>
            </div>

            {/* Tab 1: Text Input */}
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text (e.g., incident description, report details, etc.)"
                  maxLength={1000}
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" /> Examples:
                    </span>
                    {SAMPLE_INCIDENTS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTextInput(sample.text);
                          setErrorMsg(null);
                        }}
                        className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-slate-500">{textInput.length}/1000</span>
                </div>
              </div>
            )}

            {/* Tab 2: Image URL Input */}
            {activeTab === 'image_url' && (
              <div className="space-y-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/cctv_night_breach.jpg)"
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                {imageUrl.trim() && (
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="URL Preview"
                      className="w-16 h-16 rounded object-cover border border-slate-200 bg-white"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="text-xs text-slate-600 truncate flex-1">
                      <span className="font-semibold block text-slate-800">Target Image URL:</span>
                      <span className="text-slate-500 truncate block font-mono text-[11px]">{imageUrl}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: File Upload Input */}
            {activeTab === 'file_upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                />

                {filePreview ? (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={filePreview}
                        alt="Selected file"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                          {selectedFile?.name || 'Selected Image'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Image ready for analysis'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition-all"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Click to upload or drag and drop image file</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, and WebP (up to 5MB)</p>
                  </div>
                )}
              </div>
            )}

            {/* Run Threat Detection Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running Threat Detection...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Run Threat Detection</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3. Detection Result Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Detection Result</h2>
          </div>

          {!result ? (
            /* Empty state matching the user's screenshot */
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No results yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Submit data and click on "Run Threat Detection" to see the analysis results here.
              </p>
            </div>
          ) : (
            /* Actual Detection Outcome returned by the backend model */
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
                    <div className="text-2xl font-black">{result.threat_level.toUpperCase()} THREAT</div>
                    <div className="text-xs opacity-95">
                      {result.alert_triggered
                        ? '🚨 Security Alert Triggered. Immediate human investigation advised.'
                        : '✅ Standard operational baseline. No breach detected.'}
                    </div>
                  </div>
                );
              })()}

              {/* Mandated SOC Defensive Playbook */}
              <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                <span className="font-semibold text-blue-950 block">
                  Mandated SOC Defensive Playbook:
                </span>
                <ul className="space-y-1.5 text-blue-900 text-xs">
                  {result.recommended_playbook.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-blue-700">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>

                {result.soc_escalation_advised && (
                  <div className="pt-2">
                    {alarmAcknowledged ? (
                      <div className="p-2.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Alarm Acknowledged by Security Operations Center. Guard Dispatched.</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAlarmAcknowledged(true)}
                        className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Acknowledge SOC Alert & Dispatch Guard</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
