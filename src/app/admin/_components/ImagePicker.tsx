"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { listMediaAction, uploadImageAction, type MediaLibrary } from "../actions";

const MAX_EDGE = 2000;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

function slug(name: string) {
  return name
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Resize to at most 2000px on the long edge and re-encode (WebP where the
 * browser supports it). Keeps pages fast and strips camera metadata such as
 * GPS location.
 */
async function prepare(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // Browser can't decode it (e.g. AVIF in older Safari); send as-is.
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  let out = await encode("image/webp");
  if (!out || out.type !== "image/webp") {
    out = await encode(file.type === "image/png" ? "image/png" : "image/jpeg");
  }
  return out ?? file;
}

export function ImagePicker({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (src: string) => void;
  onClose: () => void;
}) {
  const nameId = useId();
  const [library, setLibrary] = useState<MediaLibrary | null>(null);
  const [tab, setTab] = useState<"uploaded" | "builtIn">("uploaded");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();

  useEffect(() => {
    let live = true;
    listMediaAction().then((lib) => {
      if (!live) return;
      setLibrary(lib);
      if (!lib.uploaded.length) setTab("builtIn");
      if (lib.error) setError(lib.error);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function upload() {
    if (!file) return;
    setError(null);
    startUpload(async () => {
      const blob = await prepare(file);
      if (blob.size > 4 * 1024 * 1024) {
        setError("That image is still over 4 MB after resizing. Try a smaller file.");
        return;
      }
      const data = new FormData();
      data.set("file", blob, file.name);
      data.set("name", name || slug(file.name));
      const result = await uploadImageAction(data);
      if (result.ok) onSelect(result.src);
      else setError(result.error);
    });
  }

  const items = library ? library[tab] : [];

  return (
    <div className="cms-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal" role="dialog" aria-modal="true" aria-label="Choose an image">
        <div className="cms-modal-head">
          <h2>Choose an image</h2>
          <button type="button" className="cms-btn small" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="cms-modal-body">
          <div className="cms-upload">
            <label className="cms-field">
              <span className="cms-label">Upload a new image</span>
              <input
                type="file"
                accept={ACCEPT}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  if (f) setName(slug(f.name));
                }}
              />
            </label>
            <div className="cms-field">
              <label className="cms-label" htmlFor={nameId}>
                File name
              </label>
              <input
                id={nameId}
                className="cms-input"
                value={name}
                placeholder="e.g. box-truck-lettering-suitland-md"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="button" className="cms-btn primary" disabled={!file || uploading} onClick={upload}>
              {uploading ? "Uploading…" : "Upload & use"}
            </button>
            <p className="cms-help" style={{ flexBasis: "100%" }}>
              JPEG, PNG, WebP or AVIF. Large photos are resized automatically. A descriptive file name helps SEO.
            </p>
          </div>

          {error ? <div className="cms-banner error" style={{ marginBottom: 0 }}>{error}</div> : null}

          <div className="cms-tabs">
            <button type="button" aria-pressed={tab === "uploaded"} onClick={() => setTab("uploaded")}>
              Uploaded{library ? ` (${library.uploaded.length})` : ""}
            </button>
            <button type="button" aria-pressed={tab === "builtIn"} onClick={() => setTab("builtIn")}>
              Site photos{library ? ` (${library.builtIn.length})` : ""}
            </button>
          </div>

          {!library ? (
            <p className="cms-help">Loading images…</p>
          ) : items.length === 0 ? (
            <p className="cms-help">No uploaded images yet.</p>
          ) : (
            <div className="cms-media">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.src}
                  aria-current={item.src === current}
                  onClick={() => onSelect(item.src)}
                  title={item.name}
                >
                  <img src={item.src} alt="" loading="lazy" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
