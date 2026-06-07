import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

export function RootLayout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const sidebarCollapsed = useTestStore((s) => s.sidebarCollapsed);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activePath = location.pathname;

  const menuItems: {
    name: string;
    path: string;
    icon: string;
    match: boolean;
    disabled?: boolean;
  }[] = [
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
        (activePath.startsWith("/tests/") &&
          (activePath.includes("/questions") ||
            activePath.includes("/publish"))),
    },
    {
      name: "Test Tracking",
      path: "/tests/tracking",
      icon: "clipboard-search",
      match: activePath.startsWith("/tests/tracking"),
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
            "absolute top-0 left-0 z-50 flex h-16 items-center border-r border-slate-200 bg-white",
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
            return (
              <div
                style={{ width: sidebarCollapsed ? "100%" : "auto" }}
                className="relative ml-1"
              >
                {/* Active left border indicator */}
                {item.match && !sidebarCollapsed && (
                  <span className="absolute left-0 rotate-180 top-0 bottom-0 w-[12px] bg-[#1b5def] rounded-r-2xl" />
                )}
                <Link
                  key={item.name}
                  to={item.disabled ? "#" : item.path}
                  className={cn(
                    "group relative flex items-center gap-3 text-sm font-bold transition-all overflow-hidden",
                    sidebarCollapsed
                      ? "justify-center px-0 py-3 mx-2 rounded-lg"
                      : "pl-2 pr-4 py-2.5 rounded-lg mx-1",
                    item.match
                      ? "bg-[#f4f8ff] text-[#1b5def]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    item.disabled &&
                      "pointer-events-none opacity-50 cursor-not-allowed",
                  )}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  {item.icon === "clipboard-search" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        item.match
                          ? "text-[#1b5def]"
                          : "text-slate-400 group-hover:text-slate-600",
                      )}
                    >
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <circle cx="14" cy="14" r="3" />
                      <path d="M20 20l-2.5-2.5" />
                    </svg>
                  ) : (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={cn(
                        "h-5 w-5 shrink-0",
                        item.match
                          ? ""
                          : "opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0",
                      )}
                    />
                  )}
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        {/* <div className="border-t border-slate-100 p-3">
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
        </div> */}
      </aside>

      {/* ── Main Area ── */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header
          className={cn(
            "flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white pr-8 transition-all duration-200",
            sidebarCollapsed ? "pl-[292px]" : "pl-8",
          )}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            {getBreadcrumbs()}
          </div>

          {/* Right: Bell + Profile */}
          <div className="flex items-center gap-5">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
              <img
                src="/icons/bell.png"
                className="h-5 w-5 object-contain"
                alt="Notifications"
              />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
            </button>

            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 border-l border-slate-200 pl-5 cursor-pointer select-none"
              >
                <div className="relative">
                  <img
                    src="/icons/avatar.png"
                    alt="Avatar"
                    className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 object-cover"
                  />
                </div>
                <div className="flex flex-col truncate pr-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#002a5c]">
                      {displayName}
                    </span>
                    <img
                      src="/icons/chevron-down.png"
                      className={cn(
                        "h-3.5 w-3.5 object-contain opacity-60 transition-transform duration-200",
                        dropdownOpen && "rotate-180",
                      )}
                      alt="Dropdown"
                    />
                  </div>
                  <span className="text-[11px] font-semibold uppercase text-[#8897a8] tracking-wider">
                    {role}
                  </span>
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-100 bg-white p-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
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
