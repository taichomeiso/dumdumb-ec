type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(\`\${status} \${statusText}\`);
    this.name = 'APIError';
  }
}

async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    cache = 'force-cache',
    next = { revalidate: 3600 }
  } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(response.status, response.statusText, error);
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(
      error instanceof Error ? error.message : '通信エラーが発生しました'
    );
  }
}

export const apiClient = {
  get: <T>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    fetcher<T>(url, { ...options, method: 'GET' }),
    
  post: <T>(url: string, body: any, options?: Omit<FetchOptions, 'method'>) =>
    fetcher<T>(url, { ...options, method: 'POST', body }),
    
  put: <T>(url: string, body: any, options?: Omit<FetchOptions, 'method'>) =>
    fetcher<T>(url, { ...options, method: 'PUT', body }),
    
  delete: <T>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    fetcher<T>(url, { ...options, method: 'DELETE' }),
};