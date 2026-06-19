import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Input, Label, Button } from "@/components/ui";

const loginSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
      setApiError(
        getApiErrorMessage(error, "Invalid credentials. Please try again."),
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left side — Illustration Panel (approx 47% width) */}
      <div className="hidden h-full w-[47%] shrink-0 items-center justify-center lg:flex bg-background">
        <img
          src="/login-illustration.svg"
          alt="Illustration"
          className="h-[344px] w-[467px] max-w-[90%] object-contain"
        />
      </div>

      {/* Right side — Outer wrapper with margin matching the Figma proto */}
      <div className="flex h-full flex-1 items-center justify-center p-5">
        <div className="flex h-[calc(100vh-2.5rem)] w-full items-center rounded-[8px] border-[0.5px] border-[#60a5fa] bg-white px-8 sm:px-12 lg:px-[100px]">
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
            <div className="mb-[30px] flex flex-col gap-5">
              <h1 className="text-[20px] font-semibold tracking-tight text-secondary">
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
                  <Label htmlFor="userId" variant="login">
                    User ID
                  </Label>
                  <Input
                    id="userId"
                    // variant="login"
                    type="text"
                    placeholder="Enter User ID"
                    autoComplete="username"
                    className="h-[48px]"
                    aria-invalid={Boolean(errors.userId)}
                    {...register("userId")}
                  />
                  {errors.userId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.userId.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" variant="login">
                    Password
                  </Label>
                  <Input
                    id="password"
                    // variant="login"
                    type="password"
                    className="h-[48px]"
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <Button
                  type="button"
                  variant="link"
                  className="w-fit text-sm text-[#1B5DEF] hover:underline self-start -mt-2 p-0 cursor-pointer"
                >
                  Forgot password?
                </Button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-7.5 flex h-[50px] w-full items-center justify-center rounded-lg bg-[#5988EF] hover:bg-primary/90 text-base text-[#fafafa] transition-opacity disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
