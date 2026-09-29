// /sitemap.xml: every page in src/pages except the ones kept out of search.
import type { APIRoute } from 'astro';

const skip = new Set(['/booked']);

export const GET: APIRoute = ({ site }) => {
  const paths = Object.keys(import.meta.glob('./**/*.astro'))
    .map((f) => f.replace(/^\.\//, '/').replace(/\.astro$/, '').replace(/\/?index$/, '') || '/')
    .filter((p) => !skip.has(p))
    .sort();

  const urls = paths.map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
