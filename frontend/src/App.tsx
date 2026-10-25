import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Modular use-case pages (each owned by a team member)
import { ComplaintsPage } from './modules/complaints/ComplaintsPage';
import { IdentityPage } from './modules/identity/IdentityPage';
import { ThreatDetectionPage } from './modules/threat-detection/ThreatDetectionPage';
import { CrimeAnalysisPage } from './modules/crime-analysis/CrimeAnalysisPage';
import { GovernancePage } from './modules/governance/GovernancePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Main Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Module 1: Complaint Classification */}
          <Route path="complaints" element={<ComplaintsPage />} />

          {/* Module 2: Identity Verification */}
          <Route path="identity" element={<IdentityPage />} />

          {/* Module 3: Threat Detection */}
          <Route path="threat-detection" element={<ThreatDetectionPage />} />

          {/* Module 4: Crime Analysis */}
          <Route path="crime-analysis" element={<CrimeAnalysisPage />} />

          {/* Module 5: Governance & Compliance */}
          <Route path="governance" element={<GovernancePage />} />

          {/* System & Support Pages */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="system-status" element={<SettingsPage />} />
          <Route path="system-diagnostics" element={<SystemStatusPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
