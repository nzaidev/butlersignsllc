"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { SCHEMA, type Field, type GroupField, type PageId } from "@/cms/schema";
import { publishAction } from "../actions";
import { FieldEditor, GroupFields, setIn, type Path } from "./fields";

type Status =
  | { kind: "idle" }
  | { kind: "published"; changed: boolean }
  | { kind: "error"; message: string };

type Section = { key: string; label: string; fields: [string, Field][] };

/** Top-level groups and lists become their own cards; loose fields share one. */
function sectionsOf(schema: GroupField): Section[] {
  const sections: Section[] = [];
  let loose: Section | null = null;
  for (const [key, field] of Object.entries(schema.fields)) {
    if (field.kind === "group" || field.kind === "list") {
      loose = null;
      sections.push({ key, label: field.label, fields: [[key, field]] });
    } else {
      if (!loose) {
        loose = { key: `content-${key}`, label: "Page content", fields: [] };
        sections.push(loose);
      }
      loose.fields.push([key, field]);
    }
  }
  return sections;
}

export function PageEditor({
  page,
  label,
  publicPath,
  initial,
  initialHash,
  lastEdited,
}: {
  page: PageId;
  label: string;
  publicPath: string;
  initial: unknown;
  initialHash: string;
  lastEdited: string;
}) {
  const schema = SCHEMA[page] as GroupField;
  const sections = useMemo(() => sectionsOf(schema), [schema]);

  const [value, setValue] = useState<unknown>(initial);
  const [base, setBase] = useState(() => ({ json: JSON.stringify(initial), hash: initialHash, lastEdited }));
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [publishing, startPublish] = useTransition();

  const json = useMemo(() => JSON.stringify(value), [value]);
  const dirty = json !== base.json;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function onChange(path: Path, next: unknown) {
    setValue((prev: unknown) => setIn(prev, path, next));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  }

  function publish() {
    startPublish(async () => {
      const result = await publishAction(page, json, base.hash);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      const saved = result.state;
      setValue(saved.value);
      setBase({
        json: JSON.stringify(saved.value),
        hash: saved.hash,
        lastEdited: saved.lastRevision ? `Published just now by ${saved.lastRevision.author}` : base.lastEdited,
      });
      setStatus({ kind: "published", changed: result.changed });
    });
  }

  function discard() {
    setValue(JSON.parse(base.json));
    setStatus({ kind: "idle" });
  }

  const statusText =
    status.kind === "published"
      ? status.changed
        ? "Published. The live site is updated."
        : "No changes to publish."
      : dirty
        ? "Unpublished changes"
        : base.lastEdited;

  return (
    <>
      <div className="cms-bar">
        <Link href="/admin" className="cms-btn small">
          ← Pages
        </Link>
        <h1>{label}</h1>
        <span
          className={`cms-status${status.kind === "published" ? " ok" : dirty ? " dirty" : ""}`}
          aria-live="polite"
        >
          {statusText}
        </span>
        <span className="spacer" />
        <a className="cms-btn small" href={publicPath} target="_blank" rel="noreferrer">
          View live page ↗
        </a>
        <button type="button" className="cms-btn small" disabled={!dirty || publishing} onClick={discard}>
          Discard changes
        </button>
        <button type="button" className="cms-btn primary" disabled={!dirty || publishing} onClick={publish}>
          {publishing ? "Publishing…" : "Publish"}
        </button>
        {status.kind === "error" ? (
          <div className="cms-banner error cms-bar-error" role="alert">
            {status.message}
          </div>
        ) : null}
      </div>

      <div className="cms-editor">
        <nav className="cms-toc" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.key} href={`#sec-${s.key}`}>
              {s.label}
            </a>
          ))}
        </nav>
        <div>
          {sections.map((section) => {
            const [[firstKey, first]] = section.fields;
            const obj = (value ?? {}) as Record<string, unknown>;
            return (
              <section className="cms-card cms-section" id={`sec-${section.key}`} key={section.key}>
                <h2 className="cms-card-head">{section.label}</h2>
                {first.kind === "group" ? (
                  <GroupFields field={first} value={obj[firstKey]} path={[firstKey]} onChange={onChange} />
                ) : first.kind === "list" ? (
                  <FieldEditor
                    field={{ ...first, label: "" } as Field}
                    value={obj[firstKey]}
                    path={[firstKey]}
                    onChange={onChange}
                  />
                ) : (
                  <div className="cms-fields">
                    {section.fields.map(([key, field]) => (
                      <FieldEditor key={key} field={field} value={obj[key]} path={[key]} onChange={onChange} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
