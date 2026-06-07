import { Link, useLocation } from "react-router";
import { LayoutDashboard, FilePlus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Test Creation", href: "/tests/create", icon: FilePlus },
  { label: "Test Tracking", href: "/tests/tracking", icon: ClipboardList },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
      <div className="px-[22px] pt-[23px] pb-6">
        <img
          src="/preproute-logo.svg"
          alt="Preproute"
          className="h-[41px] w-[169px] object-contain object-left"
        />
      </div>

      <nav className="flex flex-col gap-[5px] px-0">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex h-[46px] w-full items-center ml-2 px-[20px] py-[10px] transition-colors",
                isActive
                  ? "rounded-r-lg border-l-[5px] border-[#384ec7] bg-[#f8faff] text-[#384ec7]"
                  : "text-[#6b7180] hover:bg-[#f8faff]/60",
              )}
            >
              <span className="flex items-center gap-[9px]">
                <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-base font-medium leading-[1.5]">
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
