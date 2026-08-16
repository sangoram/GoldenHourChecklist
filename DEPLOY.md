# Publishing GHAPTT

Two ways to get it live. Route A is the real one (shared board across devices). Route B is a single file you can drag onto Netlify or email around, but it does **not** sync between devices.

---

## Route A — GitHub repo → Netlify (shared · live)

Push these files, keeping the paths exactly:

```
GHAPTT-Shared.dc.html         ← the app
support.js                    ← runtime the app loads
netlify.toml                  ← publish dir, functions dir, "/" rewrite
package.json                  ← pulls @netlify/blobs for the function
netlify/functions/state.mjs   ← shared-state API (Netlify Blobs)
.gitignore
```

1. Create an empty GitHub repo, push the files above (no build step needed).
2. Netlify → **Add new site → Import an existing project → GitHub** → pick the repo.
3. Leave build command blank; `netlify.toml` supplies everything. Deploy.
4. Open the site root. The header badge should read **Shared · live** — every device on that URL now sees the same board (~3 s polling).

`netlify.toml` rewrites `/` to the app file, so the plain site URL works; no `index.html` copy to keep in sync.

### How sync works
- One Netlify Blob (`ghaptt/state`). Clients GET every 3 s, POST changes debounced.
- Merge is per-item, newest-timestamp-wins, so two people checking different items never clobber each other.
- If the function is unreachable, the app drops to device-only mode with cross-tab sync and retries the server every 20 s.

---

## Route B — single file (device-only)

`GHAPTT-standalone.html` is the whole app with the runtime inlined — one file you can drop on Netlify, put on a shared drive, or email. It still pulls React from a CDN, so the device needs internet the first time it loads.

- Netlify → **Sites → Add new site → Deploy manually** → drop the file in (rename it `index.html` first if you want it at the site root).
- Badge reads **Device only**: checks persist on that device and sync across its tabs, but nothing crosses devices. Use Route A for a live team board.
- Rebuild it after any change to the app: it is a snapshot of `GHAPTT-Shared.dc.html` + `support.js`, not a live copy.

---

## Before real clinical use
- Anyone with the URL can view and edit. Turn on Netlify password protection (Site settings → Access control → Password protection), or Netlify Identity if you want per-user logins.
- Keep labels to bed space only — no names, MRN, or DOB in this tool.
- Netlify Blobs is not a medical record. Treat the board as a live worksheet; the debrief/summary export is what leaves the room.
