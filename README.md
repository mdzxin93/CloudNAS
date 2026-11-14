# SAM — responsive private file server

SAM is a self-hosted React + Express + MongoDB app inspired by the provided clean blue/white mobile design. It includes authenticated private file storage, folders, file sharing, an anonymous 15-minute clipboard transfer, PDF/JPG/PNG/TXT tools, dark mode, and mobile/desktop navigation.

## What works
- Registration, login, secure cookie sessions, logout, user isolation.
- Private filesystem upload/download, file search/filter/sort/grid, rename/move, folder creation, recycle-bin restore/permanent delete.
- Share links with expiration, recipient-restricted share records (recipient downloads via **Shared with me**), revocation.
- Temporary text/file clipboard with six-digit codes and expiry.
- JPEG/PNG/TXT to PDF using pdf-lib.
- PDF optimization through installed Ghostscript (not bundled). Preset output sizes can be larger than the original. There is no guaranteed lossless compression.
- Responsive React interface, main dashboard, PDF tool, cloud integration status page, settings.

## Current limitations (read before production use)
- **Cloud providers:** Google Drive, OneDrive, Dropbox, WebDAV, FTP and SFTP are UI-only *Not configured* entries. No OAuth providers are connected.
- **Formats:** Word, PPT, Excel, Pages, GIF and other conversions are not supported yet. Plain TXT-to-PDF replaces non-ASCII characters with `?` using the built-in PDF font.
- **ZIP:** bulk ZIP download is implemented for up to 50 selected files.
- **File preview:** open-in-new-tab works with session cookies, and supported file types can display inline; behavior varies by browser.
- **Folder operations:** single-level/multi-level folder creation works via API, but frontend creates folders at current location and does not yet expose all nesting/rename operations.
- **Production readiness:** this is a functional starter application, not audited for public Internet deployment. Add virus scanning, transactional quota reservations/concurrency control, production backup verification, monitoring, central storage locking, and threat-model review before storing sensitive data.
- **Anonymous transfers:** 6-digit codes have low entropy; use only for non-sensitive files, and do not deploy publicly without additional anti-abuse protection and IP throttling.
- **Cleanup:** a periodic process removes expired metadata and temporary file bytes; for reliability in production, run it as a separate scheduled worker.
- **Tests:** inspect test and validation notes; browser-level multi-device E2E testing requires an accessible MongoDB service and browser runner.

## Windows setup (VS Code)
1. Install Node.js 22 or newer, MongoDB Community Server, and Git. Optional: install Ghostscript and add `gswin64c` to PATH.
2. Open this folder in PowerShell. Copy `.env.example` to `.env`, and replace `JWT_SECRET` with a random 64-character secret (e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
3. Start MongoDB as a Windows service. Confirm the Mongo connection string is correct.
4. Run `npm install` then `npm run dev`.
5. Open http://localhost:5173 and create a user account.
6. To use your phone on the same Wi-Fi: run `ipconfig`, find the Windows IPv4 address, and browse `http://YOUR-IP:5173`. Configure Windows Firewall and CORS as needed. In `.env`, set `CORS_ORIGIN=http://YOUR-IP:5173,http://localhost:5173`; restart the server. Never open port 4000 or MongoDB to the public internet without proper reverse proxy/TLS and hardening.

## Docker compose
Create `.env` with `JWT_SECRET=<your secret>`, `CORS_ORIGIN=http://localhost:4000` and run `docker compose up --build`. Visit http://localhost:4000. The source includes separate persistent volumes for MongoDB and files. **For HTTPS deployments:** configure a reverse proxy with TLS and the correct externally visible CORS origin. `secure` cookies are required in production, so production HTTP logins won't persist without HTTPS.

## API sketch
`GET /api/health`; `GET /api/auth/csrf`; `POST /api/auth/register|login|logout`; `GET /api/auth/me`; `GET /api/stats`; `GET|POST /api/files`; `PATCH|DELETE /api/files/:id`; `POST /api/files/:id/restore`; `DELETE /api/files/:id/permanent`; `GET /api/files/:id/download`; `GET|POST /api/folders`; `DELETE /api/folders/:id`; `POST|GET /api/shares`; `DELETE /api/shares/:id`; `GET /api/shares/received`; `GET /api/shares/received/:id/download`; `GET /api/public/shares/:token`; `GET /api/public/shares/:token/download`; `POST /api/transfers/text|file|retrieve`; `GET /api/transfers/:code/download`; `POST /api/tools/to-pdf`; `POST /api/tools/optimize-pdf?preset=medium`.

API mutations require the X-CSRF-Token header returned by `/api/auth/csrf`. The UI handles it automatically. All storage paths are private and file identifiers are authorization checked.

## UI architecture
React 18 + Vite, custom responsive CSS. Desktop: sidebar, search, cards, file explorer. Mobile: redesigned bottom navigation and full-width sheets. Colors: blue #4A80EF, mint #DDF8F1, sky #C7DDFF, background #F7F9FD, white and dark alternate.

## Quality check
Run `npm run build` (frontend) and `npm test`. Manual smoke flow: register user A; upload a file; download/check bytes; create folder; rename and move; delete/restore; create share; open public link; clipboard send/retrieve from mobile; register user B and confirm A's files are not listed or directly downloadable. Verify 320px, 390px, 768px, 1280px responsive sizes.

## Security notes
- Do not version-control `.env`, or the `data` directory.
- Database is not exposed from Docker Compose.
- Passwords use Argon2id, filesystem keys are random, cookies are HTTP-only, same-site, and require HTTPS in production.
- For a true always-on NAS, host the Docker service on a dedicated powered-on device with persistent disks and backups.

License: original starter code created for the requested project. Branding and original reference site assets are not redistributed.
