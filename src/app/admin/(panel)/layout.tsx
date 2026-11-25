import Link from "next/link";
import { requireUser } from "@/cms/auth";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();
  return (
    <>
      <header className="cms-top">
        <div className="cms-top-inner">
          <Link href="/admin" className="cms-brand">
            Butler Signs<span>Content editor</span>
          </Link>
          <nav>
            <Link href="/admin">Pages</Link>
            <a href="/" target="_blank" rel="noreferrer">
              View site ↗
            </a>
          </nav>
          <div className="cms-user">
            Signed in as <strong>{user}</strong>
            <form action={logoutAction}>
              <button className="cms-btn small">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="cms-main">{children}</main>
    </>
  );
}
