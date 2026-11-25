"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { emptyValue } from "@/cms/normalize";
import type {
  Field,
  GroupField,
  ImageField,
  ImageValue,
  ListField,
  SelectField,
  TextField,
} from "@/cms/schema";
import { ImagePicker } from "./ImagePicker";

export type Path = (string | number)[];
export type OnChange = (path: Path, value: unknown) => void;

export function setIn(target: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(target)) {
    const copy = target.slice();
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const obj = (target ?? {}) as Record<string, unknown>;
  return { ...obj, [head]: setIn(obj[head as string], rest, value) };
}

type Props<F extends Field> = { field: F; value: unknown; path: Path; onChange: OnChange };

export function FieldEditor(props: Props<Field>) {
  const { field } = props;
  switch (field.kind) {
    case "text":
      return <TextEditor {...props} field={field} />;
    case "image":
      return <ImageEditor {...props} field={field} />;
    case "select":
      return <SelectEditor {...props} field={field} />;
    case "boolean":
      return (
        <label className="cms-check">
          <input
            type="checkbox"
            checked={props.value === true}
            onChange={(e) => props.onChange(props.path, e.target.checked)}
          />
          {field.label}
        </label>
      );
    case "list":
      return <ListEditor {...props} field={field} />;
    case "group":
      return (
        <fieldset className="cms-group">
          <legend>{field.label}</legend>
          <GroupFields {...props} field={field} />
        </fieldset>
      );
  }
}

/** The fields of a group, without the surrounding box. */
export function GroupFields({ field, value, path, onChange }: Props<GroupField>) {
  const obj = (value ?? {}) as Record<string, unknown>;
  return (
    <div className="cms-fields">
      {field.help ? <p className="cms-help">{field.help}</p> : null}
      {field.serp ? <SearchPreview value={obj} /> : null}
      {Object.entries(field.fields).map(([key, child]) => (
        <FieldEditor key={key} field={child} value={obj[key]} path={[...path, key]} onChange={onChange} />
      ))}
    </div>
  );
}

function Label({ htmlFor, field, count }: { htmlFor?: string; field: Field; count?: number }) {
  const text = field.kind === "text" ? field : null;
  const target = text?.recommended ?? text?.max;
  return (
    <>
      <label className="cms-label" htmlFor={htmlFor}>
        <span>{field.label}</span>
        {text && count !== undefined && target ? (
          <span className={`cms-counter${text.recommended && count > text.recommended ? " over" : ""}`}>
            {count} / {target}
            {text.recommended ? " recommended" : ""}
          </span>
        ) : null}
      </label>
      {field.help ? <p className="cms-help">{field.help}</p> : null}
    </>
  );
}

function TextEditor({ field, value, path, onChange }: Props<TextField>) {
  const id = useId();
  const text = typeof value === "string" ? value : "";
  const max = field.max ?? (field.multiline ? 5000 : 300);
  return (
    <div className="cms-field">
      <Label htmlFor={id} field={field} count={text.length} />
      {field.multiline ? (
        <textarea
          id={id}
          className="cms-input"
          value={text}
          maxLength={max}
          rows={Math.min(12, Math.max(2, text.split("\n").length + Math.ceil(text.length / 90)))}
          onChange={(e) => onChange(path, e.target.value)}
        />
      ) : (
        <input
          id={id}
          className="cms-input"
          value={text}
          maxLength={max}
          onChange={(e) => onChange(path, e.target.value)}
        />
      )}
    </div>
  );
}

function SelectEditor({ field, value, path, onChange }: Props<SelectField>) {
  const id = useId();
  return (
    <div className="cms-field">
      <Label htmlFor={id} field={field} />
      <select id={id} className="cms-input" value={String(value ?? "")} onChange={(e) => onChange(path, e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageEditor({ field, value, path, onChange }: Props<ImageField>) {
  const id = useId();
  const [picking, setPicking] = useState(false);
  const image = (value ?? { src: "", alt: "" }) as ImageValue;
  return (
    <div className="cms-field">
      <Label field={field} />
      <div className="cms-image">
        <div className="cms-thumb">{image.src ? <img src={image.src} alt="" /> : "No image"}</div>
        <div className="cms-image-side">
          <div className="row">
            <button type="button" className="cms-btn small" onClick={() => setPicking(true)}>
              {image.src ? "Change image" : "Choose image"}
            </button>
            {field.optional && image.src ? (
              <button type="button" className="cms-btn small danger" onClick={() => onChange(path, { src: "", alt: "" })}>
                Remove
              </button>
            ) : null}
          </div>
          {!image.src && !field.optional ? <p className="cms-warn-text">Choose an image, or this one won&apos;t show.</p> : null}
          <label className="cms-label" htmlFor={id}>
            Alt text
          </label>
          <input
            id={id}
            className="cms-input"
            value={image.alt}
            maxLength={300}
            placeholder="Describe what's in the photo"
            onChange={(e) => onChange([...path, "alt"], e.target.value)}
          />
          {image.src && !image.alt.trim() ? (
            <p className="cms-warn-text">Missing alt text. Google and screen readers use it.</p>
          ) : (
            <p className="cms-help">Describes the image for Google and screen readers.</p>
          )}
        </div>
      </div>
      {picking ? (
        <ImagePicker
          current={image.src}
          onClose={() => setPicking(false)}
          onSelect={(src) => {
            onChange([...path, "src"], src);
            setPicking(false);
          }}
        />
      ) : null}
    </div>
  );
}

let nextKey = 0;
const newKey = () => `k${nextKey++}`;

function ListEditor({ field, value, path, onChange }: Props<ListField>) {
  const items = Array.isArray(value) ? value : [];
  // Stable keys so items keep their open/closed state when reordered.
  const [keys, setKeys] = useState<string[]>(() => items.map(newKey));
  const [openKey, setOpenKey] = useState<string | null>(null);
  const synced = keys.length === items.length ? keys : items.map((_, i) => keys[i] ?? newKey());
  if (synced !== keys) setKeys(synced);

  const max = field.max ?? 100;
  const min = field.min ?? 0;
  const scalar = field.of.kind !== "group";

  function update(nextItems: unknown[], nextKeys: string[]) {
    setKeys(nextKeys);
    onChange(path, nextItems);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const ni = items.slice();
    const nk = synced.slice();
    [ni[i], ni[j]] = [ni[j], ni[i]];
    [nk[i], nk[j]] = [nk[j], nk[i]];
    update(ni, nk);
  }
  function remove(i: number) {
    update(items.filter((_, x) => x !== i), synced.filter((_, x) => x !== i));
  }
  function add() {
    const key = newKey();
    setOpenKey(key);
    update([...items, emptyValue(field.of)], [...synced, key]);
  }

  const tools = (i: number) => (
    <span className="cms-tools" onClick={(e) => e.preventDefault()}>
      <button type="button" className="cms-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
        ↑
      </button>
      <button
        type="button"
        className="cms-btn icon"
        aria-label="Move down"
        disabled={i === items.length - 1}
        onClick={() => move(i, 1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="cms-btn icon danger"
        aria-label={`Remove ${field.itemLabel}`}
        disabled={items.length <= min}
        onClick={() => remove(i)}
      >
        ✕
      </button>
    </span>
  );

  const addButton = (
    <button type="button" className="cms-btn small cms-add" disabled={items.length >= max} onClick={add}>
      + Add {field.itemLabel}
    </button>
  );

  return (
    <div className="cms-field">
      <Label field={field} />
      <div className="cms-list">
        {items.length > 10 ? addButton : null}
        {items.map((item, i) =>
          scalar ? (
            <div className="cms-list-row" key={synced[i]}>
              <div className="cms-bare">
                <FieldEditor
                  field={{ ...field.of, label: `${field.of.label} ${i + 1}`, help: undefined } as Field}
                  value={item}
                  path={[...path, i]}
                  onChange={onChange}
                />
              </div>
              {tools(i)}
            </div>
          ) : (
            <details
              className="cms-item"
              key={synced[i]}
              open={!field.collapsed || openKey === synced[i]}
            >
              <summary>
                <ItemSummary field={field} item={item} index={i} />
                {tools(i)}
              </summary>
              <div className="cms-item-body">
                <GroupFields field={field.of as GroupField} value={item} path={[...path, i]} onChange={onChange} />
              </div>
            </details>
          ),
        )}
        {addButton}
      </div>
    </div>
  );
}

function ItemSummary({ field, item, index }: { field: ListField; item: unknown; index: number }) {
  const group = field.of as GroupField;
  const obj = (item ?? {}) as Record<string, unknown>;
  let title = "";
  let thumb = "";
  for (const [key, f] of Object.entries(group.fields)) {
    const v = obj[key];
    if (!title && f.kind === "text" && typeof v === "string") title = v.replace(/\*/g, "").split("\n")[0];
    if (f.kind === "image" && v && typeof v === "object") {
      const img = v as ImageValue;
      thumb ||= img.src;
      if (!title) title = img.alt;
    }
  }
  return (
    <>
      <span className="num">{index + 1}.</span>
      {thumb ? <img src={thumb} alt="" /> : null}
      <span className="title">{title || `New ${field.itemLabel}`}</span>
    </>
  );
}

const noopSubscribe = () => () => {};

function SearchPreview({ value }: { value: Record<string, unknown> }) {
  const host = useSyncExternalStore(
    noopSubscribe,
    () => window.location.host,
    () => "",
  );
  const title = typeof value.title === "string" ? value.title : "";
  const desc = typeof value.description === "string" ? value.description : "";
  return (
    <div className="cms-serp" aria-label="Google search preview">
      <div className="eyebrow-line">Google preview</div>
      <div className="url">{host || "butlersigns"}</div>
      <div className="title">{title || "Page title"}</div>
      <div className="desc">{desc || "Add a meta description so Google shows a useful summary."}</div>
    </div>
  );
}
