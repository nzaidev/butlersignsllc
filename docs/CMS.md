# Content editor (/admin)

A small built-in CMS that lets an editor, such as an SEO contractor, change page text, images, alt text and search/social metadata **without access to the code, the GitHub repo or the Vercel project**.

## What editors can and can't do

| Editors can | Editors can't |
| --- | --- |
| Edit headings, paragraphs, lists, captions and button labels on Home, Our Story, Our Work, Book, and the footer | Change layout, styling, code or page structure |
| Set each page's title, meta description and share image, with a Google preview | Add HTML, scripts, tracking tags or embeds (there are no such fields) |
| Upload images (auto-resized, WebP, location data stripped), pick existing photos, edit alt text | Point images at outside websites (only uploaded and existing site images are allowed) |
| Add, remove and reorder gallery photos, services, timeline items, and similar lists | Change the contact name, phone or email (these stay in `src/data/contact.ts`) |
| Restore any earlier version of a page | Download or export the site, code or repo |

Everything an editor submits is validated on the server against the schema in `src/cms/schema.ts`. Unknown fields are dropped, lengths are capped, and text is always rendered as plain text, never as HTML.

Visitors (including editors) can still see what any website shows publicly: the rendered pages, CSS and minified browser JavaScript. Server code, API keys and the repository are never sent to the browser, and production source maps are disabled in `next.config.ts`.

## Setup on Vercel (one time)

1. **Create a Blob store.** In the Vercel dashboard, open the `butlersigns` project, then **Storage → Create → Blob**. Choose **public** access and connect it to the project. This adds `BLOB_READ_WRITE_TOKEN` automatically.
2. **Add environment variables** under **Settings → Environment Variables** (Production):
   - `CMS_SESSION_SECRET`: a random string of 32+ characters. Generate one with `openssl rand -base64 32`.
   - `CMS_USERS`: one `name:password` pair per person, comma-separated, for example `nick:<password>,seo:<password>`.
     - Usernames: 2–32 lowercase letters or digits.
     - Passwords: at least 12 characters, no commas. Generate one with `openssl rand -base64 18`.
3. **Redeploy**, then sign in at `https://<your-domain>/admin`.

Give the editor **only** the `/admin` URL and their own username and password. Don't add them to the GitHub repo or the Vercel team.

### Removing or changing someone's access

Edit `CMS_USERS` (delete their entry or change their password) and redeploy. Their existing sessions stop working immediately, because sessions are signed with a key derived from the user's password. Changing `CMS_SESSION_SECRET` signs everyone out.

Sessions last 12 hours. Every publish records who made it; see **Recent changes** on the dashboard.

## How it works

- **Content lives in Vercel Blob, not in the repo.** Each publish writes a new, immutable file per page (`cms/pages/<page>/<timestamp>.<user>.json`). A page's live content is its newest file. The last 40 versions per page are kept, and older ones are pruned.
- **Pages stay static.** Public pages are pre-rendered, and content is read through Next's data cache. Publishing invalidates the cache, so the next visitor gets the new version. Page views never hit storage.
- **Fallback.** Any field that hasn't been edited shows the original copy from `src/cms/defaults.ts`. If storage isn't configured, the site simply shows those defaults.
- **Two people editing the same page.** If someone else published the page after you opened it, your publish is refused rather than overwriting their work.
- **Access control.** `src/proxy.ts` redirects signed-out visitors away from `/admin`, and every admin page and server action re-checks the session. Admin pages are marked `noindex` and can't be framed.

Key files:

| File | Purpose |
| --- | --- |
| `src/cms/schema.ts` | What's editable: fields, labels, help text, limits |
| `src/cms/defaults.ts` | The site's original copy, used until a field is edited |
| `src/cms/content.ts` | Reading, publishing and restoring content |
| `src/cms/store.ts` | Storage: Vercel Blob in production, a local `.cms/` folder in development |
| `src/cms/session.ts`, `src/cms/auth.ts`, `src/proxy.ts` | Accounts and sessions |
| `src/app/admin/` | The editor UI and server actions |

## Making something new editable

1. Add the field to the page's group in `src/cms/schema.ts`.
2. Add its current value to `src/cms/defaults.ts`. TypeScript will flag it if you forget.
3. Read it in the page component: `const content = await getPage("home")`.

The editor form picks the new field up automatically.

## Local development

```bash
CMS_USERS="dev:local-dev-password" CMS_SESSION_SECRET="$(openssl rand -base64 32)" npm run dev
```

Then open http://localhost:3000/admin. Without a Blob token, content is saved to `.cms/` and uploads go to `public/cms-uploads/`. Both are gitignored.

## Notes

- The Site Assistant chat reads `content/chat-agent-knowledge.md`, which is not managed by the CMS. If service copy changes a lot, update that file too.
- Publish from the production URL. Preview deployments that share the same Blob token write to the same content, but they only refresh their own cache.
