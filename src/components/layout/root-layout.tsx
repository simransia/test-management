import { Outlet, Link, useLocation } from "react-router";
import {
  TrendingUp,
  Edit3,
  ClipboardList,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

export function RootLayout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const sidebarCollapsed = useTestStore((s) => s.sidebarCollapsed);

  const activePath = location.pathname;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: TrendingUp,
      match: activePath === "/" || activePath === "/dashboard",
    },
    {
      name: "Test Creation",
      path: "/tests/create",
      icon: Edit3,
      match:
        activePath.startsWith("/tests/create") ||
        activePath.startsWith("/tests/edit") ||
        activePath.startsWith("/tests/") && (activePath.includes("/questions") || activePath.includes("/publish")),
    },
    {
      name: "Test Tracking",
      path: "/tests/track",
      icon: ClipboardList,
      match: activePath.startsWith("/tests/track"),
    },
  ];

  const displayName = user?.name || user?.userId || "Alex Wando";
  const role = (user?.role as string) || "Admin";

  const getBreadcrumbs = () => {
    if (activePath.includes("/publish")) {
      return (
        <>
          <span>Test Creation</span>
          <span className="text-slate-300">/</span>
          <span>Create Test</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Publish</span>
        </>
      );
    }
    if (activePath.includes("/questions")) {
      return (
        <>
          <span>Test Creation</span>
          <span className="text-slate-300">/</span>
          <span>Create Test</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Add Questions</span>
        </>
      );
    }
    if (activePath.startsWith("/tests/create")) {
      return (
        <>
          <span>Test Creation</span>
          <span className="text-slate-300">/</span>
          <span>Create Test</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Chapter Wise</span>
        </>
      );
    }
    if (activePath.startsWith("/tests/edit")) {
      return (
        <>
          <span>Test Creation</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Edit Test</span>
        </>
      );
    }
    return (
      <>
        <span>Dashboard</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800">Test List</span>
      </>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7fbff]">
      {/* ── Left Sidebar ── */}
      <aside
        className={cn(
          "relative flex h-full shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-200",
          sidebarCollapsed ? "w-[72px]" : "w-[240px]",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-100",
            sidebarCollapsed ? "justify-center px-2" : "px-5",
          )}
        >
          {sidebarCollapsed ? (
            <img
              src="/preproute-logo.png"
              alt="Preproute"
              className="h-8 w-8 object-contain object-left"
            />
          ) : (
            <img
              src="/preproute-logo.png"
              alt="Preproute"
              className="h-8 w-auto object-contain object-left"
            />
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group relative flex items-center gap-3 text-sm font-bold transition-all overflow-hidden",
                  sidebarCollapsed
                    ? "justify-center px-0 py-3 mx-2 rounded-lg"
                    : "px-5 py-3 rounded-r-3xl mr-4",
                  item.match
                    ? "bg-[#f4f8ff] text-[#1b5def]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                )}
              >
                {/* Active left border indicator */}
                {item.match && (
                  <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1b5def]" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    item.match
                      ? "text-[#1b5def]"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-white py-2.5 text-xs font-semibold text-red-600 shadow-xs transition-colors hover:bg-red-50",
              sidebarCollapsed && "px-0",
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            {getBreadcrumbs()}
          </div>

          {/* Right: Bell + Profile */}
          <div className="flex items-center gap-5">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
                alt="Avatar"
                className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100"
              />
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-800">
                  {displayName}
                </span>
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  {role}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
