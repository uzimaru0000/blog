import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap(), tailwind()],
  output: "server",
  adapter: cloudflare({
    mode: 'advanced',
    runtime: 'local'
  })
});