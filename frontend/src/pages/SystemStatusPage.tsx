import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import { Server, Database, Globe, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const SystemStatusPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.checkHealth();
      setHealthData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to reach FastAPI backend');
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title="System Status & Infrastructure Diagnostics"
        description="Real-time connectivity monitoring between React frontend and FastAPI backend."
        actions={
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Re-verify Health</span>
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
                <span className="font-mono text-slate-800">Vite v5.1</span>
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
            <p className="mt-1 text-xs text-slate-500">Python 3 + Uvicorn + Pydantic v2</p>
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

          {/* Database Layer */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <StatusBadge status="not_configured" label="Prepared / Optional" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Database Layer</h3>
            <p className="mt-1 text-xs text-slate-500">PostgreSQL / Supabase Architecture</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base App Requirement:</span>
                <span className="text-emerald-700 font-medium">None (Stateless)</span>
              </div>
              <div className="flex justify-between">
                <span>Config Placeholders:</span>
                <span className="font-mono text-slate-800 text-[11px]">DATABASE_URL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Health Probe Inspection */}
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
