import { Link, useLocation } from "react-router";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";
import { DashIcon } from "@/assets/dash-icon";
import { CreationIcon } from "@/assets/creation-icon";
import { TrackIcon } from "@/assets/track-icon";

export function Sidebar() {
  const location = useLocation();
  const sidebarCollapsed = useTestStore((s) => s.sidebarCollapsed);
  const activePath = location.pathname;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: DashIcon,
      match: activePath === "/" || activePath === "/dashboard",
    },
    {
      name: "Test Creation",
      path: "/creation/create",
      icon: CreationIcon,
      match:
        activePath.startsWith("/creation/create") ||
        activePath.startsWith("/creation/edit") ||
        (activePath.startsWith("/creation/") &&
          (activePath.includes("/questions") ||
            activePath.includes("/publish"))),
    },
    {
      name: "Test Tracking",
      path: "/creation/tracking",
      icon: TrackIcon,
      match: activePath.startsWith("/creation/tracking"),
    },
  ];

  return (
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
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              style={{ width: sidebarCollapsed ? "100%" : "auto" }}
              className="relative ml-1"
            >
              {/* Active left border indicator */}
              {item.match && !sidebarCollapsed && (
                <span className="absolute left-0 rotate-180 top-0 bottom-0 w-[12px] bg-primary-accent rounded-r-2xl" />
              )}
              <Link
                to={item.path}
                className={cn(
                  "group relative flex items-center gap-3 text-sm font-bold transition-all overflow-hidden",
                  sidebarCollapsed
                    ? "justify-center px-0 py-3 mx-2 rounded-lg"
                    : "pl-2 pr-4 py-2.5 rounded-lg mx-1",
                  item.match
                    ? "bg-[#f4f8ff] text-primary-accent"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    item.match
                      ? "text-primary-accent"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
