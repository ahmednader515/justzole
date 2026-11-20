import {
  Ban,
  FileText,
  LockKeyhole,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { defaultHomepageContent } from "@/lib/homepage-defaults";
import { AccentText } from "./accent-text";

export function ServerRules({
  text = defaultHomepageContent().rules.text,
}: {
  text?: Record<string, string>;
}) {
  const groups = [
    { title: text.licenseTitle, Icon: LockKeyhole, rules: text.licenseRules },
    { title: text.generalTitle, Icon: TriangleAlert, rules: text.generalRules },
    { title: text.prohibitedTitle, Icon: Ban, rules: text.prohibitedRules },
  ];
  return (
    <section id="rules" className="rules-section" aria-labelledby="rules-title">
      <div className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <FileText size={15} aria-hidden="true" />
              {text.eyebrow}
            </div>
            <h2 id="rules-title">
              <AccentText text={text.title} />
            </h2>
            <p>{text.description}</p>
          </div>
        </div>
        <div className="policy-document">
          {groups.map(({ title, Icon, rules }, groupIndex) => (
            <article className="policy-row" key={groupIndex}>
              <div className="policy-heading">
                <span className="policy-index" aria-hidden="true">
                  0{groupIndex + 1} /
                </span>
                <span className="step-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
              </div>
              <ul>
                {rules
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((rule, index) => (
                    <li key={index}>
                      <span className="rule-text">{rule}</span>
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
        <aside className="rules-notice" aria-labelledby="rules-notice-title">
          <ShieldAlert size={25} aria-hidden="true" />
          <div>
            <h3 id="rules-notice-title">{text.noticeTitle}</h3>
            <p>
              <strong>{text.notice}</strong>
            </p>
            <p>{text.agreement}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
