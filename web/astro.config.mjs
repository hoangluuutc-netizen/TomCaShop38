// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Đổi SITE_URL khi có tên miền thật (ví dụ https://tomcashop.vn)
const SITE_URL = process.env.SITE_URL || 'https://tomcashop38.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // Xuất /trang.html (không phải /trang/index.html) để Cloudflare Pages phục vụ /trang trực tiếp, không chuyển hướng 308
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(gio-hang|dat-hang|cam-on)\/?$/.test(page),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
