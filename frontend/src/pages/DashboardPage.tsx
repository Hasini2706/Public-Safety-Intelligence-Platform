import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { ModuleCard } from '../components/common/ModuleCard';
import { AlertCard } from '../components/common/AlertCard';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { MODULE_REGISTRY } from '../config/navigation';
import { api } from '../services/api';
import { Shield, Activity, GitBranch } from 'lucide-react';

interface ModuleStatusRow {
  id: string;
  name: string;
  branch: string;
  developer: string;
  apiStatus: string;
  mlStatus: string;
}

export const DashboardPage: React.FC = () => {
  const [modulesData, setModulesData] = useState<ModuleStatusRow[]>(
    MODULE_REGISTRY.map((m) => ({
      id: m.id,
      name: m.shortName,
      branch: m.branch,
      developer: m.developer,
      apiStatus: 'active',
      mlStatus: 'ready',
    }))
  );

  useEffect(() => {
    // Optionally fetch live module status from the backend
    api.getModules().then((res) => {
      if (res.success && res.data?.modules) {
        const liveModules = res.data.modules.map((m: any) => {
          const registered = MODULE_REGISTRY.find((reg) => reg.id === m.id);
          return {
            id: m.id,
            name: registered ? registered.shortName : m.name,
            branch: m.branch,
            developer: registered ? registered.developer : 'Assigned Member',
            apiStatus: m.api_status || 'active',
            mlStatus: m.ml_status || 'ready',
          };
        });
        setModulesData(liveModules);
      }
    });
  }, []);

  const columns: Column<ModuleStatusRow>[] = [
    {
      header: 'Module Name',
      accessor: (row) => (
        <div className="font-semibold text-slate-900">{row.name}</div>
      ),
    },
    {
      header: 'Assigned Engineer',
      accessor: (row) => (
        <span className="text-slate-600 font-medium">{row.developer}</span>
      ),
    },
    {
      header: 'Git Feature Branch',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 text-blue-700 px-2 py-0.5 rounded">
          <GitBranch className="w-3 h-3 text-slate-400" />
          {row.branch}
        </span>
      ),
    },
    {
      header: 'API Integration',
      accessor: (row) => <StatusBadge status={row.apiStatus} />,
    },
    {
      header: 'ML Model State',
      accessor: (row) => <StatusBadge status={row.mlStatus} />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title="Command & Intelligence Overview"
        description="Unified operational dashboard monitoring all 5 public safety and governance intelligence modules."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Base Platform v1.0
          </span>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Sample Metrics Stats */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Operational Queue Overview
            </h2>
            <span className="text-[11px] text-slate-400">Sample metrics simulated for base layout</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Complaints Awaiting Review"
              value="42"
              change="+8 today"
              changeType="neutral"
              icon="MessageSquareText"
            />
            <StatCard
              title="Identity Reviews"
              value="18"
              change="9 pending signoff"
              changeType="neutral"
              icon="UserCheck"
            />
            <StatCard
              title="Active Security Alerts"
              value="3"
              change="Critical: 0"
              changeType="positive"
              icon="ShieldAlert"
            />
            <StatCard
              title="Incidents Under Assessment"
              value="11"
              change="4 correlated"
              changeType="neutral"
              icon="Search"
            />
            <StatCard
              title="Compliance Findings"
              value="6"
              change="Mine Zone 4 alert"
              changeType="negative"
              icon="FileCheck"
            />
          </div>
        </section>

        {/* Intelligence Modules Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Intelligence Modules (5 Workstreams)
              </h2>
              <p className="text-xs text-slate-500">
                Independent feature branches ready for modular ML integration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULE_REGISTRY.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </section>

        {/* Bottom Section: Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity */}
          <section className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Recent System Events</span>
              </h3>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                Sample Activity Log
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-slate-100 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Base Application Foundation Initialized</span>
                    <span className="text-[11px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    FastAPI backend and React frontend established with 5 modular use-case shells.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-slate-100 text-xs">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Sample Complaint Ingested</span>
                    <span className="text-[11px] text-slate-400">12m ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Municipal water supply breakdown ticket logged in queue.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md bg-slate-50/70 border border-slate-100 text-xs">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Mine Sensor Heartbeat Verified</span>
                    <span className="text-[11px] text-slate-400">25m ago</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Underground ventilation airflow telemetry nominal across shafts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sample Alerts */}
          <section className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Simulated Security & Governance Alerts</span>
              </h3>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                Sample Feed
              </span>
            </div>

            <div className="space-y-3">
              <AlertCard
                type="warning"
                title="Environmental Sensor Threshold Notice"
                message="Mine Shaft 2 dust density reading reached 2.4 mg/m³. Approaching precautionary threshold."
                timestamp="14m ago"
                isDemo={true}
              />
              <AlertCard
                type="info"
                title="Badge Access Outside Shift Schedule"
                message="Server Room Zone B accessed with Level 2 credentials during scheduled backup cycle."
                timestamp="1h ago"
                isDemo={true}
              />
              <AlertCard
                type="info"
                title="Pending Verification Queue"
                message="18 citizen identity checks require second-tier supervisory confirmation."
                timestamp="2h ago"
                isDemo={true}
              />
            </div>
          </section>
        </div>

        {/* Module Status Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Module Health & Development Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Official development status across all 5 independent branches.
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={modulesData}
            keyField="id"
          />
        </section>
      </div>
    </div>
  );
};
