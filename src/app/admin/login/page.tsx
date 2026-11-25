import { redirect } from "next/navigation";
import { getCurrentUser } from "@/cms/auth";
import { readCmsConfig } from "@/cms/session";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;

  // Details go to the server log only; this page is public.
  const { users, secret, problems } = readCmsConfig();
  if (problems.length) console.warn("[cms] configuration problems:\n- " + problems.join("\n- "));
  const ready = users.length > 0 && secret;

  return (
    <main className="cms-login">
      <div className="cms-card">
        <h1>Butler Signs</h1>
        <p className="cms-help">Sign in to edit the website&apos;s content.</p>
        {ready ? null : (
          <div className="cms-banner warn" style={{ marginTop: 16, marginBottom: 0 }}>
            Sign-in isn&apos;t set up yet. The site owner needs to set <code>CMS_USERS</code> and{" "}
            <code>CMS_SESSION_SECRET</code> (see <code>docs/CMS.md</code>).
          </div>
        )}
        <LoginForm next={typeof next === "string" ? next : ""} />
      </div>
    </main>
  );
}
