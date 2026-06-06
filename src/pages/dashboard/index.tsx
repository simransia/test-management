import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome{user?.name ? `, ${user.name}` : ""}! Test list coming in the next phase.
      </p>
      <button
        type="button"
        onClick={logout}
        className="w-fit text-sm text-primary underline-offset-4 hover:underline"
      >
        Log out
      </button>
    </div>
  );
}
