import Image from "next/image";
import heroImage from "@/assets/hero.png";
import { Crosshair, Gamepad2, Swords } from "lucide-react";

export function HeroDashboard() {
  return (
    <div className="hero-visual cyber-visual hero-artwork">
      <Image
        src={heroImage}
        alt="Just Zole For Honor script interface"
        sizes="(max-width: 900px) 90vw, 45vw"
        preload
      />
      <span className="cyber-float cyber-float-one" aria-hidden="true">
        <Crosshair size={24} />
      </span>
      <span className="cyber-float cyber-float-two" aria-hidden="true">
        <Gamepad2 size={24} />
      </span>
      <span className="cyber-float cyber-float-three" aria-hidden="true">
        <Swords size={20} />
      </span>
    </div>
  );
}
