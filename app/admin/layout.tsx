import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { Brand } from "@/components/icons";
import { AdminNav } from "@/components/admin-nav";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/">
          <Brand small />
        </Link>
        <div className="sidebar-label">CONTROL CENTER</div>
        <AdminNav />
        <div className="admin-profile">
          <span className="profile-avatar">Z</span>
          <div>
            <b>{user.name}</b>
            <small>{user.email}</small>
          </div>
          <form action={logout}>
            <button className="text-button">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>
            Just Zole <span className="muted">/ Owner workspace</span>
          </span>
          <span className="admin-label">ADMINISTRATOR</span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
