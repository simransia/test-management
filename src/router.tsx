import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/components/layout";
import { AuthLayout } from "@/components/layout/auth-layout";
import { GuestRoute } from "@/components/auth/guest-route";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Application router configuration.
 * Uses lazy loading for code-split page bundles.
 */
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: "login",
            lazy: async () => {
              const module = await import("@/pages/login");
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            lazy: async () => {
              const module = await import("@/pages/dashboard");
              return { Component: module.default };
            },
          },
          {
            path: "tests/create",
            lazy: async () => {
              const module = await import("@/pages/tests/create");
              return { Component: module.default };
            },
          },
          {
            path: "tests/edit/:testId",
            lazy: async () => {
              const module = await import("@/pages/tests/edit");
              return { Component: module.default };
            },
          },
          {
            path: "tests/:testId/questions",
            lazy: async () => {
              const module = await import("@/pages/tests/questions");
              return { Component: module.default };
            },
          },
          {
            path: "tests/:testId/publish",
            lazy: async () => {
              const module = await import("@/pages/tests/publish");
              return { Component: module.default };
            },
          },
          {
            path: "*",
            lazy: async () => {
              const module = await import("@/pages/not-found");
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
