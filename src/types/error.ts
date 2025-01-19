export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export const isErrorResponse = (error: unknown): error is ErrorResponse => {
  return typeof error === 'object' && error !== null && 'message' in error;
};