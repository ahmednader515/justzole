import Link from "next/link";
import { Brand, DiscordIcon } from "./icons";
export function Footer() {
  return (
    <footer className="container footer">
      <div>
        <Link href="/">
          <Brand small />
        </Link>
        <p>Your game. Your edge.</p>
      </div>
      <div className="footer-links">
        <Link href="/products">Explore products</Link>
        <a href="/go/discord">
          Support on Discord <DiscordIcon size={16} />
        </a>
        <Link href="/login">My account</Link>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Just Zole. All rights reserved.
        </span>
        <span>Browse here. Get it on Discord.</span>
      </div>
    </footer>
  );
}
