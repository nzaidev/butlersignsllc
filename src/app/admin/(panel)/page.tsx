import Link from "next/link";
import { requireUser } from "@/cms/auth";
import { getOverview } from "@/cms/content";
import { PAGES } from "@/cms/schema";
import { formatWhen } from "../_components/format";
import { RestoreButton } from "../_components/RestoreButton";

const LABEL = Object.fromEntries(PAGES.map((p) => [p.id, p.label]));

export default async function Dashboard() {
  await requireUser();
  let overview: Awaited<ReturnType<typeof getOverview>> | null = null;
  try {
    overview = await getOverview();
  } catch (error) {
    console.error("[cms] overview", error);
  }

  return (
    <>
      <div className="cms-head">
        <div>
          <h1>Pages</h1>
          <p>Choose a page to edit its text, images and search settings.</p>
        </div>
      </div>

      {!overview ? (
        <div className="cms-banner error">Content storage couldn&apos;t be reached. Try again in a minute.</div>
      ) : overview.storage === "none" ? (
        <div className="cms-banner warn">
          Content storage isn&apos;t connected, so changes can&apos;t be published yet. The site owner needs to
          connect a Vercel Blob store (see <code>docs/CMS.md</code>).
        </div>
      ) : overview.storage === "fs" ? (
        <div className="cms-banner info">
          Development mode: changes are saved to the local <code>.cms/</code> folder.
        </div>
      ) : null}

      <div className="cms-pages">
        {PAGES.map((page) => {
          const last = overview?.latest[page.id];
          return (
            <div className="cms-card cms-page-card" key={page.id} style={{ marginTop: 0 }}>
              <h2>{page.label}</h2>
              <p>{page.blurb}</p>
              <div className="meta">
                {last ? `Last published ${formatWhen(last.ts)} by ${last.author}` : "Not edited yet"}
              </div>
              <div className="actions">
                <Link className="cms-btn primary small" href={`/admin/edit/${page.id}`}>
                  Edit
                </Link>
                <a className="cms-btn small" href={page.path} target="_blank" rel="noreferrer">
                  View ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cms-card" style={{ marginTop: 28 }}>
        <h2>Recent changes</h2>
        <p className="cms-help">
          Every publish is saved as a version. Restoring a version makes it live again, and the current version stays
          in the history.
        </p>
        {overview?.recent.length ? (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Published by</th>
                <th>When</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {overview.recent.map((rev) => (
                <tr key={rev.id}>
                  <td>{LABEL[rev.page]}</td>
                  <td>{rev.author}</td>
                  <td>{formatWhen(rev.ts)}</td>
                  <td>
                    {overview.latest[rev.page]?.id === rev.id ? (
                      <span className="cms-tag">Live</span>
                    ) : (
                      <RestoreButton id={rev.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="cms-help">No changes have been published yet.</p>
        )}
      </div>
    </>
  );
}
