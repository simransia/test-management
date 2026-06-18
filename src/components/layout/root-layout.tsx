import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function RootLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7fbff]">
      {/* ── Left Sidebar ── */}
      <Sidebar />

      {/* ── Main Area ── */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

