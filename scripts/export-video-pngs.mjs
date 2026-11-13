#!/usr/bin/env node
/**
 * Download full-resolution site images from Supabase and export as PNGs
 * for video editing.
 *
 * Usage: node scripts/export-video-pngs.mjs
 * Output: video-assets/png/{category}/{id}.png + video-assets/manifest.json
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "video-assets", "png");
const MANIFEST_PATH = path.join(ROOT, "video-assets", "manifest.json");

const IMAGE_URLS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "_extracted", "images.json"), "utf8"),
);

const GALLERY = JSON.parse(
  fs.readFileSync(path.join(ROOT, "_extracted", "gallery.json"), "utf8"),
);

function toObjectUrl(renderUrl) {
  const url = new URL(renderUrl);
  url.pathname = url.pathname.replace(
    "/storage/v1/render/image/public/",
    "/storage/v1/object/public/",
  );
  url.search = "";
  return url.toString();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function fileId(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

function galleryMetaByFile() {
  const map = new Map();
  for (const item of GALLERY) {
    const base = path.basename(item.src);
    map.set(base, {
      alt: item.alt,
      category: item.category,
    });
  }
  return map;
}

function pngPath(category, filename) {
  const id = fileId(filename);
  return path.join(OUT_DIR, category, `${id}.png`);
}

async function downloadBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function convertToPng(inputPath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  execFileSync("sips", ["-s", "format", "png", inputPath, "--out", outputPath], {
    stdio: "pipe",
  });
}

async function main() {
  fs.rmSync(path.join(ROOT, "video-assets"), { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const metaByFile = galleryMetaByFile();
  const manifest = [];
  const tmpDir = path.join(ROOT, "video-assets", ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const entries = Object.entries(IMAGE_URLS);
  let ok = 0;
  let failed = 0;

  for (const [filename, renderUrl] of entries) {
    const meta = metaByFile.get(filename);
    const category = meta?.category ?? (filename.includes("logo") || filename.endsWith(".png") ? "brand" : "site");
    const objectUrl = toObjectUrl(renderUrl);
    const outputPath = pngPath(category, filename);
    const tmpInput = path.join(tmpDir, filename);

    try {
      const buffer = await downloadBuffer(objectUrl);
      fs.writeFileSync(tmpInput, buffer);
      convertToPng(tmpInput, outputPath);
      fs.unlinkSync(tmpInput);

      const stats = fs.statSync(outputPath);
      manifest.push({
        file: path.relative(ROOT, outputPath),
        sourceFile: filename,
        category,
        alt: meta?.alt ?? null,
        slug: meta?.alt ? slugify(meta.alt) : slugify(fileId(filename)),
        bytes: stats.size,
        sourceUrl: objectUrl,
      });
      ok += 1;
      process.stdout.write(`✓ ${category}/${fileId(filename)}.png\n`);
    } catch (error) {
      failed += 1;
      process.stderr.write(
        `✗ ${filename}: ${error instanceof Error ? error.message : error}\n`,
      );
    }
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });

  manifest.sort((a, b) => a.file.localeCompare(b.file));
  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        format: "png",
        count: ok,
        failed,
        items: manifest,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`\nExported ${ok} PNGs to video-assets/png/ (${failed} failed)`);
  console.log(`Manifest: video-assets/manifest.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
