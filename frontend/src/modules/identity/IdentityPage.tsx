import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import {
  UserCheck,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  FileBadge,
  Camera,
  Upload,
  RotateCcw,
  Trash2,
  Scan,
  Video,
  VideoOff,
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

// Preset identity portraits (SVG data URLs)
const createPresetAvatar = (bgColor: string, accentColor: string, title: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="16" fill="${bgColor}"/>
    <circle cx="100" cy="78" r="36" fill="${accentColor}" opacity="0.95"/>
    <ellipse cx="100" cy="168" rx="58" ry="38" fill="${accentColor}" opacity="0.95"/>
    <circle cx="88" cy="74" r="4" fill="#ffffff"/>
    <circle cx="112" cy="74" r="4" fill="#ffffff"/>
    <path d="M 90 92 Q 100 100 110 92" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="100" y="190" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const PRESET_IDENTITIES = [
  {
    label: '✅ Verified Employee Match',
    name: 'Sarah Chen (Level 4 IT)',
    scenario: 'match',
    avatar: createPresetAvatar('#1E3A8A', '#3B82F6', 'Sarah Chen'),
    filename: 'sarah_chen_enrolled.jpg',
  },
  {
    label: '⚠️ Borderline Lighting Shift',
    name: 'Marcus Vance (Level 3 Ops)',
    scenario: 'borderline',
    avatar: createPresetAvatar('#78350F', '#F59E0B', 'Marcus Vance'),
    filename: 'marcus_vance_profile.jpg',
  },
  {
    label: '❌ Impostor Suspect Mismatch',
    name: 'Unknown Subject (Flagged)',
    scenario: 'mismatch',
    avatar: createPresetAvatar('#7F1D1D', '#EF4444', 'Suspect Ref'),
    filename: 'unregistered_probe.jpg',
  },
];

export const IdentityPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'identity')!;

  // Reference Photo state
  const [referencePhoto, setReferencePhoto] = useState<string | null>(PRESET_IDENTITIES[0].avatar);
  const [referenceFileName, setReferenceFileName] = useState<string>('sarah_chen_enrolled.jpg');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Scenario & Comparison state
  const [scenario, setScenario] = useState<string>('match');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Sync stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  // Camera controls
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Webcam API is not supported by your browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setCapturedPhoto(null);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No webcam hardware detected on this device. You can use standard presets or upload a photo.');
      } else {
        setCameraError(err.message || 'Unable to access webcam. Please check your camera settings.');
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Reference photo file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validFormats.includes(file.type)) {
      setUploadError('Invalid format. Please select a valid JPG, JPEG, or PNG image.');
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5 MB. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReferencePhoto(reader.result);
        setReferenceFileName(file.name);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearReferencePhoto = () => {
    setReferencePhoto(null);
    setReferenceFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadPreset = (preset: (typeof PRESET_IDENTITIES)[0]) => {
    setReferencePhoto(preset.avatar);
    setReferenceFileName(preset.filename);
    setScenario(preset.scenario);
    setUploadError(null);
  };

  // Run Biometric Comparison
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!referencePhoto && !capturedPhoto) {
      setErrorMsg('Please provide a reference photo and either capture a live photo or select a test scenario.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.request<VerificationResult>('/identity/verify', {
        method: 'POST',
        body: JSON.stringify({
          reference_id: referenceFileName || 'REF-USER-PHOTO',
          reference_image_b64: referencePhoto || undefined,
          verification_image_b64: capturedPhoto || undefined,
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
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. Page Header (Clean: Title & Description only) */}
      <PageHeader
        title={metadata.name}
        description={metadata.description}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Preset Identity Selectors */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Test Biometric Profiles:
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
              {/* Header without POST badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Biometric Verification Console</span>
                </h3>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                {/* 3. Reference Photo Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Reference Photo
                    </label>
                    <span className="text-[11px] text-slate-400">JPG, JPEG, PNG (Max 5MB)</span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />

                  {referencePhoto ? (
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={referencePhoto}
                          alt="Reference Preview"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                            {referenceFileName || 'Uploaded Reference'}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800">
                            Enrolled Identity Photo
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={clearReferencePhoto}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-4 text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/30 transition-all"
                    >
                      <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-700">Click to Upload Reference Photo</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, JPEG, and PNG</p>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </p>
                  )}
                </div>

                {/* 2. Functional Live Photo Capture Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Live Photo Capture
                    </label>
                    {isCameraActive && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600" /> Live Webcam Active
                      </span>
                    )}
                  </div>

                  {/* Camera Video / Preview / Placeholder container */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 relative min-h-[190px] flex items-center justify-center">
                    {/* Mode A: Live Video Active */}
                    {isCameraActive ? (
                      <div className="relative w-full h-[190px] bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Biometric Overlay Reticle */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-28 h-36 border-2 border-dashed border-blue-400/80 rounded-2xl flex items-center justify-center">
                            <Scan className="w-10 h-10 text-blue-300/60 animate-pulse" />
                          </div>
                        </div>

                        {/* Floating Action Controls */}
                        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-2 px-3">
                          <button
                            type="button"
                            onClick={captureLivePhoto}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Capture Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            <VideoOff className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : capturedPhoto ? (
                      /* Mode B: Captured Photo Preview */
                      <div className="relative w-full h-[190px] bg-slate-950 flex items-center justify-center">
                        <img
                          src={capturedPhoto}
                          alt="Captured probe"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          Captured
                        </div>
                        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={retakePhoto}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-medium border border-slate-700 shadow transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCapturedPhoto(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-medium shadow transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Mode C: Idle Camera State */
                      <div className="p-6 text-center text-slate-400">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                        <p className="text-xs text-slate-300 font-medium">Camera is currently inactive</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                          Click below to start your webcam and take a live verification photo
                        </p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Camera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Camera Error Message */}
                  {cameraError && (
                    <div className="mt-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-amber-950">Camera Unavailable</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">{cameraError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scenario Override Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Simulation Calibration Mode (Optional)
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

                {/* Submit button without Decision Threshold label */}
                <div className="flex items-center justify-end pt-3">
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
              {/* Header without Model Ready badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-blue-600" />
                  <span>Biometric Comparison Report</span>
                </h3>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Biometric Input"
                  description="Upload a reference photo and capture a live webcam photo, then click Run Biometric Comparison."
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

                  {/* Similarity Metrics Row (Clean 2-Column: No Decision Threshold column) */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">
                        Similarity Score
                      </span>
                      <span className="text-xl font-bold font-mono text-blue-700">
                        {(result.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">
                        Liveness Index
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-700">
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
          </div>
        </div>
      </div>
    </div>
  );
};
