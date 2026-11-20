# Just Zole

A black-and-red product showcase built with Next.js App Router, React, TypeScript, Prisma 7, Neon PostgreSQL, and Cloudflare R2. Purchases happen on Discord; there is no checkout or payment processing.

## Run locally

Install Node.js 20.19+ (Node 24 recommended), then:

```powershell
npm install
npx prisma db push
npx prisma generate
$env:SEED_ADMIN_PASSWORD = 'your-initial-admin-password'
npx prisma db seed
Remove-Item Env:SEED_ADMIN_PASSWORD
npm run dev
```

Use `.env.example` as the configuration reference; keep `.env` private. The supplied Neon database was initialized and the requested administrator was created during setup. The administrator email is `admin@zole.com`. Its password is hashed with bcrypt and never returned by the application. Re-running the seed preserves existing accounts and passwords.

- Catalog: http://localhost:3000
- Sign in: http://localhost:3000/login
- Register: http://localhost:3000/register
- Admin: http://localhost:3000/admin
- Prisma Studio: `npm run db:studio` or `npx prisma studio`
- Production: `npm run build`, then `npm start`
- Type checking: `npm run typecheck`
- Integration check while the dev server is running: `npm run test:integrations` (creates and removes a temporary R2 image and session).

## Features

Visitors can search products, filter by category/game, sort, view features and media, and follow tracked links to Discord. Users can register, sign in, sign out, and view their account. Admins can create, edit, publish, feature, mark availability, or delete products; upload images and videos; record sale quantities and prices; search registered accounts; and view 7/30/90-day sales charts, revenue by currency, top products, registrations, and outbound Discord clicks. Clicks are not unique visitors, and they do not imply a completed purchase. Chart dates use UTC. Deleting a product deletes its sale records after confirmation.

Authentication uses opaque random session tokens in HTTP-only, same-site cookies. Only SHA-256 token digests are stored in PostgreSQL, sessions expire after seven days, and production cookies require HTTPS. Each protected page, server mutation, and media upload checks the administrator role. Registration always creates a regular user. Database-backed authentication throttling limits repeated attempts; trusted deployments should configure their reverse proxy to overwrite `x-forwarded-for`.

## Cloudflare R2

Configure an R2 API token with object read/write permission limited to your bucket. `R2_PUBLIC_URL` must be a public R2 domain or custom bucket domain. Uploads are relayed through an authenticated same-origin API route, so browser CORS configuration is unnecessary. Supported formats: JPG, PNG, WebP, GIF, MP4, WebM; maximum 25 MB per file. Larger videos can be hosted externally and linked. YouTube links are rendered in a privacy-enhanced embed; other video URLs open as external showcases when they are not direct MP4/WebM files.

Media credentials remain server-side. Replacing/deleting a product does not delete R2 objects, so older references remain safe; clean up unused objects through your Cloudflare dashboard when needed.

## Discord source data

The invite was verified against Discord's public invite API. It identifies the Just Zole server, but does not grant read access to messages or product attachments. No fabricated products or sales were seeded. The catalog has a designed empty state until the owner adds listings.

To import later, add a bot to Just Zole with View Channels and Read Message History, enable Message Content Intent in the Discord developer portal, and set `DISCORD_BOT_TOKEN` and `DISCORD_PRODUCT_CHANNEL_IDS`. Then run:

```powershell
npm run discord:import
```

The importer reads only explicitly selected channels, checks server membership, imports up to 2,000 messages per channel as unpublished drafts, and skips previously imported message IDs. Messages are not automatically interpreted as verified product claims or prices. Review drafts before publishing. Discord attachment links expire; upload downloaded source media to R2 through the editor for durable hosting. The invite supplied during setup expires November 27, 2026; replace the fallback in `app/go/discord/route.ts` with a permanent server invite before that date.

## Deployment

Deploy to a Node.js-compatible Next.js host and set the environment values in that host. Use HTTPS, a production `AUTH_URL`, and `npm run build`. The database and R2 bucket are external; this repository does not require a local database. This project has not been deployed to a public host.
