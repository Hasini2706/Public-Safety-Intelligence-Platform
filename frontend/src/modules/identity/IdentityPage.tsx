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
  Sliders,
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
    face_centering?: number;
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

// Generate realistic raster PNG portraits in browser canvas for presets
const generatePortraitPng = (
  bgColor: string,
  skinColor: string,
  hairColor: string,
  shirtColor: string,
  isLongHair: boolean,
  glasses: boolean = false,
  brightnessMod: number = 0,
  headShiftX: number = 0
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 160, 160);

  const cx = 80 + headShiftX;

  // Shoulders / Torso
  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.ellipse(cx, 160, 60, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = skinColor;
  ctx.fillRect(cx - 12, 90, 24, 35);

  // Head contour
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.ellipse(cx, 75, 34, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair back (if long)
  if (isLongHair) {
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.ellipse(cx, 70, 42, 48, 0, 0, Math.PI);
    ctx.fill();
  }

  // Hair front
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.ellipse(cx, 48, 36, 18, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = hairColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 24, 62);
  ctx.lineTo(cx - 8, 63);
  ctx.moveTo(cx + 8, 63);
  ctx.lineTo(cx + 24, 62);
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 16, 70, 7, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 16, 70, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#221510';
  ctx.beginPath();
  ctx.arc(cx - 16, 70, 3.5, 0, Math.PI * 2);
  ctx.arc(cx + 16, 70, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 68);
  ctx.lineTo(cx - 2, 82);
  ctx.lineTo(cx + 4, 82);
  ctx.stroke();

  // Mouth
  ctx.strokeStyle = isLongHair ? '#c24141' : '#8e4b3c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 10, 96);
  ctx.lineTo(cx + 10, 96);
  ctx.stroke();

  // Glasses
  if (glasses) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(cx - 26, 63, 20, 14);
    ctx.strokeRect(cx + 6, 63, 20, 14);
    ctx.beginPath();
    ctx.moveTo(cx - 6, 69);
    ctx.lineTo(cx + 6, 69);
    ctx.stroke();
  }

  // Lighting overlay
  if (brightnessMod < 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(brightnessMod)})`;
    ctx.fillRect(0, 0, 160, 160);
  } else if (brightnessMod > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${brightnessMod})`;
    ctx.fillRect(0, 0, 160, 160);
  }

  return canvas.toDataURL('image/png');
};

export const IdentityPage: React.FC = () => {
  const metadata = MODULE_REGISTRY.find((m) => m.id === 'identity')!;

  // Reference Photo state
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Camera / Probe state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPhotoName, setCapturedPhotoName] = useState<string>('Live Webcam Photo');
  const liveFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Verification Threshold & Comparison state
  const [threshold, setThreshold] = useState<number>(0.78);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize with the standard reference profile on mount
  useEffect(() => {
    try {
      const refPng = generatePortraitPng('#e0f2fe', '#fcd34d', '#3b2512', '#1e3a8a', true, false, 0);
      const livePng = generatePortraitPng('#e0f2fe', '#fcd34d', '#3b2512', '#1e3a8a', true, false, 0.04);
      setReferencePhoto(refPng);
      setReferenceFileName('sarah_chen_enrolled.jpg');
      setCapturedPhoto(livePng);
      setCapturedPhotoName('sarah_chen_live.jpg');
    } catch (e) {
      // Fallback silently if canvas unavailable
    }
  }, []);

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
        setCameraError('No webcam hardware detected on this device. You can upload a live test photo instead.');
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhoto(dataUrl);
      setCapturedPhotoName('webcam_capture_' + new Date().toLocaleTimeString().replace(/:/g, '') + '.jpg');
      stopCamera();
      // Reset past result when new photo captured
      setResult(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setResult(null);
    startCamera();
  };

  // Reference photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validFormats.includes(file.type)) {
      setUploadError('Invalid format. Please select a valid JPG, JPEG, or PNG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5 MB. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReferencePhoto(reader.result);
        setReferenceFileName(file.name);
        setResult(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Live photo file upload (fallback if no webcam)
  const handleLiveFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validFormats.includes(file.type)) {
      setCameraError('Invalid format. Please select a JPG or PNG photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedPhoto(reader.result);
        setCapturedPhotoName(file.name);
        setResult(null);
        setCameraError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset quick load
  const loadPreset = (type: 'match' | 'borderline' | 'mismatch') => {
    setErrorMsg(null);
    setResult(null);
    if (isCameraActive) stopCamera();

    if (type === 'match') {
      const refPng = generatePortraitPng('#e0f2fe', '#fcd34d', '#3b2512', '#1e3a8a', true, false, 0);
      const livePng = generatePortraitPng('#e0f2fe', '#fcd34d', '#3b2512', '#1e3a8a', true, false, 0.04);
      setReferencePhoto(refPng);
      setReferenceFileName('sarah_chen_enrolled.jpg');
      setCapturedPhoto(livePng);
      setCapturedPhotoName('sarah_chen_live.jpg');
    } else if (type === 'borderline') {
      const refPng = generatePortraitPng('#fef3c7', '#d97706', '#1c1917', '#78350f', false, false, 0);
      const livePng = generatePortraitPng('#fef3c7', '#d97706', '#1c1917', '#78350f', false, true, -0.32, 2);
      setReferencePhoto(refPng);
      setReferenceFileName('marcus_vance_profile.jpg');
      setCapturedPhoto(livePng);
      setCapturedPhotoName('marcus_vance_dim_light.jpg');
    } else {
      const refPng = generatePortraitPng('#fee2e2', '#b45309', '#09090b', '#7f1d1d', false, false, 0);
      const livePng = generatePortraitPng('#f1f5f9', '#fde68a', '#172554', '#334155', true, false, 0);
      setReferencePhoto(refPng);
      setReferenceFileName('watchlist_suspect_ref.jpg');
      setCapturedPhoto(livePng);
      setCapturedPhotoName('unregistered_probe.jpg');
    }
  };

  // Run Biometric Comparison
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!referencePhoto || !capturedPhoto) {
      setErrorMsg('Both a Reference Photo and a Live Photo Capture are required to perform identity verification. Please provide both photos.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.request<VerificationResult>('/identity/verify', {
        method: 'POST',
        body: JSON.stringify({
          reference_id: referenceFileName || 'REF-ENROLLED-PHOTO',
          reference_image_b64: referencePhoto,
          verification_image_b64: capturedPhoto,
          test_scenario: 'match',
        }),
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setResult(null);
        setErrorMsg(response.error?.message || response.message || 'Biometric verification failed.');
      }
    } catch (err: any) {
      setResult(null);
      setErrorMsg(err.message || 'Network error communicating with identity service.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Verified Match') {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        border: 'border-emerald-500 bg-emerald-50/50',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        colorScore: 'text-emerald-700',
      };
    }
    if (status.includes('Borderline')) {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        border: 'border-amber-500 bg-amber-50/50',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        colorScore: 'text-amber-700',
      };
    }
    return {
      badge: 'bg-red-100 text-red-800 border-red-300',
      border: 'border-red-500 bg-red-50/50',
      icon: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
      colorScore: 'text-red-700',
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. Page Header */}
      <PageHeader
        title={metadata.name}
        description={metadata.description}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Quick Test Preset Selectors */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Test Biometric Profiles:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('match')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 transition-colors text-slate-700"
            >
              ✅ Verified Employee Match (Sarah Chen)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('borderline')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-slate-200 transition-colors text-slate-700"
            >
              ⚠️ Borderline Lighting Shift (Marcus Vance)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('mismatch')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-red-50 hover:text-red-800 hover:border-red-300 border border-slate-200 transition-colors text-slate-700"
            >
              ❌ Impostor Suspect Mismatch (Unregistered Probe)
            </button>
          </div>
        </div>

        {/* Input Console & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Biometric Verification Console</span>
                </h3>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                {/* Reference Photo Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Reference Photo
                    </label>
                    <span className="text-[11px] text-slate-400">JPG, JPEG, PNG (Max 5MB)</span>
                  </div>

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
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-medium">
                            Enrolled Identity Photo
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReferencePhoto(null);
                            setReferenceFileName('');
                            setResult(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
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

                {/* Live Photo Capture Section */}
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

                  <input
                    type="file"
                    ref={liveFileInputRef}
                    onChange={handleLiveFileUpload}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />

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
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <span>{capturedPhotoName || 'Live Photo Ready'}</span>
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
                            onClick={() => {
                              setCapturedPhoto(null);
                              setResult(null);
                            }}
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
                          Start your webcam or upload a photo to compare with the reference photo
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={startCamera}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Start Camera</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => liveFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="mt-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-amber-950">Camera Notice</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">{cameraError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Configurable Verification Threshold */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" />
                      Verification Decision Threshold:
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {(threshold * 100).toFixed(0)}% ({threshold.toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.70"
                    max="0.88"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Lenient (70%)</span>
                    <span>Standard (78%)</span>
                    <span>Strict (88%)</span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Comparing Facial Embeddings...</span>
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
              <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Verification Results Console */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileBadge className="w-4 h-4 text-blue-600" />
                  <span>Biometric Comparison Report</span>
                </h3>
              </div>

              {!result ? (
                <EmptyState
                  title="Awaiting Biometric Comparison"
                  description="Load a reference photo and a live photo, then click 'Run Biometric Comparison' to view model results."
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
                            <span className="text-base font-bold text-slate-900">{result.match_status}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
                            {result.confidence_level} Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{result.verdict_summary}</p>
                      </div>
                    );
                  })()}

                  {/* Similarity Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                        Similarity Score
                      </span>
                      <span className={`text-2xl font-bold font-mono ${
                        result.match_status === 'Verified Match'
                          ? 'text-emerald-700'
                          : result.match_status.includes('Borderline')
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}>
                        {(result.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                        Liveness Index
                      </span>
                      <span className="text-2xl font-bold font-mono text-slate-800">
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
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
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
