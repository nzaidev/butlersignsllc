import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * Tiny, safe text formatting for CMS content. Editors type plain text; the
 * only markup understood is *emphasis* (rendered as <em>, which the site styles
 * as the red script font) and line breaks. Nothing is ever parsed as HTML.
 */

const EMPHASIS = /\*([^*\n]+)\*/g;

export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(EMPHASIS)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(<em key={key++}>{match[1]}</em>);
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Non-empty lines of a multi-line field. */
export function lines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Inline text; line breaks become <br />. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {lines(text).map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {inline(line)}
        </Fragment>
      ))}
    </>
  );
}

/** Blank-line separated paragraphs, each rendered as its own <p>. */
export function Paragraphs({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className} style={style}>
            <Rich text={p} />
          </p>
        ))}
    </>
  );
}
