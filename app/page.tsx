import Link from "next/link";
import {
  Crosshair,
  ShieldCheck,
  Zap,
  Headphones,
  MousePointer2,
  Gamepad2,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DiscordIcon } from "@/components/icons";
import { ProductShowcase } from "@/components/product-showcase";
import { getCatalog } from "@/lib/products";
import { getHomepageContent } from "@/lib/homepage";
import { HeroMotion } from "@/components/hero-motion";
import { HeroDashboard } from "@/components/hero-dashboard";
import { Reviews } from "@/components/reviews";
import { ServerRules } from "@/components/server-rules";
import { HowToUse } from "@/components/how-to-use";
import { AccentText } from "@/components/accent-text";
import { ProductQuestions } from "@/components/product-questions";
import { CombatFeatures } from "@/components/combat-features";
import { ControllerSupport } from "@/components/controller-support";
import { pageMetadata, siteDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "For Honor Scripts & Hacks",
  siteDescription,
  "/",
);

export default async function Home() {
  const content = await getHomepageContent();
  const products = content.products.visible ? await getCatalog() : [];
  const hero = content.hero.text;
  const collection = content.products.text;
  const how = content.howItWorks.text;
  const community = content.community.text;

  return (
    <div className="cyber-site">
      <Header />
      <main>
        {content.hero.visible && (
          <HeroMotion>
            <div className="hero-copy">
              <div className="eyebrow">
                <span />
                {hero.eyebrow}
              </div>
              <h1>
                {hero.titleFirst}
                <br />
                {hero.titleSecond} <em>{hero.titleAccent}</em>
              </h1>
              <p>{hero.description}</p>
              <div className="hero-buttons">
                <Link
                  className="button"
                  href={content.products.visible ? "#products" : "/products"}
                >
                  <Crosshair size={18} />
                  {hero.productsButton}
                </Link>
                <a className="button button-outline" href="/go/discord">
                  <DiscordIcon size={19} />
                  {hero.communityButton}
                </a>
              </div>
              <div className="hero-note">
                <span className="avatar-stack" aria-hidden="true">
                  <i>Z</i>
                  <i>J</i>
                  <i>
                    <Gamepad2 size={14} />
                  </i>
                </span>
                <span>{hero.note}</span>
              </div>
            </div>
            <HeroDashboard hero={hero} features={content.combatFeatures.text} />
          </HeroMotion>
        )}
        {content.benefits.visible && (
          <div className="benefit-strip">
            <div className="container benefits">
              <div>
                <ShieldCheck />
                <span>{content.benefits.text.first}</span>
              </div>
              <div>
                <Zap />
                <span>{content.benefits.text.second}</span>
              </div>
              <div>
                <Headphones />
                <span>{content.benefits.text.third}</span>
              </div>
              <div>
                <DiscordIcon />
                <span>{content.benefits.text.fourth}</span>
              </div>
            </div>
          </div>
        )}
        {content.combatFeatures.visible && (
          <CombatFeatures text={content.combatFeatures.text} />
        )}
        {content.products.visible && (
          <ProductShowcase
            products={products}
            text={collection}
            brand={content.navigation.text}
          />
        )}
        {content.controllers.visible && (
          <ControllerSupport text={content.controllers.text} />
        )}
        <ProductQuestions />
        {content.howItWorks.visible && (
          <section id="how-it-works" className="how-section">
            <div className="container">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">{how.eyebrow}</div>
                  <h2>
                    <AccentText text={how.title} />
                  </h2>
                </div>
                <p>{how.description}</p>
              </div>
              <ol className="purchase-flow">
                <li>
                  <span className="purchase-number" aria-hidden="true">
                    01
                  </span>
                  <div className="step-icon">
                    <MousePointer2 />
                  </div>
                  <h3>{how.firstTitle}</h3>
                  <p>{how.firstDescription}</p>
                </li>
                <li>
                  <span className="purchase-number" aria-hidden="true">
                    02
                  </span>
                  <div className="step-icon">
                    <DiscordIcon size={24} />
                  </div>
                  <h3>{how.secondTitle}</h3>
                  <p>{how.secondDescription}</p>
                </li>
                <li>
                  <span className="purchase-number" aria-hidden="true">
                    03
                  </span>
                  <div className="step-icon">
                    <Gamepad2 />
                  </div>
                  <h3>{how.thirdTitle}</h3>
                  <p>{how.thirdDescription}</p>
                </li>
              </ol>
            </div>
          </section>
        )}
        {content.howToUse.visible && <HowToUse text={content.howToUse.text} />}
        {content.reviews.visible && <Reviews text={content.reviews.text} />}
        {content.rules.visible && <ServerRules text={content.rules.text} />}
        {content.community.visible && (
          <section className="container">
            <div className="community-banner">
              <div className="community-mark">
                <DiscordIcon size={64} />
              </div>
              <div>
                <div className="eyebrow">{community.eyebrow}</div>
                <h2>{community.title}</h2>
                <p>{community.description}</p>
              </div>
              <a className="button" href="/go/discord">
                <DiscordIcon size={18} />
                {community.button}
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
