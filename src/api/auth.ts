import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { LoginRequest, LoginResponseData } from "@/types/auth";

export async function loginUser(credentials: LoginRequest) {
  const { data } = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    credentials,
  );
  return data;
}
