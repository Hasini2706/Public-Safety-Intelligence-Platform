import { ApiResponse, HealthCheckResponse } from '../types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  }
  return 'http://localhost:8000';
};

class ApiService {
  public getBaseUrl(): string {
    return getApiBaseUrl();
  }

  /**
   * Health check to test backend API connectivity.
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/v1/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Health check HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Backend health check failed:', error);
      throw error;
    }
  }

  /**
   * Fetch registered modules and their ML model status.
   */
  async getModules(): Promise<ApiResponse<{ total_modules: number; modules: any[] }>> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/v1/modules`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error.message || 'Unable to communicate with API server',
        },
      };
    }
  }

  /**
   * Generic request wrapper for module developers to call their backend endpoints.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.getBaseUrl()}/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `Server returned status ${response.status}`,
          },
        };
      }

      const text = await response.text();
      return {
        success: true,
        data: text as unknown as T,
      };
    } catch (error: any) {
      const isConnectionRefused =
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Network request failed');

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: isConnectionRefused
            ? 'Cannot connect to backend server. Please verify the API backend is running on port 8000.'
            : (error.message || 'Network request failed'),
        },
      };
    }
  }
}

export const api = new ApiService();
