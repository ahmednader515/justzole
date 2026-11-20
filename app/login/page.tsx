import Link from "next/link";
import { Brand } from "@/components/icons";
import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Sign in" };
export default function Login() {
  return (
    <main className="auth-shell">
      <Link href="/">
        <Brand />
      </Link>
      <div className="auth-card">
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Back in the game.</h1>
        <p>Sign in to your Just Zole account.</p>
        <AuthForm mode="login" />
      </div>
      <Link className="muted" href="/">
        Back to Just Zole
      </Link>
    </main>
  );
}
