// Central media URL config.
//
// All images and videos live in the Cloudflare R2 bucket (synced from the
// local media/ folder via `rclone`). Pages reference them through media()
// below, so there is exactly ONE place to set the address.
//
// Because these are absolute URLs, `npm run dev` / `npm run build` locally
// fetch the SAME files as the deployed site — local testing matches production.
//
// TODO: replace MEDIA_BASE with your real R2 public URL once the bucket exists.
//   - Quick test URL Cloudflare gives you looks like: https://pub-xxxxxxxx.r2.dev
//   - Or your custom domain once set up:             https://media.apericmc.com
export const MEDIA_BASE = 'https://pub-e31ea5e787264887a5f04d62c1e6e4da.r2.dev';

// media('/team/jake.png') -> 'https://media.apericmc.com/team/jake.png'
export const media = (p) => `${MEDIA_BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
