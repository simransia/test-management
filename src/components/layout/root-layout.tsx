import { Outlet } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";

/**
 * Root layout wrapping all pages with Header and Footer.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
