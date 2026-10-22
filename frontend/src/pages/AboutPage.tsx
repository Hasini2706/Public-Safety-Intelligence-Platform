import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { GitBranch, Shield, Users, AlertCircle } from 'lucide-react';
import { MODULE_REGISTRY } from '../config/navigation';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <PageHeader
        title="About Public Safety & Governance Intelligence Platform"
        description="Comprehensive architecture and collaborative development guide for 5-member engineering team."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Project Mission */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Integrated Public Safety, Physical Security & Governance Intelligence Platform
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                This enterprise decision-support system brings together five specialized machine learning use cases under
                a unified, modular monorepo. Built for academic research and government-grade intelligence operations, the
                platform demonstrates how independent ML engineering tracks can harmoniously converge into a single, cohesive
                production experience without merge conflicts.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Member Independent Collaboration Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Team Ownership & Workstream Allocation</span>
            </h3>
            <div className="space-y-3 text-xs">
              {MODULE_REGISTRY.map((mod, idx) => (
                <div key={mod.id} className="p-3 rounded-md bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      Module {idx + 1}: {mod.shortName}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                      Branch: {mod.branch}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[11px]">
                    {mod.developer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <span>Merge-Conflict Prevention Protocol</span>
              </h3>
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  To enable five developers to work simultaneously with AI tools (Gemini, Claude, Copilot) without merge
                  hell, strict folder boundaries are enforced:
                </p>
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-semibold block">Protected Shared Files (Do NOT Casually Modify):</span>
                  <code className="block text-[11px] font-mono text-amber-800">
                    App.tsx, main.tsx, main.py, package.json, requirements.txt, layouts/
                  </code>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-semibold block">Member Safe Edit Zones:</span>
                  <code className="block text-[11px] font-mono text-emerald-800">
                    frontend/src/modules/&lt;module&gt;/<br />
                    backend/app/modules/&lt;module&gt;/<br />
                    ml/&lt;module&gt;/
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Rule: Never commit directly to main. Always branch from main and submit Pull Requests.
            </div>
          </div>
        </div>

        {/* Responsible AI Principles */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Responsible AI & Decision-Support Principles</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">Human-in-the-Loop</span>
              <p>Algorithms provide probabilistic cues; human experts always retain final decision and signoff authority.</p>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">No Guilt Claims</span>
              <p>Crime analysis outputs are forensic triage indicators, never automated determinations of guilt or liability.</p>
            </div>
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800 block mb-1">Synthetic Data Development</span>
              <p>Real biometric or sensitive citizen data must never be committed to source control.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
