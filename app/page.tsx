import Link from "next/link";
import {
  Crosshair,
  ShieldCheck,
  Zap,
  Headphones,
  MessageSquare,
  MousePointer2,
  Gamepad2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DiscordIcon } from "@/components/icons";
import { Catalog } from "@/components/catalog";
import { getCatalog } from "@/lib/products";
import { HeroMotion } from "@/components/hero-motion";
export const dynamic = "force-dynamic";
export default async function Home() {
  const products = await getCatalog();
  return (
    <>
      <Header />
      <main>
        <HeroMotion>
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> THE JUST ZOLE COLLECTION
            </div>
            <h1>
              YOUR GAME.
              <br />
              YOUR <em>EDGE.</em>
            </h1>
            <p>
              Go beyond the ordinary. Discover game scripts and tools built to
              change the way you play.
            </p>
            <div className="hero-buttons">
              <Link className="button" href="#products">
                <Crosshair size={18} /> Explore products
              </Link>
              <a className="button button-outline" href="/go/discord">
                <DiscordIcon size={19} /> Join the community
              </a>
            </div>
            <div className="hero-note">
              <span className="avatar-stack">
                <i>Z</i>
                <i>J</i>
                <i>
                  <Gamepad2 size={14} />
                </i>
              </span>
              <span>
                A community for players who want <b>more.</b>
              </span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-grid" />
            <div className="visual-orbit orbit-1" />
            <div className="visual-orbit orbit-2" />
            <div className="visual-orbit orbit-3" />
            <div className="visual-cross cross-one" />
            <div className="visual-cross cross-two" />
            <span className="visual-coordinate coordinate-top">
              JZ / SYSTEM ONLINE
            </span>
            <div className="hero-z">
              Z<span />
            </div>
            <div className="visual-label">
              <span className="live-dot" /> THE ADVANTAGE IS YOURS
            </div>
            <span className="visual-coordinate coordinate-bottom">
              PLAY BEYOND LIMITS — JUST ZOLE
            </span>
          </div>
        </HeroMotion>
        <div className="benefit-strip">
          <div className="container benefits">
            <div>
              <ShieldCheck />
              <span>Made for your game</span>
            </div>
            <div>
              <Zap />
              <span>Ready for the next level</span>
            </div>
            <div>
              <Headphones />
              <span>Support on Discord</span>
            </div>
            <div>
              <DiscordIcon />
              <span>Community comes first</span>
            </div>
          </div>
        </div>
        <section id="products" className="container section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE ARSENAL</div>
              <h2>
                Find your next advantage<span>.</span>
              </h2>
              <p>
                Explore the collection. Find your fit. Make it yours on Discord.
              </p>
            </div>
            <Link className="subtle-link" href="/products">
              View all products <ChevronRight size={17} />
            </Link>
          </div>
          <Catalog products={products} compact />
        </section>
        <section id="how-it-works" className="how-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">NO COMPLICATED CHECKOUT</div>
                <h2>
                  Three steps. You’re in<span>.</span>
                </h2>
              </div>
              <p>Everything happens with our community.</p>
            </div>
            <div className="steps">
              <article>
                <div className="step-icon">
                  <MousePointer2 />
                </div>
                <h3>Find your fit</h3>
                <p>
                  Browse products, check the features, and watch available
                  showcases.
                </p>
              </article>
              <article>
                <div className="step-icon">
                  <DiscordIcon size={24} />
                </div>
                <h3>Meet us on Discord</h3>
                <p>
                  Join Just Zole and connect with the team to ask questions and
                  check availability.
                </p>
              </article>
              <article>
                <div className="step-icon">
                  <Gamepad2 />
                </div>
                <h3>Get in the game</h3>
                <p>
                  Arrange your purchase on the server and get help from the
                  people behind it.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="community-banner">
            <div className="community-mark">
              <DiscordIcon size={64} />
            </div>
            <div>
              <div className="eyebrow">MORE THAN A PRODUCT</div>
              <h2>Your next move starts here.</h2>
              <p>
                New drops, product support, and players like you. All in one
                server.
              </p>
            </div>
            <a className="button" href="/go/discord">
              <DiscordIcon size={18} /> Join Just Zole
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
