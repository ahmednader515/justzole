import Image from "next/image";
import { ArrowUpRight, Check, Gamepad2 } from "lucide-react";
import playstation from "@/assets/ZOLE_CONTROLLER_PLAYSTATION.png";
import xbox from "@/assets/ZOLE_CONTROLLER_XBOX.png";
import gamesir from "@/assets/ZOLE_CONTROLLER_GAMESIR.png";
import { AccentText } from "./accent-text";

const controllers = [
  { key: "playstation", image: playstation },
  { key: "xbox", image: xbox },
  { key: "gamesir", image: gamesir },
] as const;

export function ControllerSupport({ text }: { text: Record<string, string> }) {
  return (
    <section
      id="controllers"
      className="container controller-section"
      aria-labelledby="controller-title"
    >
      <div className="controller-heading">
        <div className="eyebrow">
          <Gamepad2 size={17} aria-hidden="true" />
          {text.eyebrow}
        </div>
        <h2 id="controller-title">
          <AccentText text={text.title} />
        </h2>
        <p>{text.description}</p>
      </div>
      <div className="controller-grid">
        {controllers.map(({ key, image }, index) => (
          <article className={`controller-card controller-${key}`} key={key}>
            <div className="controller-card-header">
              <span className="controller-number">
                0{index + 1} / CONTROLLER
              </span>
              <span className="controller-supported">
                <Check size={12} aria-hidden="true" />
                {text.supported}
              </span>
            </div>
            <div className="controller-stage">
              <div className="controller-orbit" aria-hidden="true" />
              <Image
                src={image}
                alt={`${text[key]} controller`}
                sizes="(max-width: 640px) 85vw, (max-width: 900px) 44vw, 30vw"
              />
            </div>
            <div className="controller-card-footer">
              <h3>{text[key]}</h3>
              <Gamepad2 size={21} strokeWidth={1.3} aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
      <div className="controller-bottom">
        <p>
          <span aria-hidden="true" />
          {text.footer}
        </p>
        <a href="/go/discord">
          {text.supportLink}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
