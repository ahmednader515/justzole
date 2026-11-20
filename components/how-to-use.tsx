import { Gamepad2, Play, Zap } from "lucide-react";
import { defaultHomepageContent } from "@/lib/homepage-defaults";

export function HowToUse({
  text = defaultHomepageContent().howToUse.text,
}: {
  text?: Record<string, string>;
}) {
  return (
    <section
      id="how-to-use"
      className="setup-section"
      aria-labelledby="setup-title"
    >
      <div className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <Zap size={15} aria-hidden="true" /> {text.eyebrow}
            </div>
            <h2 id="setup-title">{text.title}</h2>
          </div>
        </div>
        <ol className="setup-steps">
          <li>
            <span className="setup-number" aria-hidden="true">
              {text.firstNumber}
            </span>
            <span className="step-icon">
              <Play size={20} aria-hidden="true" />
            </span>
            <h3>{text.firstTitle}</h3>
          </li>
          <li>
            <span className="setup-number" aria-hidden="true">
              {text.secondNumber}
            </span>
            <span className="step-icon">
              <Gamepad2 size={20} aria-hidden="true" />
            </span>
            <h3>{text.secondTitle}</h3>
          </li>
        </ol>
        <p className="setup-finish">
          <strong>{text.finish}</strong>
        </p>
      </div>
    </section>
  );
}
