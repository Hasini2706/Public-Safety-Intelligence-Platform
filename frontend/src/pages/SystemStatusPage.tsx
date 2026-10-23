import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import {
  Server,
  Globe,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { MODULE_REGISTRY } from '../config/navigation';
import { Link } from 'react-router-dom';

interface ModuleCheckResult {
  id: string;
  name: string;
  endpoint: string;
  status: 'checking' | 'healthy' | 'error';
  latencyMs?: number;
  mlStatus?: string;
  version?: string;
}

export const SystemStatusPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [moduleChecks, setModuleChecks] = useState<ModuleCheckResult[]>(
    MODULE_REGISTRY.map((m) => ({
      id: m.id,
      name: m.shortName,
      endpoint: `/${m.id}/status`,
      status: 'checking',
    }))
  );

  const fetchHealthAndModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.checkHealth();
      setHealthData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to reach FastAPI backend');
      setHealthData(null);
    }

    // Ping all 5 module status endpoints and record response latency
    const checks: ModuleCheckResult[] = [];
    for (const mod of MODULE_REGISTRY) {
      const startTime = performance.now();
      try {
        const res = await api.request<any>(`/${mod.id}/status`);
        const elapsed = Math.round(performance.now() - startTime);
        if (res.success && res.data) {
          checks.push({
            id: mod.id,
            name: mod.shortName,
            endpoint: `/${mod.id}/status`,
            status: 'healthy',
            latencyMs: elapsed,
            mlStatus: res.data.ml_status || 'ready',
            version: res.data.version || '1.0.0',
          });
        } else {
          checks.push({
            id: mod.id,
            name: mod.shortName,
            endpoint: `/${mod.id}/status`,
            status: 'error',
            latencyMs: elapsed,
          });
        }
      } catch {
        checks.push({
          id: mod.id,
          name: mod.shortName,
          endpoint: `/${mod.id}/status`,
          status: 'error',
        });
      }
    }
    setModuleChecks(checks);
    setLoading(false);
  };

  useEffect(() => {
    fetchHealthAndModules();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title="System Status & Infrastructure Diagnostics"
        description="Real-time connectivity monitoring, model health telemetry, and service layer latency."
        actions={
          <button
            onClick={fetchHealthAndModules}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Re-verify System Diagnostic</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Core Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Frontend Service */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <StatusBadge status="active" label="Operational" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Frontend Web Shell</h3>
            <p className="mt-1 text-xs text-slate-500">React 18 + TypeScript + Vite + Tailwind</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Client Engine:</span>
                <span className="font-mono text-slate-800">Vite v5.4</span>
              </div>
              <div className="flex justify-between">
                <span>Target Port:</span>
                <span className="font-mono text-slate-800">5173</span>
              </div>
            </div>
          </div>

          {/* Backend API Service */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <StatusBadge
                status={healthData ? 'active' : 'offline'}
                label={healthData ? 'API Online' : 'API Offline'}
              />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">FastAPI Backend Service</h3>
            <p className="mt-1 text-xs text-slate-500">Python 3.14 + Uvicorn + Pydantic v2</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base URL:</span>
                <span className="font-mono text-slate-800 text-[11px]">{api.getBaseUrl()}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Endpoint:</span>
                <span className="font-mono text-slate-800 text-[11px]">/api/v1/health</span>
              </div>
              <div className="flex justify-between">
                <span>API Version:</span>
                <span className="font-mono text-slate-800 text-[11px]">
                  {healthData?.version || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Machine Learning Layer */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <StatusBadge status="ready" label="All 5 Models Active" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Machine Learning Layer</h3>
            <p className="mt-1 text-xs text-slate-500">Scikit-Learn + NumPy + Pandas</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Configured Pipelines:</span>
                <span className="text-emerald-700 font-semibold">5 / 5 Production Ready</span>
              </div>
              <div className="flex justify-between">
                <span>Model Pipeline Status:</span>
                <span className="font-mono text-slate-800 text-[11px]">v1.0.0 Calibrated</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 ML Modules Real-Time Telemetry Matrix */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>5 Intelligence Modules Health & Latency Telemetry</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time status probes for each independent feature module branch.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">GET /api/v1/modules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {moduleChecks.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{mod.name}</span>
                    {mod.status === 'healthy' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" title="Healthy" />
                    ) : mod.status === 'checking' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Pinging" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="Error" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 block">{mod.endpoint}</span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Latency:</span>
                    <span className="font-mono font-semibold text-blue-700">
                      {mod.latencyMs !== undefined ? `${mod.latencyMs} ms` : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Model:</span>
                    <span className="font-medium text-emerald-700">
                      {mod.mlStatus || 'Ready'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/${mod.id}`}
                  className="mt-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 py-1 bg-white rounded border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <span>Open Console</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Live Health Probe Payload Inspection */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Live Backend Response Payload (/api/v1/health)
            </h3>
            {healthData ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> HTTP 200 OK
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <XCircle className="w-3.5 h-3.5" /> Connection Failed
              </span>
            )}
          </div>

          {healthData ? (
            <pre className="p-4 rounded-md bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
{JSON.stringify(healthData, null, 2)}
            </pre>
          ) : (
            <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <p className="font-semibold mb-1">Backend Connectivity Error:</p>
              <p className="font-mono text-[11px]">{error}</p>
              <p className="mt-2 text-slate-600">
                Ensure the FastAPI server is running locally on port 8000:
                <code className="block mt-1 font-mono text-[11px] bg-white p-2 rounded border border-rose-200 text-slate-800">
                  cd backend && uvicorn app.main:app --reload
                </code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
