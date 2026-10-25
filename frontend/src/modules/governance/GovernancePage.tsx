import React, { useState, useRef, useEffect } from 'react';
import {
  Scale,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
  Plus,
  Calendar,
  MoreVertical,
  Play,
  ArrowRight,
  FileText,
  X,
  Check,
  Edit3,
  Upload,
  Image as ImageIcon,
  Video,
  Eye,
  Trash2,
  Paperclip,
  ChevronDown,
} from 'lucide-react';

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document';
  url?: string;
  dataUrl?: string;
  date: string;
  fileSize?: string;
  description?: string;
  officer?: string;
}

interface ComplaintCase {
  id: string;
  date: string;
  dateTime: string;
  summary: string;
  fullDetails: string;
  classification: string;
  confidence: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  threatScore: number;
  status: 'Action Required' | 'Pending Review' | 'No Action Required';
  whyActionRequired: string[];
  evidenceList: EvidenceItem[];
  notes?: string[];
}

interface AuditActivity {
  id: string;
  timestamp: string;
  action: string;
  officer: string;
}

const INITIAL_CASES: ComplaintCase[] = [
  {
    id: 'MINE-2026-001',
    date: '24 Oct 2026',
    dateTime: '24 Oct 2026, 10:24 AM',
    summary: 'Methane (CH4) Exceeded 1.25% in Seam-III Face',
    fullDetails:
      'Continuous tele-monitoring methane sensor MS-04 at Seam-III working face recorded CH4 spiking to 1.38% (DGMS statutory threshold: 1.25%). Automatic district electrical power interlock tripped instantaneously.',
    classification: 'Inflammable Gas / Methane',
    confidence: 98,
    riskLevel: 'High',
    threatScore: 0.94,
    status: 'Action Required',
    whyActionRequired: [
      'DGMS Regulation 153: Inflammable gas exceeded 1.25% permissible statutory operating limit',
      'Automatic electrical power cut-off triggered on district 3.3kV feeder switchgear',
      'Ventilation overman must flush return airway and verify gas dispersal before restoration',
      'Statutory gas report Form IV must be submitted and countersigned by Mine Manager',
    ],
    evidenceList: [
      {
        id: 'ev-1',
        title: 'CH4 Telemetry Sensor MS-04 Log',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        date: '24 Oct 2026, 10:28 AM',
        fileSize: '2.4 MB',
        description: 'SCADA telemetry record showing 1.38% CH4 spike and automatic circuit trip.',
        officer: 'Overman: R. Sharma',
      },
      {
        id: 'ev-2',
        title: 'Underground Face CCTV Cam #08',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        date: '24 Oct 2026, 10:35 AM',
        fileSize: '14.8 MB',
        description: 'Infrared night-vision footage of Seam-III extraction heading during power trip.',
        officer: 'Overman: R. Sharma',
      },
      {
        id: 'ev-3',
        title: 'DGMS Form IV Statutory Gas Log',
        type: 'document',
        date: '24 Oct 2026, 11:05 AM',
        fileSize: '420 KB',
        description: 'Overman handheld multi-gas detector physical cross-verification sheet.',
        officer: 'Overman: R. Sharma',
      },
      {
        id: 'ev-4',
        title: 'Ventilation Airflow Verification',
        type: 'document',
        date: '24 Oct 2026, 11:15 AM',
        fileSize: '185 KB',
        description: 'Anemometer reading confirming 1,200 m³/min auxiliary fan output.',
        officer: 'Ventilation Officer: M. Roy',
      },
    ],
  },
  {
    id: 'MINE-2026-002',
    date: '24 Oct 2026',
    dateTime: '24 Oct 2026, 09:15 AM',
    summary: 'Roof Strata Dilation & Support Dislodgement at Gallery 14',
    fullDetails:
      'Multi-point borehole tell-tale extensometer recorded 18.4mm roof dilation exceeding 10mm alert threshold. Two adjacent mechanical roof bolts yielded under strata pressure at 5th Dip junction.',
    classification: 'Strata & Roof Control',
    confidence: 95,
    riskLevel: 'High',
    threatScore: 0.91,
    status: 'Action Required',
    whyActionRequired: [
      'Strata Control and Monitoring Plan (SCAMP) red trigger level breached',
      'Imminent risk of localized roof fall in active coal transport gallery',
      'Immediate barricading and supplementary resin bolting / props installation mandated',
    ],
    evidenceList: [
      {
        id: 'ev-201',
        title: 'Extensometer Dial & Roof Cleavage Photo',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        date: '24 Oct 2026, 09:18 AM',
        fileSize: '1.8 MB',
        description: 'Visible tension crack in immediate shale roof at 5th Dip junction.',
        officer: 'Strata Officer: P. Jena',
      },
      {
        id: 'ev-202',
        title: 'SCAMP Borehole Displacement Report',
        type: 'document',
        date: '24 Oct 2026, 09:30 AM',
        fileSize: '310 KB',
        description: 'Automated data logger export from 6m anchored magnetic ring extensometer.',
        officer: 'Strata Officer: P. Jena',
      },
    ],
  },
  {
    id: 'MINE-2026-003',
    date: '24 Oct 2026',
    dateTime: '24 Oct 2026, 08:30 AM',
    summary: 'Haul Road Dumper Proximity Alert near Sump Cut',
    fullDetails:
      'Heavy Earth Moving Machinery (HEMM) Proximity Warning System alerted 100T CAT 777D dumper encroaching within 9 meters of light utility vehicle on wet grade of North Pit haul road.',
    classification: 'HEMM & Haul Road',
    confidence: 92,
    riskLevel: 'Medium',
    threatScore: 0.65,
    status: 'Pending Review',
    whyActionRequired: [
      'DGMS circular on HEMM safety: Minimum 30m trailing distance violated',
      'Haul road GPS telematics and operator fatigue camera footage under review',
      'Inspection of haul road edge safety berm height required before next shift',
    ],
    evidenceList: [
      {
        id: 'ev-301',
        title: 'Haul Road Junction AI Camera Snapshot',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        date: '24 Oct 2026, 08:35 AM',
        fileSize: '1.9 MB',
        description: 'Radar detection overlay indicating critical proximity violation between dumper and utility jeep.',
        officer: 'Safety Officer: K. Singh',
      },
      {
        id: 'ev-302',
        title: 'HEMM Telematics Speed & Braking Log',
        type: 'document',
        date: '24 Oct 2026, 08:50 AM',
        fileSize: '240 KB',
        description: 'Brake pressure and deceleration logs extracted from vehicle CAN bus.',
        officer: 'Safety Officer: K. Singh',
      },
    ],
  },
  {
    id: 'MINE-2026-004',
    date: '23 Oct 2026',
    dateTime: '23 Oct 2026, 02:10 PM',
    summary: 'Ventilation Fan #2 Air Velocity Drop Below 0.5 m/s',
    fullDetails:
      'Stationary vane anemometer at Section B Return Airway measured air velocity dropping from 1.15 m/s to 0.42 m/s following an air-leakage flap malfunction at the shaft air-lock.',
    classification: 'Mine Ventilation',
    confidence: 96,
    riskLevel: 'High',
    threatScore: 0.88,
    status: 'Action Required',
    whyActionRequired: [
      'Coal Mines Regulation 156: Minimum air velocity in return airway breached',
      'Risk of methane and carbon monoxide pooling in working stopes and blind headings',
      'Mechanical engineering crew dispatched to overhaul air-lock door rubber seals',
    ],
    evidenceList: [
      {
        id: 'ev-401',
        title: 'Shaft Air-Lock Video Feed',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        date: '23 Oct 2026, 02:20 PM',
        fileSize: '9.4 MB',
        description: 'CCTV footage showing damaged rubber flap seal on primary shaft air-lock chamber.',
        officer: 'Ventilation Officer: M. Roy',
      },
      {
        id: 'ev-402',
        title: 'Air Velocity Trend Sensor Chart',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        date: '23 Oct 2026, 02:25 PM',
        fileSize: '1.5 MB',
        description: 'SCADA telemetry showing velocity drop below 0.5 m/s statutory threshold.',
        officer: 'Ventilation Officer: M. Roy',
      },
    ],
  },
  {
    id: 'MINE-2026-005',
    date: '23 Oct 2026',
    dateTime: '23 Oct 2026, 08:40 PM',
    summary: 'Water Sump Inflow Exceeding Drainage Rate at Incline-2',
    fullDetails:
      'Underground main sump water level reached 82% capacity after sudden seepage increase from faulted geological fracture. Dewatering pump #3 thermal overload trip.',
    classification: 'Inundation & Dewatering',
    confidence: 91,
    riskLevel: 'Medium',
    threatScore: 0.58,
    status: 'Pending Review',
    whyActionRequired: [
      'Inundation danger protocol: Reserve pumping capacity below 4-hour safety buffer',
      'Standby 150 HP turbine pump engaged manually by pump operator',
      'Hydrogeological survey required to assess fault fissure seepage rate',
    ],
    evidenceList: [
      {
        id: 'ev-501',
        title: 'Sump Water Level Telemetry Graph',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        date: '23 Oct 2026, 08:45 PM',
        fileSize: '1.2 MB',
        description: 'Acoustic level sensor reading showing accelerated water ingress curve in Incline-2.',
        officer: 'Mechanical Engineer: T. Rao',
      },
    ],
  },
  {
    id: 'MINE-2026-006',
    date: '22 Oct 2026',
    dateTime: '22 Oct 2026, 04:15 PM',
    summary: 'Miners PPE Non-Compliance: Missing Self-Rescuer (SCSR)',
    fullDetails:
      'Shift check-in biometric turnstile flagged 2 contractual timber-setters attempting descent without mandated SCSR chemical oxygen self-rescuers at pit-head lamp room.',
    classification: 'Miners PPE & Safety',
    confidence: 99,
    riskLevel: 'Low',
    threatScore: 0.22,
    status: 'No Action Required',
    whyActionRequired: [
      'Automated biometric turnstile barrier prevented descent into shaft cage',
      'Compliant Draeger Oxyboks SCSR units issued and logged in lamp room register',
      'Refresher emergency oxygen donning verification completed before entry',
    ],
    evidenceList: [
      {
        id: 'ev-601',
        title: 'Lamp Room Turnstile RFID Event Log',
        type: 'document',
        date: '22 Oct 2026, 04:20 PM',
        fileSize: '160 KB',
        description: 'Digital audit log of restricted gate entry and equipment re-allocation.',
        officer: 'Lamp Room Incharge: S. Mondal',
      },
    ],
  },
  {
    id: 'MINE-2026-007',
    date: '22 Oct 2026',
    dateTime: '22 Oct 2026, 11:30 AM',
    summary: 'Respirable Coal Dust Water Misting Inactive on Conveyor 4',
    fullDetails:
      'Optical scatter dust monitor recorded 4.8 mg/m³ airborne respirable coal dust at transfer chute #4 due to clogged misting nozzle manifold.',
    classification: 'Coal Dust & Explosives',
    confidence: 94,
    riskLevel: 'High',
    threatScore: 0.86,
    status: 'Action Required',
    whyActionRequired: [
      'DGMS Statutory limit for respirable dust (3.0 mg/m³) exceeded',
      'Heightened risk of coal dust cloud propagation and worker pneumoconiosis',
      'Transfer point water line descaled; stone dust barrier inspected',
    ],
    evidenceList: [
      {
        id: 'ev-701',
        title: 'Dust Monitor Telemetry & Chute Photo',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        date: '22 Oct 2026, 11:45 AM',
        fileSize: '2.1 MB',
        description: 'Chute optical sensor chart recording respirable dust concentration above ceiling.',
        officer: 'Dust Control Incharge: H. Murmu',
      },
    ],
  },
  {
    id: 'MINE-2026-008',
    date: '21 Oct 2026',
    dateTime: '21 Oct 2026, 01:25 PM',
    summary: 'Pre-Shift Statutory Environmental & Gas Clearance Logged',
    fullDetails:
      'Full statutory pre-shift gas testing conducted across all underground working districts. CH4: 0.06%, CO: 0 ppm, O2: 20.9%, Air quantity: 2,400 m³/min.',
    classification: 'Mine Ventilation',
    confidence: 99,
    riskLevel: 'Low',
    threatScore: 0.05,
    status: 'No Action Required',
    whyActionRequired: [
      'All atmospheric and ventilation indicators well within DGMS standard thresholds',
      'Form IV statutory register signed by Safety Overman and Mining Sirdar',
    ],
    evidenceList: [
      {
        id: 'ev-801',
        title: 'DGMS Pre-Shift Environmental Certificate',
        type: 'document',
        date: '21 Oct 2026, 01:30 PM',
        fileSize: '340 KB',
        description: 'Countersigned statutory certificate authorizing Shift-B descent.',
        officer: 'Safety Overman: D. Banerjee',
      },
    ],
  },
];

const INITIAL_AUDIT_ACTIVITIES: AuditActivity[] = [
  {
    id: 'aud-1',
    timestamp: '24 Oct 2026, 11:20 AM',
    action: 'DGMS Form IV gas exceedance alert escalated to Manager',
    officer: 'Mine Safety Officer: R. Sharma (First Class Mgr)',
  },
  {
    id: 'aud-2',
    timestamp: '24 Oct 2026, 10:45 AM',
    action: 'Strata extensometer calibration log uploaded',
    officer: 'Strata Control Officer: P. Jena',
  },
  {
    id: 'aud-3',
    timestamp: '23 Oct 2026, 04:12 PM',
    action: 'Lamp room SCSR turnout clearance signed off',
    officer: 'Safety Overman: D. Banerjee',
  },
  {
    id: 'aud-4',
    timestamp: '23 Oct 2026, 11:30 AM',
    action: 'Ventilation fan #2 emergency inspection assigned',
    officer: 'Ventilation Officer: M. Roy',
  },
];

export const GovernancePage: React.FC = () => {
  const [cases, setCases] = useState<ComplaintCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('MINE-2026-001');
  const [auditActivities, setAuditActivities] = useState<AuditActivity[]>(INITIAL_AUDIT_ACTIVITIES);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [riskFilter, setRiskFilter] = useState<string>('All Risk Levels');
  const [locationFilter, setLocationFilter] = useState<string>('All Mining Sections');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('All Dates');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const dateRangeRef = useRef<HTMLDivElement>(null);

  // Close Date Range dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target as Node)) {
        setIsDateRangeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Modal states
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [isAllEvidenceOpen, setIsAllEvidenceOpen] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState<EvidenceItem | null>(null);

  // Form states for New Incident
  const [newSummary, setNewSummary] = useState('');
  const [newClassification, setNewClassification] = useState('Inflammable Gas / Methane');
  const [newRisk, setNewRisk] = useState<'High' | 'Medium' | 'Low'>('High');
  const [officerNoteText, setOfficerNoteText] = useState('');

  // Form states for Add Evidence
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<'image' | 'video' | 'document'>('image');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [evidenceDataUrl, setEvidenceDataUrl] = useState<string | null>(null);
  const [evidenceFileName, setEvidenceFileName] = useState<string>('');
  const [evidenceFileSize, setEvidenceFileSize] = useState<string>('');
  const [evidenceUrlInput, setEvidenceUrlInput] = useState<string>('');
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [evidenceSuccessToast, setEvidenceSuccessToast] = useState<string | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Filter complaints / incidents
  const filteredCases = cases.filter((c) => {
    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All Categories' && c.classification !== categoryFilter) return false;
    if (riskFilter !== 'All Risk Levels' && c.riskLevel !== riskFilter) return false;

    // Location Filter for Coal Mines
    if (locationFilter === 'Underground Seam-III (Section A)') {
      const match =
        c.summary.toLowerCase().includes('seam') ||
        c.fullDetails.toLowerCase().includes('seam') ||
        c.summary.toLowerCase().includes('methane');
      if (!match) return false;
    } else if (locationFilter === 'Underground Gallery 14') {
      const match =
        c.summary.toLowerCase().includes('gallery') ||
        c.fullDetails.toLowerCase().includes('gallery') ||
        c.summary.toLowerCase().includes('strata') ||
        c.summary.toLowerCase().includes('roof');
      if (!match) return false;
    } else if (locationFilter === 'Surface Open Cast & Haul Road') {
      const match =
        c.summary.toLowerCase().includes('haul') ||
        c.fullDetails.toLowerCase().includes('haul') ||
        c.summary.toLowerCase().includes('dumper');
      if (!match) return false;
    } else if (locationFilter === 'Main Incline & Sump Pump #2') {
      const match =
        c.summary.toLowerCase().includes('sump') ||
        c.fullDetails.toLowerCase().includes('sump') ||
        c.fullDetails.toLowerCase().includes('inflow');
      if (!match) return false;
    } else if (locationFilter === 'Ventilation Shaft #1') {
      const match =
        c.summary.toLowerCase().includes('ventilation') ||
        c.fullDetails.toLowerCase().includes('ventilation') ||
        c.summary.toLowerCase().includes('air');
      if (!match) return false;
    }

    // Date Range Filter
    if (selectedDateRange === 'Today') {
      if (!c.date.includes('24 Oct')) return false;
    } else if (selectedDateRange === 'Yesterday') {
      if (!c.date.includes('23 Oct')) return false;
    } else if (selectedDateRange === 'Last 3 Days') {
      const isMatch = c.date.includes('24 Oct') || c.date.includes('23 Oct') || c.date.includes('22 Oct');
      if (!isMatch) return false;
    } else if (selectedDateRange === 'October 2026') {
      if (!c.date.includes('Oct 2026')) return false;
    } else if (selectedDateRange === 'Custom Range') {
      if (customStartDate || customEndDate) {
        const dayMatch = c.date.match(/(\d+)\s+Oct\s+2026/);
        if (dayMatch) {
          const caseDay = parseInt(dayMatch[1], 10);
          if (customStartDate) {
            const startDay = new Date(customStartDate).getDate();
            if (caseDay < startDay) return false;
          }
          if (customEndDate) {
            const endDay = new Date(customEndDate).getDate();
            if (caseDay > endDay) return false;
          }
        }
      }
    }

    return true;
  });

  const handleUpdateStatus = (newStatus: 'Action Required' | 'Pending Review' | 'No Action Required') => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: newStatus } : c))
    );
    // Add audit log
    const now = new Date();
    const timeString = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setAuditActivities((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: timeString,
        action: `Statutory status changed to ${newStatus}`,
        officer: 'Safety Manager (You)',
      },
      ...prev,
    ]);
    setIsUpdateStatusOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNoteText.trim()) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, notes: [...(c.notes || []), officerNoteText.trim()] }
          : c
      )
    );
    setOfficerNoteText('');
    setIsAddNoteOpen(false);
  };

  // Handle local file selection for Evidence
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect type
    if (file.type.startsWith('image/')) {
      setEvidenceType('image');
    } else if (file.type.startsWith('video/')) {
      setEvidenceType('video');
    } else {
      setEvidenceType('document');
    }

    setEvidenceFileName(file.name);
    // Calculate human readable size
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = parseFloat(sizeInMb) >= 0.1 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;
    setEvidenceFileSize(sizeStr);

    if (!evidenceTitle) {
      // Auto-populate evidence title from filename without extension
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setEvidenceTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEvidenceDataUrl(event.target?.result as string);
    };
    reader.onerror = () => {
      setEvidenceError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Submit new evidence to selectedCase
  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim()) {
      setEvidenceError('Please provide an evidence title or label.');
      return;
    }

    const finalUrl = evidenceDataUrl || evidenceUrlInput.trim();
    if (!finalUrl && evidenceType !== 'document') {
      setEvidenceError('Please select a file or provide a media URL.');
      return;
    }

    const now = new Date();
    const timeString = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: evidenceTitle.trim(),
      type: evidenceType,
      url: evidenceUrlInput.trim() || undefined,
      dataUrl: evidenceDataUrl || undefined,
      date: timeString,
      fileSize: evidenceFileSize || (evidenceType === 'video' ? '8.5 MB' : '1.8 MB'),
      description: evidenceDescription.trim() || undefined,
      officer: 'Safety Officer (You)',
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, evidenceList: [newEvidence, ...(c.evidenceList || [])] }
          : c
      )
    );

    // Prepend to audit activities
    setAuditActivities((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: timeString,
        action: `Evidence added (${newEvidence.title})`,
        officer: 'Safety Officer (You)',
      },
      ...prev,
    ]);

    // Reset evidence form
    setEvidenceTitle('');
    setEvidenceType('image');
    setEvidenceDescription('');
    setEvidenceDataUrl(null);
    setEvidenceFileName('');
    setEvidenceFileSize('');
    setEvidenceUrlInput('');
    setEvidenceError(null);
    setIsAddEvidenceOpen(false);

    // Toast
    setEvidenceSuccessToast(`Evidence "${newEvidence.title}" successfully added to ${selectedCase.id}`);
    setTimeout(() => setEvidenceSuccessToast(null), 4000);
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, evidenceList: (c.evidenceList || []).filter((e) => e.id !== evidenceId) }
          : c
      )
    );
    if (viewingEvidence?.id === evidenceId) {
      setViewingEvidence(null);
    }
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    const newId = `MINE-2026-${String(cases.length + 1).padStart(3, '0')}`;
    const newCaseItem: ComplaintCase = {
      id: newId,
      date: '25 Oct 2026',
      dateTime: '25 Oct 2026, 10:00 AM',
      summary: newSummary.trim(),
      fullDetails: newSummary.trim(),
      classification: newClassification,
      confidence: 94,
      riskLevel: newRisk,
      threatScore: newRisk === 'High' ? 0.88 : newRisk === 'Medium' ? 0.58 : 0.22,
      status: 'Action Required',
      whyActionRequired: [
        'Newly logged mine safety incident flagged for statutory DGMS verification',
        'Overman and Shift Incharge preliminary inspection pending',
      ],
      evidenceList: evidenceDataUrl
        ? [
            {
              id: `ev-${Date.now()}`,
              title: evidenceTitle.trim() || 'Attached Sensor / Inspection Evidence',
              type: evidenceType,
              dataUrl: evidenceDataUrl,
              date: '25 Oct 2026, 10:00 AM',
              fileSize: evidenceFileSize || '2.0 MB',
              description: 'Uploaded during incident logging.',
              officer: 'Shift Safety Incharge',
            },
          ]
        : [],
    };
    setCases([newCaseItem, ...cases]);
    setSelectedCaseId(newId);
    setNewSummary('');
    setEvidenceDataUrl(null);
    setEvidenceFileName('');
    setIsNewComplaintOpen(false);
  };

  // Evidence helpers for thumbnails
  const currentEvidence = selectedCase.evidenceList || [];
  const firstImage = currentEvidence.find((e) => e.type === 'image') || currentEvidence[0];
  const firstVideo = currentEvidence.find((e) => e.type === 'video');
  const displayedCount = (firstImage ? 1 : 0) + (firstVideo ? 1 : 0);
  const remainingCount = Math.max(0, currentEvidence.length - displayedCount);

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Toast Notification */}
        {evidenceSuccessToast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{evidenceSuccessToast}</span>
            <button
              type="button"
              onClick={() => setEvidenceSuccessToast(null)}
              className="ml-2 hover:opacity-80 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Header Banner for Coal Mines */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600">
                Governance & Compliance for Coal Mines
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Statutory safety monitoring, DGMS regulatory compliance, strata stability, gas threshold monitoring, and mine hazard governance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Scales / Safety icon */}
            <div className="hidden lg:flex items-center justify-center text-amber-500">
              <Scale className="w-10 h-10 stroke-[1.8]" />
            </div>

            {/* DGMS Statutory Badge */}
            <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-300/80 rounded-xl px-4 py-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-amber-950">DGMS Statutory Compliance</p>
                <p className="text-[11px] text-amber-800 font-medium">Coal Mines Regulations 2017</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric / KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Statutory Incidents */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">128</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Total Statutory Incidents</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600">↑ +12%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">This month</p>
            </div>
          </div>

          {/* Card 2: Action Required */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">42</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Critical Action Required</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-red-600">↑ +8%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">DGMS alerts</p>
            </div>
          </div>

          {/* Card 3: Compliant / Resolved */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">56</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Compliant / Cleared</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600">↑ +15%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Safety cleared</p>
            </div>
          </div>

          {/* Card 4: Pending Review */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none">30</span>
                <p className="text-xs font-semibold text-slate-500 mt-1">Pending Inspection</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-600">↓ -5%</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Overman triage</p>
            </div>
          </div>
        </div>

        {/* Main Content: Left Incident Table & Right Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table Section (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            {/* Header: Title + Log Safety Incident Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Mine Safety Oversight</h2>
                  <p className="text-xs text-slate-500">
                    Review sensor hazard classifications, gas telemetry, strata monitoring, and safety officer decisions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewComplaintOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log Safety Incident</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-1 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Action Required">Action Required</option>
                <option value="Pending Review">Pending Review</option>
                <option value="No Action Required">No Action Required</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Categories">All Hazard Categories</option>
                <option value="Inflammable Gas / Methane">Inflammable Gas / Methane</option>
                <option value="Strata & Roof Control">Strata & Roof Control</option>
                <option value="Mine Ventilation">Mine Ventilation</option>
                <option value="HEMM & Haul Road">HEMM & Haul Road</option>
                <option value="Inundation & Dewatering">Inundation & Dewatering</option>
                <option value="Coal Dust & Explosives">Coal Dust & Explosives</option>
                <option value="Miners PPE & Safety">Miners PPE & Safety</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Risk Levels">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All Mining Sections">All Mining Sections</option>
                <option value="Underground Seam-III (Section A)">Underground Seam-III (Section A)</option>
                <option value="Underground Gallery 14">Underground Gallery 14</option>
                <option value="Surface Open Cast & Haul Road">Surface Open Cast & Haul Road</option>
                <option value="Main Incline & Sump Pump #2">Main Incline & Sump Pump #2</option>
                <option value="Ventilation Shaft #1">Ventilation Shaft #1</option>
              </select>

              {/* Interactive Date Range Selector Dropdown */}
              <div className="col-span-2 sm:col-span-4 lg:col-span-1 relative" ref={dateRangeRef}>
                <button
                  type="button"
                  onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                  className={`w-full inline-flex items-center justify-between gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs ${
                    selectedDateRange !== 'All Dates'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{selectedDateRange === 'All Dates' ? 'Select Date Range' : selectedDateRange}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isDateRangeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDateRangeOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Date Range
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'All Dates', value: 'All Dates' },
                        { label: 'Today (24 Oct 2026)', value: 'Today' },
                        { label: 'Yesterday (23 Oct 2026)', value: 'Yesterday' },
                        { label: 'Last 3 Days (22 - 24 Oct)', value: 'Last 3 Days' },
                        { label: 'October 2026 (Full Month)', value: 'October 2026' },
                        { label: 'Custom Range...', value: 'Custom Range' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedDateRange(opt.value);
                            if (opt.value !== 'Custom Range') {
                              setIsDateRangeOpen(false);
                            }
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                            selectedDateRange === opt.value
                              ? 'font-semibold text-blue-600 bg-blue-50/60'
                              : 'text-slate-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedDateRange === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>

                    {selectedDateRange === 'Custom Range' && (
                      <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsDateRangeOpen(false)}
                          className="w-full mt-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                        >
                          Apply Custom Range
                        </button>
                      </div>
                    )}

                    {selectedDateRange !== 'All Dates' && (
                      <div className="px-3 py-1.5 border-t border-slate-100 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDateRange('All Dates');
                            setIsDateRangeOpen(false);
                          }}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          Clear Date Filter
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Incidents Table */}
            <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                    <th className="py-3 px-3.5">Incident ID</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Hazard / Incident Summary</th>
                    <th className="py-3 px-3">Hazard Category</th>
                    <th className="py-3 px-3">Risk Level</th>
                    <th className="py-3 px-3">Statutory Status</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((item) => {
                    const isSelected = item.id === selectedCase.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedCaseId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-50/40 font-medium'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3.5 px-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-3 text-slate-800 max-w-[200px] truncate">
                          {item.summary}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {item.classification}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.riskLevel === 'High'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : item.riskLevel === 'Medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.status === 'Action Required'
                                ? 'bg-red-50 text-red-700 border border-red-300'
                                : item.status === 'Pending Review'
                                ? 'bg-amber-50 text-amber-700 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseId(item.id);
                              setIsUpdateStatusOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                            title="Update Status"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
              <span>Showing 1 - {filteredCases.length} of 128 statutory incidents</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-2xs cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  16
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Incident Details Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            {/* Header: Incident Details + View Full Report */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Incident Details</h3>
              <button
                type="button"
                onClick={() => setIsAllEvidenceOpen(true)}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Incident ID and Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Incident ID</span>
                <span className="text-sm font-mono font-bold text-slate-900">{selectedCase.id}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedCase.status === 'Action Required'
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : selectedCase.status === 'Pending Review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}
              >
                {selectedCase.status}
              </span>
            </div>

            {/* Date & Time */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Date & Time</span>
              <span className="text-xs font-medium text-slate-800">{selectedCase.dateTime}</span>
            </div>

            {/* Incident / Hazard Details */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Statutory Hazard Details
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedCase.fullDetails}
              </p>
            </div>

            {/* AI Hazard Classification & Risk Level Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Hazard Classification
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                    {selectedCase.classification}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    {selectedCase.confidence}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Risk Level
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedCase.riskLevel === 'High'
                        ? 'bg-red-100 text-red-800'
                        : selectedCase.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedCase.riskLevel}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    Score: {selectedCase.threatScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Header & Interactive Thumbnails */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-medium">
                  Evidence & Telemetry Logs ({currentEvidence.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Add new sensor chart, CCTV clip, or inspection report to this incident"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Evidence</span>
                </button>
              </div>

              {currentEvidence.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(true)}
                  className="w-full py-3.5 px-3 border border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-amber-50/40 flex flex-col items-center justify-center text-slate-500 hover:text-amber-700 transition-colors cursor-pointer group"
                >
                  <Upload className="w-4 h-4 mb-1 text-slate-400 group-hover:text-amber-600" />
                  <span className="text-xs font-semibold">No evidence attached</span>
                  <span className="text-[10px] text-slate-400">Click to upload sensor charts, CCTV clips, or DGMS forms</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Thumbnail 1: Scene / Sensor Image */}
                  {firstImage && (
                    <div
                      onClick={() => setViewingEvidence(firstImage)}
                      className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden relative flex items-center justify-center cursor-pointer group shrink-0 shadow-2xs hover:ring-2 hover:ring-amber-500 transition-all"
                      title={firstImage.title}
                    >
                      {firstImage.dataUrl || firstImage.url ? (
                        <img
                          src={firstImage.dataUrl || firstImage.url}
                          alt={firstImage.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-mono">
                          Sensor
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Thumbnail 2: CCTV Video with Play Button */}
                  {firstVideo && (
                    <div
                      onClick={() => setViewingEvidence(firstVideo)}
                      className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden relative flex items-center justify-center group cursor-pointer shrink-0 shadow-2xs hover:ring-2 hover:ring-amber-500 transition-all"
                      title={firstVideo.title}
                    >
                      <div className="w-full h-full bg-gradient-to-tr from-blue-950 to-slate-800 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white opacity-85 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="absolute bottom-0.5 right-1 text-[7.5px] font-mono text-white/90 bg-black/60 px-0.5 rounded">
                        CCTV
                      </span>
                    </div>
                  )}

                  {/* Thumbnail 3: +X more or Add Button */}
                  {remainingCount > 0 ? (
                    <div
                      onClick={() => setIsAllEvidenceOpen(true)}
                      className="w-16 h-12 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 flex flex-col items-center justify-center text-slate-500 hover:text-amber-800 cursor-pointer shrink-0 transition-colors shadow-2xs"
                      title="View all evidence for this incident"
                    >
                      <FileText className="w-3.5 h-3.5 mb-0.5 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-600">+{remainingCount} more</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddEvidenceOpen(true)}
                      className="w-16 h-12 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-amber-50 flex flex-col items-center justify-center text-slate-400 hover:text-amber-700 transition-colors shrink-0 cursor-pointer"
                      title="Add another evidence file"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[8.5px] font-semibold">Add</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Why Action Required Callout Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Why Action Required? (Statutory Basis)</span>
              </div>
              <ul className="space-y-1 text-[11px] text-amber-900/90 pl-1">
                {selectedCase.whyActionRequired.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Officer Notes if any */}
            {selectedCase.notes && selectedCase.notes.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Safety Officer Notes</span>
                {selectedCase.notes.map((n, i) => (
                  <p key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                    {n}
                  </p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUpdateStatusOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddNoteOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>Add Officer Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Statutory Audit Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Statutory Audit Activity</h3>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {auditActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1 text-xs"
              >
                <span className="text-[10px] text-slate-400 font-mono block">{act.timestamp}</span>
                <p className="font-semibold text-slate-800 leading-snug">{act.action}</p>
                <span className="text-[11px] text-slate-500 block">{act.officer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Evidence */}
      {isAddEvidenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Incident Evidence</h3>
                  <p className="text-[11px] text-slate-500">
                    Attach sensor charts, underground camera stills, or DGMS forms to{' '}
                    <strong className="text-slate-900 font-mono">{selectedCase.id}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddEvidenceOpen(false);
                  setEvidenceError(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {evidenceError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{evidenceError}</span>
              </div>
            )}

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-4 text-xs">
              {/* Evidence Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evidence Title / Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MS-04 Gas Sensor Chart, Extensometer Displacement Log, DGMS Form IV"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Evidence Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Evidence Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEvidenceType('image')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      evidenceType === 'image'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo / Chart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceType('video')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      evidenceType === 'video'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>CCTV Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceType('document')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      evidenceType === 'document'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Statutory Doc</span>
                  </button>
                </div>
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Evidence File (Sensor Graph, CCTV Clip, PDF Report)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 bg-slate-50/50 hover:bg-amber-50/20 text-center transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    <p className="font-semibold text-slate-700">
                      Click to browse or drag & drop evidence file
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports JPG, PNG, WEBP, MP4, WEBM, PDF (up to 50MB)
                    </p>
                  </div>
                </div>

                {/* Selected File Details */}
                {evidenceFileName && (
                  <div className="mt-2.5 p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-blue-900 block truncate">
                          {evidenceFileName}
                        </span>
                        <span className="text-[10px] text-blue-700 font-mono">
                          {evidenceFileSize} • Type: {evidenceType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEvidenceFileName('');
                        setEvidenceFileSize('');
                        setEvidenceDataUrl(null);
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Or Direct Media URL */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Or Provide Direct Media URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/methane-sensor-chart.jpg"
                  value={evidenceUrlInput}
                  onChange={(e) => setEvidenceUrlInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                  <span>Quick sample presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceTitle('CH4 Gas Telemetry Curve');
                      setEvidenceType('image');
                      setEvidenceUrlInput(
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
                      );
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Sensor Graph
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceTitle('Underground Gallery CCTV Clip');
                      setEvidenceType('video');
                      setEvidenceUrlInput(
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                      );
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    CCTV Video
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Safety Officer Context / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Record sensor coordinates, calibration dates, or statutory inspection notes..."
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Attach & Save Evidence</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Single Evidence Lightbox / Player */}
      {viewingEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-2xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {viewingEvidence.type.toUpperCase()} EVIDENCE
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{viewingEvidence.title}</h3>
                <p className="text-[11px] text-slate-500">
                  Incident ID: <span className="font-mono font-semibold">{selectedCase.id}</span> • {viewingEvidence.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingEvidence(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Player / Image Display */}
            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center min-h-[240px] max-h-[55vh]">
              {viewingEvidence.type === 'video' ? (
                <video
                  src={viewingEvidence.dataUrl || viewingEvidence.url}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[50vh] rounded-lg"
                >
                  Your browser does not support the video player.
                </video>
              ) : viewingEvidence.type === 'image' ? (
                <img
                  src={viewingEvidence.dataUrl || viewingEvidence.url}
                  alt={viewingEvidence.title}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
              ) : (
                <div className="p-8 text-center text-slate-300 space-y-3">
                  <FileText className="w-12 h-12 text-amber-400 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-white">{viewingEvidence.title}</p>
                    <p className="text-xs text-slate-400 mt-1">DGMS Statutory Compliance Record / Calibration Certificate</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Metadata */}
            {viewingEvidence.description && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Investigative Context</span>
                <p>{viewingEvidence.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-mono">
                Size: {viewingEvidence.fileSize || 'Standard'} • {viewingEvidence.officer || 'Verified Officer'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteEvidence(viewingEvidence.id)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingEvidence(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: All Evidence Gallery (+X more) */}
      {isAllEvidenceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Attached Mine Safety Evidence Repository
                </h3>
                <p className="text-xs text-slate-500">
                  Incident <strong className="text-slate-900 font-mono">{selectedCase.id}</strong> —{' '}
                  {currentEvidence.length} Total Verified Records
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAllEvidenceOpen(false);
                    setIsAddEvidenceOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Evidence</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAllEvidenceOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {currentEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 overflow-hidden">
                      {ev.type === 'video' ? (
                        <Play className="w-4 h-4 fill-white text-white" />
                      ) : ev.type === 'image' && (ev.dataUrl || ev.url) ? (
                        <img
                          src={ev.dataUrl || ev.url}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{ev.date}</p>
                      {ev.description && (
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="font-mono text-slate-400 text-[10px]">
                      {ev.fileSize || 'Attached'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setViewingEvidence(ev);
                        }}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvidence(ev.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        title="Remove Evidence"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Safety Incident */}
      {isNewComplaintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Mine Safety Incident</h3>
              <button
                type="button"
                onClick={() => setIsNewComplaintOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident / Hazard Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details of sensor threshold breach, strata movement, gas detection, or equipment hazard..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hazard Category</label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Inflammable Gas / Methane">Inflammable Gas / Methane</option>
                    <option value="Strata & Roof Control">Strata & Roof Control</option>
                    <option value="Mine Ventilation">Mine Ventilation</option>
                    <option value="HEMM & Haul Road">HEMM & Haul Road</option>
                    <option value="Inundation & Dewatering">Inundation & Dewatering</option>
                    <option value="Coal Dust & Explosives">Coal Dust & Explosives</option>
                    <option value="Miners PPE & Safety">Miners PPE & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Level</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Attach Initial Evidence */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Initial Evidence (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-600 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                />
                {evidenceFileName && (
                  <p className="text-[11px] text-blue-600 font-medium mt-1 truncate">
                    Attached: {evidenceFileName} ({evidenceFileSize})
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewComplaintOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-2xs cursor-pointer"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {isUpdateStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update Incident Status</h3>
              <button
                type="button"
                onClick={() => setIsUpdateStatusOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the new statutory status for incident{' '}
              <strong className="text-slate-900 font-mono">{selectedCase.id}</strong>:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus('Action Required')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Action Required</span>
                {selectedCase.status === 'Action Required' && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('Pending Review')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Pending Review</span>
                {selectedCase.status === 'Pending Review' && <Check className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('No Action Required')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>No Action Required (Cleared)</span>
                {selectedCase.status === 'No Action Required' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Officer Note */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Safety Officer Note</h3>
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
              <p className="text-slate-600">
                Attach an operational or regulatory note to incident{' '}
                <strong className="text-slate-900 font-mono">{selectedCase.id}</strong>:
              </p>

              <textarea
                rows={3}
                required
                placeholder="Enter safety officer observations, gas flushing verification, or DGMS instructions..."
                value={officerNoteText}
                onChange={(e) => setOfficerNoteText(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddNoteOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-2xs cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
