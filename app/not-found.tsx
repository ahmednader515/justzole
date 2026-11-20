import Link from "next/link";
export default function NotFound() {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">404 / OFF THE MAP</div>
        <h1>Nothing here. Yet.</h1>
        <p>This page or product is no longer available.</p>
        <Link className="button" href="/products">
          Explore products
        </Link>
      </div>
    </main>
  );
}
