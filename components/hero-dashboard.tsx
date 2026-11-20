import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  Crosshair,
  Gamepad2,
  MoveUpRight,
  Shield,
  Swords,
  Wind,
} from "lucide-react";

export function HeroDashboard({
  hero,
  features,
}: {
  hero: Record<string, string>;
  features: Record<string, string>;
}) {
  const rows = [
    { Icon: Swords, title: features.parryTitle, label: "TIMING" },
    { Icon: Shield, title: features.blockTitle, label: "DEFENSE" },
    { Icon: MoveUpRight, title: features.deflectTitle, label: "COUNTERPLAY" },
    { Icon: Wind, title: features.dodgeTitle, label: "MOVEMENT" },
  ];
  return (
    <div className="hero-visual cyber-visual" aria-hidden="true">
      <div className="cyber-reticle" />
      <div className="cyber-monitor">
        <div className="cyber-monitor-bar">
          <span className="cyber-window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{hero.visualTop}</span>
          <Crosshair size={14} />
        </div>
        <div className="cyber-monitor-content">
          <div className="cyber-monitor-brand">
            <Image
              className="dashboard-logo"
              src={logo}
              alt=""
              width={72}
              height={72}
              sizes="72px"
            />
            <div>
              JUST ZOLE<small>FOR HONOR / SCRIPT COLLECTION</small>
            </div>
          </div>
          <div className="cyber-command">
            <span>&gt;</span> choose_your_advantage
            <span className="cyber-caret">_</span>
          </div>
          <div className="cyber-dashboard-rows">
            {rows.map(({ Icon, title, label }, index) => (
              <div className="cyber-dashboard-row" key={label}>
                <span className="cyber-dashboard-icon">
                  <Icon size={17} />
                </span>
                <span>{title}</span>
                <small>{label}</small>
                <span className="cyber-row-index">0{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="cyber-monitor-status">
            <span className="live-dot" />
            {hero.visualLabel}
          </div>
        </div>
        <div className="cyber-monitor-base">
          {hero.visualBottom}
          <span>JZ / 01</span>
        </div>
      </div>
      <span className="cyber-float cyber-float-one">
        <Crosshair size={24} />
      </span>
      <span className="cyber-float cyber-float-two">
        <Gamepad2 size={24} />
      </span>
      <span className="cyber-float cyber-float-three">
        <Swords size={20} />
      </span>
    </div>
  );
}
