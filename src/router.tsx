import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/components/layout";

/**
 * Application router configuration.
 * Uses lazy loading for code-split page bundles.
 */
export const router = createBrowserRouter([
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
        path: "login",
        lazy: async () => {
          const module = await import("@/pages/login");
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
]);

