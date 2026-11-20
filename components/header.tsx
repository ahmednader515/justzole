import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { Brand, DiscordIcon } from "./icons";
export async function Header() {
  const user = await currentUser();
  return (
    <>
      <div className="announcement">
        <span className="live-dot" /> YOUR NEXT ADVANTAGE STARTS HERE{" "}
        <span className="announcement-separator">/</span>{" "}
        <a href="/go/discord">
          JOIN THE JUST ZOLE COMMUNITY <DiscordIcon size={14} />
        </a>
      </div>
      <header className="site-header container">
        <Link href="/" aria-label="Just Zole home">
          <Brand />
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/products">Products</Link>
          <Link href="/#how-it-works">How it works</Link>
          <a href="/go/discord">Community</a>
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <Link
                className="account-link"
                href={user.role === "ADMIN" ? "/admin" : "/account"}
              >
                {user.role === "ADMIN" ? "Dashboard" : user.name}
              </Link>
              <form action={logout}>
                <button className="text-button">Sign out</button>
              </form>
            </>
          ) : (
            <Link className="account-link" href="/login">
              Sign in
            </Link>
          )}
          <a className="button button-small" href="/go/discord">
            <DiscordIcon size={17} /> Join Discord
          </a>
        </div>
      </header>
    </>
  );
}
