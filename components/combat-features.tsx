import Link from "next/link";
import { DepthScene } from "./depth-scene";
import {
  ArrowUpRight,
  Crosshair,
  MoveUpRight,
  Shield,
  Swords,
  Wind,
} from "lucide-react";

const features = [
  { key: "parry", label: "TIMING", Icon: Swords },
  { key: "block", label: "DEFENSE", Icon: Shield },
  { key: "deflect", label: "COUNTERPLAY", Icon: MoveUpRight },
  { key: "dodge", label: "MOVEMENT", Icon: Wind },
] as const;

export function CombatFeatures({ text }: { text: Record<string, string> }) {
  return (
    <section
      id="features"
      className="combat-section"
      aria-labelledby="combat-title"
    >
      <div className="container combat-layout">
        <div className="combat-intro">
          <div className="eyebrow">
            <span className="combat-dash" aria-hidden="true" />
            {text.eyebrow}
          </div>
          <p className="combat-game">FOR HONOR / FEATURE SET</p>
          <h2 id="combat-title">{text.title}</h2>
          <p className="combat-description">{text.description}</p>
          <Link href="/products" className="combat-link">
            {text.link}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <div className="combat-signature" aria-hidden="true">
            <Crosshair size={27} strokeWidth={1} />
            <span>
              PRECISION IN EVERY INPUT<span>JUST ZOLE / 04 CORE FEATURES</span>
            </span>
          </div>
        </div>
        <DepthScene className="combat-grid">
          {features.map(({ key, label, Icon }, index) => (
            <article
              className={`combat-card combat-card-${key}`}
              key={key}
              data-depth-card
            >
              <div className="combat-card-top">
                <span className="combat-icon">
                  <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="combat-index">0{index + 1} /</span>
              </div>
              <div className="combat-diagram" aria-hidden="true">
                <span />
                <Icon size={96} strokeWidth={0.6} />
              </div>
              <div className="combat-card-copy">
                <span className="combat-category">{label}</span>
                <h3>{text[`${key}Title`]}</h3>
                <p>{text[`${key}Description`]}</p>
              </div>
            </article>
          ))}
        </DepthScene>
      </div>
    </section>
  );
}
