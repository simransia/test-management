import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

export function Header() {
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

  const displayName = user?.name || user?.userId || "Alex Wando";
  const role = (user?.role as string) || "Admin";

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white pr-8 transition-all duration-200",
        sidebarCollapsed ? "pl-[292px]" : "pl-8",
      )}
    >
      <div />

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
  );
}
