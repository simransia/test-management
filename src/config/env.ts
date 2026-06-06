const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined");
}

export const env = {
  apiUrl,
  appTitle: import.meta.env.VITE_APP_TITLE ?? "Preproute",
} as const;
