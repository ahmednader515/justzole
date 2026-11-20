import Link from "next/link";
import { Brand } from "@/components/icons";
import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Create account",
  robots: { index: false, follow: true },
};
export default function Register() {
  return (
    <main className="auth-shell cyber-site">
      <Link href="/">
        <Brand />
      </Link>
      <div className="auth-card">
        <div className="eyebrow">JOIN THE COMMUNITY</div>
        <h1>Your edge starts here.</h1>
        <p>Create your Just Zole account.</p>
        <AuthForm mode="register" />
      </div>
      <Link className="muted" href="/">
        Back to Just Zole
      </Link>
    </main>
  );
}
