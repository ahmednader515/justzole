import Image from "next/image";
import logo from "@/assets/logo.png";

export function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.7 5.1a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5.4 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.5 9.3.7 13.4 1.1 17.4a18 18 0 0 0 5.4 2.8l1.1-1.8-1.7-.8.4-.3a13 13 0 0 0 11.4 0l.4.3-1.7.8 1.1 1.8a18 18 0 0 0 5.4-2.8c.5-4.6-.8-8.7-3.2-12.3ZM8.5 14.9c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}
export function Brand({
  small = false,
  copy,
}: {
  small?: boolean;
  copy?: Record<string, string>;
}) {
  return (
    <span className={`brand ${small ? "brand-small" : ""}`}>
      <Image
        className="brand-logo"
        src={logo}
        alt="Just Zole"
        width={56}
        height={56}
        sizes="56px"
      />
      <span>
        {copy?.brandFirst ?? "JUST"} <b>{copy?.brandLast ?? "ZOLE"}</b>
        <small>{copy?.brandTagline ?? "BUILT FOR THE ADVANTAGE"}</small>
      </span>
    </span>
  );
}
