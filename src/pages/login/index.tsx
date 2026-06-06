import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

const loginSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClassName =
  "h-[50px] w-full rounded-lg border border-[#60a5fa] bg-white px-4 text-base font-normal text-[#374151] placeholder-[#d1d5db] focus:border-[#5988ef] focus:outline-none focus:ring-1 focus:ring-[#5988ef] transition-colors";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await login(values);
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Invalid credentials. Please try again."));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7fbff]">
      {/* Left side — Illustration Panel (approx 47% width) */}
      <div className="hidden h-full w-[47%] shrink-0 items-center justify-center lg:flex bg-[#f7fbff]">
        <img
          src="/login-illustration.svg"
          alt="Illustration"
          className="h-[344px] w-[467px] max-w-[90%] object-contain"
        />
      </div>

      {/* Right side — Outer wrapper with margin matching the Figma proto */}
      <div className="flex h-full flex-1 items-center justify-center p-5">
        <div className="flex h-[calc(100vh-2.5rem)] w-full items-center rounded-[20px] border border-[#60a5fa] bg-white px-8 sm:px-12 lg:px-[100px]">
          <div className="w-full max-w-[510px] flex flex-col">
            {/* Logo */}
            <div className="mb-10">
              <img
                src="/preproute-logo.svg"
                alt="Preproute"
                className="h-[33px] w-[135px]"
              />
            </div>

            {/* Heading Section */}
            <div className="mb-[30px] flex flex-col gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#374151]">
                Login
              </h1>
              <p className="text-[12px] font-normal text-gray-500">
                Use your company provided Login credentials
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col"
              noValidate
            >
              {apiError && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {apiError}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* User ID Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="userId"
                    className="text-sm font-medium text-[#374151]"
                  >
                    User ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    placeholder="Enter User ID"
                    autoComplete="username"
                    aria-invalid={Boolean(errors.userId)}
                    className={inputClassName}
                    {...register("userId")}
                  />
                  {errors.userId && (
                    <p className="text-xs text-red-500 mt-1">{errors.userId.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#374151]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    className={inputClassName}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <button
                  type="button"
                  className="w-fit text-sm font-medium text-[#1b5def] hover:underline self-start -mt-2"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex h-[50px] w-full items-center justify-center rounded-lg bg-[#5988ef] px-5 text-base font-semibold text-[#fafafa] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
