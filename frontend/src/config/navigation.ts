import { ModuleMetadata } from '../types';

export interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const MODULE_REGISTRY: ModuleMetadata[] = [
  {
    id: 'complaints',
    name: 'Smart Complaint Category Classification',
    shortName: 'Complaint Classification',
    description: 'NLP-based citizen grievance classification and priority triage.',
    path: '/complaints',
    branch: 'feature/complaints',
    developer: 'Member 1',
    iconName: 'MessageSquareText',
    apiStatus: 'active',
    mlStatus: 'not_configured',
    workflowSteps: [
      'Complaint text input',
      'Text preprocessing',
      'ML classification',
      'Predicted category',
      'Priority/confidence',
      'Complaint record',
    ],
  },
  {
    id: 'identity',
    name: 'AI Smart Identity Verification + Face Matching',
    shortName: 'Identity Verification',
    description: 'Facial similarity and biometric embedding verification decision-support.',
    path: '/identity',
    branch: 'feature/identity',
    developer: 'Member 2',
    iconName: 'UserCheck',
    apiStatus: 'active',
    mlStatus: 'not_configured',
    workflowSteps: [
      'Reference image + verification image',
      'Face detection',
      'Embedding comparison',
      'Similarity result',
      'Human review',
    ],
  },
  {
    id: 'threat-detection',
    name: 'Physical Security Threat Detection for Critical IT Infrastructure',
    shortName: 'Threat Detection',
    description: 'Multi-sensor and video stream anomaly detection for IT facilities.',
    path: '/threat-detection',
    branch: 'feature/threat-detection',
    developer: 'Member 3',
    iconName: 'ShieldAlert',
    apiStatus: 'active',
    mlStatus: 'not_configured',
    workflowSteps: [
      'Event/source input',
      'Feature extraction',
      'Threat model',
      'Risk score',
      'Alert',
      'Analyst review',
    ],
  },
  {
    id: 'crime-analysis',
    name: 'Crime Scene Evidence Analysis + Incident Risk Assessment',
    shortName: 'Crime Analysis',
    description: 'Multi-factor incident risk assessment and evidence correlation.',
    path: '/crime-analysis',
    branch: 'feature/crime-analysis',
    developer: 'Member 4',
    iconName: 'Search',
    apiStatus: 'active',
    mlStatus: 'not_configured',
    workflowSteps: [
      'Evidence intake',
      'Evidence metadata',
      'Analysis pipeline',
      'Incident assessment',
      'Risk indicators',
      'Investigator review',
    ],
  },
  {
    id: 'governance',
    name: 'Smart Governance & Compliance Monitoring for Coal Mines',
    shortName: 'Governance & Compliance',
    description: 'Sensor threshold compliance and safety violation prediction in mines.',
    path: '/governance',
    branch: 'feature/governance',
    developer: 'Member 5',
    iconName: 'FileCheck',
    apiStatus: 'active',
    mlStatus: 'not_configured',
    workflowSteps: [
      'Inspection/compliance information',
      'Validation',
      'Compliance rules',
      'ML/risk analysis',
      'Violation indicators',
      'Compliance report',
    ],
  },
];

export const SIDEBAR_NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    ],
  },
  {
    title: 'Intelligence Modules',
    items: MODULE_REGISTRY.map((mod) => ({
      name: mod.shortName,
      path: mod.path,
      icon: mod.iconName,
    })),
  },
  {
    title: 'System',
    items: [
      { name: 'System Status', path: '/system-status', icon: 'Activity' },
      { name: 'About Project', path: '/about', icon: 'Info' },
    ],
  },
];
