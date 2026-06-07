import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

function getInitials(name?: string): string {
  if (!name) return "A";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopNav() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || user?.userId || "Admin";
  const role = (user?.role as string) || "Admin";

  return (
    <header className="flex h-[92px] shrink-0 items-center justify-end border-b border-[#e5e7eb] bg-white px-[21px] py-5">
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex size-12 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#6b7180] transition-colors hover:bg-[#f8faff]"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-[9px]"
          >
            <div className="flex size-12 items-center justify-center rounded-full border border-[#6366f1] bg-[#ffd284] text-sm font-semibold text-[#374151]">
              {getInitials(displayName)}
            </div>
            <div className="flex flex-col items-start gap-1 text-left">
              <span className="text-xl font-semibold leading-[1.5] text-[#374151]">
                {displayName}
              </span>
              <span className="text-xs leading-[1.5] text-[#374151]">{role}</span>
            </div>
            <ChevronDown className="size-6 text-[#6b7180]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f8faff]"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
