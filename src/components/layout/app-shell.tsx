import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function AppShell() {
  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
