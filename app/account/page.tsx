import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};
export default async function Account() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return (
    <div className="cyber-site">
      <Header />
      <main className="container section">
        <div className="eyebrow">YOUR ACCOUNT</div>
        <h1 className="page-title">
          Welcome, {user.name}
          <span>.</span>
        </h1>
        <div className="panel">
          <h3>{user.email}</h3>
          <p>Member since {user.createdAt.toLocaleDateString("en-GB")}</p>
          <p>
            All purchases and product support are handled in the Just Zole
            Discord server.
          </p>
          <a className="button" href="/go/discord">
            Open the community
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
