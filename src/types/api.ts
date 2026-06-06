export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  status?: string;
  message?: string;
  error?: string;
}
