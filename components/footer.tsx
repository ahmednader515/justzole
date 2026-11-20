import Link from "next/link";
import { Brand, DiscordIcon } from "./icons";
import { getHomepageContent } from "@/lib/homepage";
export async function Footer() {
  const content = await getHomepageContent();
  if (!content.footer.visible) return null;
  const text = content.footer.text;
  return (
    <footer className="container footer">
      <div>
        <Link href="/">
          <Brand small copy={content.navigation.text} />
        </Link>
        <p>{text.tagline}</p>
      </div>
      <div className="footer-links">
        <Link href="/products">{text.products}</Link>
        {content.howToUse.visible && (
          <Link href="/#how-to-use">{text.howToUse}</Link>
        )}
        {content.reviews.visible && (
          <Link href="/#reviews">{text.reviews}</Link>
        )}
        {content.rules.visible && <Link href="/#rules">{text.rules}</Link>}
        <a href="/go/discord">
          {text.support} <DiscordIcon size={16} />
        </a>
        <Link href="/login">{text.account}</Link>
      </div>
      <div className="footer-bottom">
        <span>
          {text.copyright.replaceAll(
            "{year}",
            String(new Date().getFullYear()),
          )}
        </span>
        <span>{text.note}</span>
      </div>
    </footer>
  );
}
