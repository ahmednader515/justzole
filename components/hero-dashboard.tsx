import Image from "next/image";
import heroImage from "@/assets/hero.png";

export function HeroDashboard() {
  return (
    <div className="hero-visual cyber-visual hero-artwork">
      <Image
        src={heroImage}
        alt="Just Zole For Honor script interface"
        sizes="(max-width: 900px) 90vw, 45vw"
        preload
      />
    </div>
  );
}
