export interface ApiResponse<T> {
  status: string;
  success?: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status?: string;
  message?: string;
  error?: string;
}
