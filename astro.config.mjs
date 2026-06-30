// @ts-check
import { defineConfig } from 'astro/config';

// Minimal static-site config. No integrations, no CSS framework.
// Hosted on Cloudflare Pages, served at the site root (base defaults to '/').
export default defineConfig({
  site: 'https://apericmc.com',
});
