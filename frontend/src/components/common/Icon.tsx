import React from 'react';
import {
  LayoutDashboard,
  Home,
  MessageSquareText,
  MessageSquare,
  UserCheck,
  User,
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
  ChevronDown,
  Database,
  ArrowRight,
  RefreshCw,
  GitBranch,
  BarChart2,
  TrendingUp,
  Scale,
  Settings,
  Bell,
  Calendar,
  MapPin,
  FileText,
} from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Home,
  MessageSquareText,
  MessageSquare,
  UserCheck,
  User,
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
  ChevronDown,
  Database,
  ArrowRight,
  RefreshCw,
  GitBranch,
  BarChart2,
  TrendingUp,
  Scale,
  Settings,
  Bell,
  Calendar,
  MapPin,
  FileText,
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

