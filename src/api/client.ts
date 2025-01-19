import { APIError } from '@/types/error';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10秒

class ApiClient {
  private async fetchWithTimeout(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new APIError(
          data.message || 'API request failed',
          response.status,
          data.code
        );
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    return response.json();
  }

  async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.json();
  }

  async patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.fetchWithTimeout(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.json();
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();