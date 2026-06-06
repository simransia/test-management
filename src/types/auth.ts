export interface User {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: User;
}
