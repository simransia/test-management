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
      disabled: true,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-all duration-200",
        sidebarCollapsed ? "w-[46px]" : "w-[240px]",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "absolute top-0 left-0 z-50 flex h-16 items-center border-r px-6 border-b border-[#E5E7EB] bg-white w-[240px]",
          // sidebarCollapsed ? "w-[332px] px-6" : "w-[240px] px-6",
        )}
      >
        <img
          src="/preproute-logo.png"
          alt="Preproute"
          className="h-8 w-auto object-contain object-left"
        />
      </div>

      {/* Nav items */}
      <nav className={`flex-1 space-y-1 pt-20 pb-5 justify-center`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              style={{
                width: sidebarCollapsed ? "43px" : "auto",
              }}
              className={`relative ${sidebarCollapsed ? "" : "ml-1"}`}
            >
              {/* Active left border indicator */}
              {item.match && !sidebarCollapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 rotate-180 h-[calc(100%-2px)] bottom-0 w-[12px] bg-primary-accent rounded-r-[8px]" />
              )}
              <Link
                to={item.disabled ? "#" : item.path}
                className={cn(
                  "group relative flex items-center gap-3 text-base font-medium transition-all overflow-hidden",
                  sidebarCollapsed
                    ? "justify-center px-px py-3 rounded-lg"
                    : "pl-2 pr-4 py-2.5 rounded-l-md rounded-r-[8px] mx-1",
                  item.match
                    ? "bg-[#f4f8ff] text-primary-accent"
                    : "text-[#6B7180] hover:bg-slate-50 hover:text-slate-600",
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
