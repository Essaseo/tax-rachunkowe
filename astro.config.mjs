import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://tax-bydgoszcz.pl', // ← zmień na docelową domenę
  integrations: [
    sitemap(),
    mdx(),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
