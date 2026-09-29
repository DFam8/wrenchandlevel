// @ts-check
import { defineConfig } from 'astro/config';

// Static output, served by Cloudflare Workers (see wrangler.jsonc). Set `site` once the domain is bought.
export default defineConfig({
  // site: 'https://wrenchandlevel.com',
  trailingSlash: 'never',
  build: { format: 'directory' },
});
