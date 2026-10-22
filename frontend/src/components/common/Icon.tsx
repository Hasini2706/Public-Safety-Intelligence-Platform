import React from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  UserCheck,
  ShieldAlert,
  Search,
  FileCheck,
  Activity,
  Info,
  Shield,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  MessageSquareText,
  UserCheck,
  ShieldAlert,
  Search,
  FileCheck,
  Activity,
  Info,
  Shield,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  RefreshCw,
  GitBranch,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const Component = iconMap[name] || HelpCircle;
  return <Component className={className} size={size} />;
};
