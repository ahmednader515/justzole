import Link from "next/link";
import { Plus } from "lucide-react";
export function AdminHeading({
  eyebrow = "CONTROL CENTER",
  title,
  description,
  action = false,
  actionHref = "/admin/products/new",
  actionLabel = "Add product",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: boolean;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="admin-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <span>.</span>
        </h1>
        <p>{description}</p>
      </div>
      {action && (
        <Link className="button" href={actionHref}>
          <Plus size={17} /> {actionLabel}
        </Link>
      )}
    </div>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
export function EmptyAdmin({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-admin">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
