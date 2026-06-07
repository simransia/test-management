import { Outlet, Link, useLocation } from "react-router";
import {
  LogOut,
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
      icon: "/icons/sidebar-icons/dash icon def.png",
      match: activePath === "/" || activePath === "/dashboard",
    },
    {
      name: "Test Creation",
      path: "/tests/create",
      icon: "/icons/sidebar-icons/create test deaf.png",
      match:
        activePath.startsWith("/tests/create") ||
        activePath.startsWith("/tests/edit") ||
        (activePath.startsWith("/tests/") && (activePath.includes("/questions") || activePath.includes("/publish"))),
    },
    {
      name: "Admin Management",
      path: "#",
      icon: "/icons/sidebar-icons/admin management def.png",
      disabled: true,
    },
    {
      name: "Resources",
      path: "#",
      icon: "/icons/sidebar-icons/resources def.png",
      disabled: true,
    },
    {
      name: "User Management",
      path: "#",
      icon: "/icons/sidebar-icons/Usermanagement def.png",
      disabled: true,
    },
    {
      name: "Approval",
      path: "#",
      icon: "/icons/sidebar-icons/approval def.png",
      disabled: true,
    },
    {
      name: "Role",
      path: "#",
      icon: "/icons/sidebar-icons/role def.png",
      disabled: true,
    },
    {
      name: "Badges",
      path: "#",
      icon: "/icons/sidebar-icons/badges def.png",
      disabled: true,
    },
    {
      name: "Payments",
      path: "#",
      icon: "/icons/sidebar-icons/payments def.png",
      disabled: true,
    },
    {
      name: "Customer Support",
      path: "#",
      icon: "/icons/sidebar-icons/customer support def.png",
      disabled: true,
    },
    {
      name: "Notification",
      path: "#",
      icon: "/icons/sidebar-icons/notification def.png",
      disabled: true,
    },
    {
      name: "Settings",
      path: "#",
      icon: "/icons/sidebar-icons/settings def.png",
      disabled: true,
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
            "absolute top-0 left-0 z-50 flex h-16 items-center border-b border-r border-slate-200 bg-white",
            sidebarCollapsed ? "w-[332px] px-6" : "w-[240px] px-6",
          )}
        >
          <img
            src="/preproute-logo.png"
            alt="Preproute"
            className="h-8 w-auto object-contain object-left"
          />
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 pt-20 pb-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.disabled ? "#" : item.path}
                className={cn(
                  "group relative flex items-center gap-3 text-sm font-bold transition-all overflow-hidden",
                  sidebarCollapsed
                    ? "justify-center px-0 py-3 mx-2 rounded-lg"
                    : "px-5 py-3 rounded-r-3xl mr-4",
                  item.match
                    ? "bg-[#f4f8ff] text-[#1b5def]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                  item.disabled && "pointer-events-none opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                {/* Active left border indicator */}
                {item.match && (
                  <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1b5def]" />
                )}
                <img
                  src={item.icon}
                  alt={item.name}
                  className={cn(
                    "h-5 w-5 shrink-0 object-contain",
                    item.match ? "" : "opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0",
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
        <header className={cn(
          "flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white pr-8 transition-all duration-200",
          sidebarCollapsed ? "pl-[292px]" : "pl-8"
        )}>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            {getBreadcrumbs()}
          </div>

          {/* Right: Bell + Profile */}
          <div className="flex items-center gap-5">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
              <img src="/icons/bell.png" className="h-5 w-5 object-contain" alt="Notifications" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-5 cursor-pointer">
              <div className="relative">
                <img
                  src="/icons/avatar.png"
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 object-cover"
                />
              </div>
              <div className="flex flex-col truncate relative pr-5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#002a5c]">
                    {displayName}
                  </span>
                  <img src="/icons/chevron-down.png" className="h-3.5 w-3.5 object-contain opacity-60" alt="Dropdown" />
                </div>
                <span className="text-[11px] font-semibold uppercase text-[#8897a8] tracking-wider">
                  {role}
                </span>
              </div>
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
