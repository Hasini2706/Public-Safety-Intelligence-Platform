export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
}

export interface ModuleMetadata {
  id: string;
  name: string;
  shortName: string;
  description: string;
  path: string;
  branch: string;
  developer: string;
  iconName: string;
  apiStatus: 'active' | 'offline' | 'degraded';
  mlStatus: 'not_configured' | 'foundation_ready' | 'ready' | 'error';
  workflowSteps: string[];
}
