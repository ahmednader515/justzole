import Link from "next/link";
import { Plus } from "lucide-react";
export function AdminHeading({
  eyebrow = "CONTROL CENTER",
  title,
  description,
  action = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: boolean;
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
        <Link className="button" href="/admin/products/new">
          <Plus size={17} /> Add product
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
