import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/cms/auth";
import { getEditorState } from "@/cms/content";
import { isPageId, PAGES } from "@/cms/schema";
import { PageEditor } from "../../../_components/PageEditor";
import { formatWhen } from "../../../_components/format";

export default async function EditPage({ params }: PageProps<"/admin/edit/[page]">) {
  await requireUser();
  const { page } = await params;
  if (!isPageId(page)) notFound();
  const meta = PAGES.find((p) => p.id === page)!;

  let state: Awaited<ReturnType<typeof getEditorState>>;
  try {
    state = await getEditorState(page);
  } catch (error) {
    console.error("[cms] load editor", error);
    return (
      <div className="cms-banner error">
        This page&apos;s content couldn&apos;t be loaded. <Link href="/admin">Back to pages</Link>
      </div>
    );
  }

  return (
    <PageEditor
      key={page}
      page={page}
      label={meta.label}
      publicPath={meta.path}
      initial={state.value}
      initialHash={state.hash}
      lastEdited={
        state.lastRevision
          ? `Last published ${formatWhen(state.lastRevision.ts)} by ${state.lastRevision.author}`
          : "Showing the site's original content. Nothing published yet."
      }
    />
  );
}
