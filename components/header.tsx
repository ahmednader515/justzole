import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { Brand, DiscordIcon } from "./icons";
import { getHomepageContent } from "@/lib/homepage";
import { Youtube } from "lucide-react";
import { YOUTUBE_CHANNEL_URL } from "@/lib/social";
export async function Header() {
  const [user, content] = await Promise.all([
    currentUser(),
    getHomepageContent(),
  ]);
  const text = content.navigation.text;
  return (
    <>
      {content.announcement.visible && (
        <div className="announcement">
          <span className="live-dot" /> {content.announcement.text.message}{" "}
          <span className="announcement-separator">/</span>{" "}
          <a href="/go/discord">
            {content.announcement.text.link} <DiscordIcon size={14} />
          </a>
        </div>
      )}
      {content.navigation.visible && (
        <header className="site-header container">
          <Link href="/" aria-label="Just Zole home">
            <Brand copy={text} />
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/products">{text.products}</Link>
            {content.howItWorks.visible && (
              <Link href="/#how-it-works">{text.howItWorks}</Link>
            )}
            {content.howToUse.visible && (
              <Link href="/#how-to-use">{text.howToUse}</Link>
            )}
            {content.reviews.visible && (
              <Link href="/#reviews">{text.reviews}</Link>
            )}
            {content.rules.visible && <Link href="/#rules">{text.rules}</Link>}
            <a href="/go/discord">{text.community}</a>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link
                  className="account-link"
                  href={user.role === "ADMIN" ? "/admin" : "/account"}
                >
                  {user.role === "ADMIN" ? text.dashboard : user.name}
                </Link>
                <form action={logout}>
                  <button className="text-button">{text.signOut}</button>
                </form>
              </>
            ) : (
              <Link className="account-link" href="/login">
                {text.signIn}
              </Link>
            )}
            <a className="button button-small" href="/go/discord">
              <DiscordIcon size={17} /> {text.joinDiscord}
            </a>
            <a
              className="youtube-social-link"
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Just Zole on YouTube (opens in a new tab)"
              title="Watch Just Zole on YouTube"
            >
              <Youtube size={21} aria-hidden="true" />
            </a>
          </div>
        </header>
      )}
    </>
  );
}
