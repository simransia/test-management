import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-[#f7fbff]">
      <Outlet />
    </div>
  );
}
