"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ChartNoAxesCombined,
  Users,
  ExternalLink,
  MessageSquare,
  PanelsTopLeft,
} from "lucide-react";
export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {[
        { href: "/admin", name: "Overview", Icon: LayoutDashboard },
        { href: "/admin/homepage", name: "Homepage", Icon: PanelsTopLeft },
        { href: "/admin/products", name: "Products", Icon: Package },
        { href: "/admin/reviews", name: "Reviews", Icon: MessageSquare },
        { href: "/admin/sales", name: "Sales", Icon: ChartNoAxesCombined },
        {
          href: "/admin/analytics",
          name: "Analytics",
          Icon: ChartNoAxesCombined,
        },
        { href: "/admin/users", name: "Users", Icon: Users },
      ].map(({ href, name, Icon }) => (
        <Link
          key={href}
          href={href}
          className={
            (href === "/admin" ? path === href : path.startsWith(href))
              ? "active"
              : ""
          }
        >
          <Icon size={18} />
          {name}
        </Link>
      ))}
      <Link href="/" className="view-store">
        <ExternalLink size={18} /> View catalog
      </Link>
    </nav>
  );
}
