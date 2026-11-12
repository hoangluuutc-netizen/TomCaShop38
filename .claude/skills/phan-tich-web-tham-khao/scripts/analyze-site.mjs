// Phân tích 1 website tham khảo: chụp màn hình + "design tokens" + cấu trúc + công nghệ + tốc độ.
// Dùng (từ thư mục gốc dự án tomcashop/):
//   node .claude/skills/phan-tich-web-tham-khao/scripts/analyze-site.mjs <url> docs/tham-khao/<ten-ngan>
// Cài lần đầu: cd .claude/skills/phan-tich-web-tham-khao/scripts && npm install
//   (dùng Google Chrome có sẵn trên máy; nếu không có Chrome: npx playwright install chromium)
//
// Nguyên tắc: chỉ QUAN SÁT như một người xem bình thường. Tôn trọng robots.txt; gặp trang đăng nhập,
// captcha hoặc chặn bot thì DỪNG, không tìm cách vượt. Không tải về mã nguồn/ảnh/font của trang gốc.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Chưa cài playwright cho skill. Chạy: cd .claude/skills/phan-tich-web-tham-khao/scripts && npm install');
  process.exit(1);
}

const thamSo = process.argv.slice(2);
const daDocDieuKhoan = thamSo.includes('--da-doc-dieu-khoan');
const [url, out = 'docs/tham-khao/site'] = thamSo.filter((x) => !x.startsWith('--'));
if (!url || !/^https?:\/\//.test(url)) { console.error('Dùng: node analyze-site.mjs <https://...> [thư-mục-lưu] [--da-doc-dieu-khoan]'); process.exit(1); }

// ---- 0. Quyền truy cập ----
// Trang của chính shop: chạy thoải mái.
const CUA_SHOP = /(^|\.)tomcashop38\.pages\.dev$|^localhost$|^127\.0\.0\.1$/;
// Trang đã biết cấm/không hợp truy cập tự động (khảo sát 11/11/2026: Amazon cấm trợ lý AI trong điều khoản;
// Shopee bắt đăng nhập; eBay/Etsy/Taobao chặn bot). Chỉ xem BẰNG TAY, không chạy script.
const KHONG_TU_DONG = /(^|\.)(amazon\.[a-z.]+|shopee\.[a-z.]+|taobao\.com|tmall\.com|ebay\.[a-z.]+|etsy\.com|1688\.com)$/i;
const host = new URL(url).hostname;
if (KHONG_TU_DONG.test(host)) {
  console.error(`DỪNG: ${host} cấm hoặc chặn truy cập tự động. Hãy mở trang bằng tay để quan sát, ghi nhận xét vào phan-tich.md.`); process.exit(2);
}
if (!CUA_SHOP.test(host) && !daDocDieuKhoan) {
  console.error(`DỪNG: ${host} không phải trang của shop. Trước khi chạy, đọc Điều khoản sử dụng của trang (mục "automated access", "bots", "scraping", "AI").\n` +
    'Nếu điều khoản KHÔNG cấm việc xem tự động, chạy lại kèm cờ --da-doc-dieu-khoan và ghi link điều khoản vào phan-tich.md.'); process.exit(2);
}

const anh = path.join(out, 'anh'); // ảnh chụp trang của người khác: chỉ để phân tích nội bộ, KHÔNG đưa lên Git
await fs.mkdir(anh, { recursive: true });

// ---- 1. robots.txt: nếu trang cấm truy cập tự động đường dẫn này thì dừng ----
async function robotsChoPhep(u) {
  try {
    const { origin, pathname } = new URL(u);
    const r = await fetch(origin + '/robots.txt', { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { ok: true, ghiChu: `robots.txt ${r.status} → coi như cho phép` };
    let ap = false; const cam = []; const cho = [];
    for (const dong of (await r.text()).split(/\r?\n/)) {
      const [k, ...v] = dong.split(':'); const val = v.join(':').trim(); const key = k.trim().toLowerCase();
      if (key === 'user-agent') ap = val === '*';
      else if (ap && key === 'disallow' && val) cam.push(val);
      else if (ap && key === 'allow' && val) cho.push(val);
    }
    // Quy tắc robots: '*' = chuỗi bất kỳ, '$' = kết thúc; so với đường dẫn + query
    const dich = (p) => new RegExp('^' + p.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$|\$$/, '$'));
    const dg = pathname + new URL(u).search;
    const khop = (ds) => ds.filter((p) => dich(p).test(dg)).sort((a, b) => b.length - a.length)[0];
    const c = khop(cam), a = khop(cho);
    return c && (!a || c.length > a.length) ? { ok: false, ghiChu: `robots.txt cấm "${c}"` } : { ok: true, ghiChu: 'robots.txt cho phép' };
  } catch (e) { return { ok: true, ghiChu: 'không đọc được robots.txt (' + e.message + ')' }; }
}
const robots = await robotsChoPhep(url);
console.log('•', robots.ghiChu);
if (!robots.ok) { console.error('DỪNG: trang không cho phép truy cập tự động đường dẫn này. Hãy xem bằng tay hoặc chọn trang khác.'); process.exit(2); }

// ---- 2. Mở trình duyệt: ưu tiên Chrome có sẵn trên máy ----
let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch {
  try { browser = await chromium.launch(); } catch {
    console.error('Không mở được trình duyệt. Cài Google Chrome, hoặc chạy: npx playwright install chromium'); process.exit(1);
  }
}

const report = { url, analyzedAt: new Date().toISOString(), robots: robots.ghiChu, viewports: {} };
const DAU_HIEU_CHAN = /captcha|are you a robot|not a robot|verify you are|pardon our interruption|access denied|access restricted|unauthorized|automated access|ai agent|are you human|đăng nhập để tiếp tục|login required|log in to continue|cloudflare ray id/i;

for (const [name, viewport] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 800 }]]) {
  const ctx = await browser.newContext({ viewport, locale: 'vi-VN', ...(name === 'mobile' ? { isMobile: true, hasTouch: true } : {}) });
  const page = await ctx.newPage();
  const requests = [];
  page.on('response', async (r) => {
    const req = r.request();
    requests.push({ url: req.url(), type: req.resourceType(), status: r.status(), size: Number(r.headers()['content-length'] || 0) });
  });
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => ({ loi: e.message }));
  await Promise.race([page.waitForLoadState('networkidle'), page.waitForTimeout(8000)]).catch(() => {});

  const status = res && typeof res.status === 'function' ? res.status() : null;
  const chan = await page.evaluate((re) => new RegExp(re, 'i').test(document.title + ' ' + (document.body?.innerText || '').slice(0, 2000)), DAU_HIEU_CHAN.source);
  if (!status || status >= 400 || chan) {
    report.viewports[name] = { dung: true, ly_do: res?.loi || (chan ? 'Gặp trang đăng nhập/captcha/chặn bot' : `HTTP ${status}`), finalUrl: page.url() };
    console.warn(`• ${name}: DỪNG — ${report.viewports[name].ly_do}. Không vượt chặn; hãy xem trang bằng tay.`);
    await page.screenshot({ path: `${anh}/${name}-bi-chan.png` }).catch(() => {});
    await ctx.close();
    continue;
  }

  // Cuộn từ từ để ảnh/hiệu ứng lazy-load hiện ra (như người xem thật)
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight && y < 30000; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${anh}/${name}-dau-trang.png` });
  await page.screenshot({ path: `${anh}/${name}-toan-trang.png`, fullPage: true }).catch(() => {});

  const data = await page.evaluate(async () => {
    // Đổi mọi kiểu màu (oklch, lab, color()...) về rgb bằng canvas 1×1 rồi về #HEX
    const cv = document.createElement('canvas'); cv.width = cv.height = 1; const g = cv.getContext('2d', { willReadFrequently: true });
    const boNho = new Map();
    const veRgb = (c) => {
      if (!c || /^rgba?\(/.test(c)) return c;
      if (boNho.has(c)) return boNho.get(c);
      g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = c; g.fillRect(0, 0, 1, 1);
      const [r, gg, b, a] = g.getImageData(0, 0, 1, 1).data; const kq = `rgba(${r}, ${gg}, ${b}, ${(a / 255).toFixed(2)})`;
      boNho.set(c, kq); return kq;
    };
    const boGoc = (v) => v.split(' ').map((x) => (parseFloat(x) >= 999 ? 'tròn' : x)).join(' ');
    const hex = (c0) => { const c = veRgb(c0); const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m) return c; if (m[4] !== undefined && +m[4] === 0) return null; return '#' + [m[1], m[2], m[3]].map((x) => (+x).toString(16).padStart(2, '0')).join('').toUpperCase() + (m[4] !== undefined && +m[4] < 1 ? ` (${Math.round(m[4] * 100)}%)` : ''); };
    const top = (arr, n = 12) => Object.entries(arr.filter(Boolean).reduce((m, v) => (m[v] = (m[v] || 0) + 1, m), {}))
      .sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({ value, count }));
    const els = [...document.querySelectorAll('body *')].filter((e) => e.getClientRects().length).slice(0, 4000);
    const cs = els.map((e) => getComputedStyle(e));
    const chu = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    // Khối chính: con cấp 1 của <main> (hoặc body), theo thứ tự từ trên xuống
    const goc = document.querySelector('main') || document.body;
    const khoi = [...goc.children].filter((e) => e.getBoundingClientRect().height > 40).slice(0, 40).map((e) => ({
      tag: e.tagName.toLowerCase(), cao: Math.round(e.getBoundingClientRect().height),
      tieuDe: chu(e.querySelector('h1,h2,h3') || e).slice(0, 50),
      nen: hex(getComputedStyle(e).backgroundColor), coAnh: !!e.querySelector('img,picture,video,canvas'),
    }));
    // Tốc độ (Performance API)
    const lcp = await new Promise((r) => { let v = 0; try { new PerformanceObserver((l) => { for (const x of l.getEntries()) v = x.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {} setTimeout(() => r(Math.round(v)), 300); });
    const cls = await new Promise((r) => { let v = 0; try { new PerformanceObserver((l) => { for (const x of l.getEntries()) if (!x.hadRecentInput) v += x.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {} setTimeout(() => r(+v.toFixed(3)), 300); });
    const nav = performance.getEntriesByType('navigation')[0];
    const tai = performance.getEntriesByType('resource');
    const kb = (f) => Math.round(tai.filter(f).reduce((t, x) => t + (x.transferSize || 0), 0) / 1024);
    return {
      title: document.title, lang: document.documentElement.lang,
      mau: { chu: top(cs.map((s) => hex(s.color))), nen: top(cs.map((s) => hex(s.backgroundColor))), vien: top(cs.filter((s) => s.borderStyle !== 'none' && parseFloat(s.borderWidth) > 0).map((s) => hex(s.borderColor)), 6) },
      font: { dangDung: top(cs.map((s) => s.fontFamily.split(',')[0].replace(/["']/g, '').trim())), daTai: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/["']/g, '')} ${f.weight}`))].slice(0, 20) },
      coChu: top(cs.map((s) => s.fontSize)), doDam: top(cs.map((s) => s.fontWeight), 6), gianDong: top(cs.map((s) => s.lineHeight), 6),
      boGoc: top(cs.map((s) => boGoc(s.borderRadius)).filter((r) => r !== '0px'), 8),
      doBong: top(cs.map((s) => s.boxShadow).filter((v) => v !== 'none'), 5),
      khoangCach: top(cs.map((s) => s.paddingTop).filter((v) => v !== '0px'), 8),
      dangKhung: { maxWidth: top(cs.map((s) => s.maxWidth).filter((v) => v !== 'none' && v.endsWith('px')), 5), gap: top(cs.map((s) => s.gap).filter((v) => v !== 'normal' && v !== '0px'), 6) },
      danKhung: khoi,
      tieuDe: [...document.querySelectorAll('h1,h2,h3')].slice(0, 60).map((h) => `${h.tagName}: ${chu(h)}`),
      nutCTA: [...document.querySelectorAll('a,button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 80 && r.height > 32 && r.top < innerHeight * 3; })
        .slice(0, 25).map((e) => ({ chu: chu(e).slice(0, 40), nen: hex(getComputedStyle(e).backgroundColor), cao: Math.round(e.getBoundingClientRect().height), boGoc: boGoc(getComputedStyle(e).borderRadius) })).filter((x) => x.chu),
      phanTuDinh: els.filter((e) => ['fixed', 'sticky'].includes(getComputedStyle(e).position)).map((e) => ({ tag: e.tagName.toLowerCase(), viTri: getComputedStyle(e).position, cao: Math.round(e.getBoundingClientRect().height) })).slice(0, 10),
      hieuUng: {
        canvas: document.querySelectorAll('canvas').length,
        webgl: [...document.querySelectorAll('canvas')].some((c) => { try { return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } }),
        video: document.querySelectorAll('video').length, lottie: !!document.querySelector('lottie-player,dotlottie-player,[data-animation-path]'),
        thuVien: { three: !!window.THREE, gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, lenis: !!window.Lenis || !!window.lenis, swiper: !!window.Swiper, splide: !!window.Splide },
        animationDangChay: document.getAnimations ? document.getAnimations().length : null,
        coReducedMotion: [...document.styleSheets].some((ss) => { try { return [...ss.cssRules].some((r) => (r.conditionText || r.media?.mediaText || '').includes('prefers-reduced-motion')); } catch { return false; } }),
      },
      anh: { tong: document.images.length, lazy: [...document.images].filter((i) => i.loading === 'lazy').length, coSrcset: [...document.images].filter((i) => i.srcset).length, dinhDang: top([...document.images].map((i) => (i.currentSrc.match(/\.(avif|webp|jpe?g|png|gif|svg)/i) || [, 'khác'])[1].toLowerCase()), 6) },
      tocDo: { lcp_ms: lcp, cls, domContentLoaded_ms: nav ? Math.round(nav.domContentLoadedEventEnd) : null, tongTai_kb: kb(() => true), js_kb: kb((x) => x.initiatorType === 'script'), css_kb: kb((x) => x.initiatorType === 'link' || /\.css/.test(x.name)), anh_kb: kb((x) => x.initiatorType === 'img' || /\.(png|jpe?g|webp|avif|gif)/.test(x.name)), font_kb: kb((x) => /\.(woff2?|ttf|otf)/.test(x.name)) },
      seo: { description: document.querySelector('meta[name=description]')?.content?.slice(0, 160) || null, ogImage: !!document.querySelector('meta[property="og:image"]'), jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { const j = JSON.parse(s.textContent); return [].concat(j['@graph'] || j).map((x) => x['@type']).join(','); } catch { return '?'; } }) },
    };
  });
  data.status = status;
  data.finalUrl = page.url();
  data.congNghe = [...new Set(requests.filter((r) => r.type === 'script').map((r) => (r.url.match(/(three|gsap|lenis|swiper|splide|framer|lottie|spline|babylon|pixi|webflow|shopify|haravan|sapo|wix|woocommerce|wordpress|_next|nuxt|astro|react|vue|svelte|tailwind|jquery|zalo|facebook|gtag|googletagmanager|tiktok)/i) || [])[1]).filter(Boolean).map((s) => s.toLowerCase().replace('_next', 'next')))];
  data.soRequest = requests.length;
  data.loiRequest = requests.filter((r) => r.status >= 400).length;
  report.viewports[name] = data;
  await ctx.close();
}
await browser.close();

await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2));

// Tóm tắt nhanh dạng markdown để đọc ngay
const m = report.viewports.mobile, d = report.viewports.desktop;
const dong = (v) => (v || []).slice(0, 6).map((x) => `${x.value} (${x.count})`).join(', ');
const tt = !m || m.dung ? `# ${url}\n\nKhông phân tích được trên điện thoại: ${m?.ly_do}\n` : `# Tóm tắt nhanh: ${m.title}
URL: ${url} · ${report.analyzedAt.slice(0, 10)} · ${report.robots}

| Hạng mục | Điện thoại (390px) | Máy tính (1280px) |
| --- | --- | --- |
| Màu chữ | ${dong(m.mau.chu)} | ${d && !d.dung ? dong(d.mau.chu) : '—'} |
| Màu nền | ${dong(m.mau.nen)} | ${d && !d.dung ? dong(d.mau.nen) : '—'} |
| Font | ${dong(m.font.dangDung)} | |
| Cỡ chữ | ${dong(m.coChu)} | |
| Bo góc | ${dong(m.boGoc)} | |
| Số khối chính | ${m.danKhung.length} | ${d && !d.dung ? d.danKhung.length : '—'} |
| Phần tử dính | ${m.phanTuDinh.map((x) => x.tag + '/' + x.viTri).join(', ') || 'không'} | |
| Hiệu ứng | canvas ${m.hieuUng.canvas}, WebGL ${m.hieuUng.webgl}, video ${m.hieuUng.video}, thư viện: ${Object.entries(m.hieuUng.thuVien).filter(([, v]) => v).map(([k]) => k).join(', ') || 'không'} | |
| Công nghệ | ${m.congNghe.join(', ') || '—'} | |
| Tốc độ (điện thoại) | LCP ${m.tocDo.lcp_ms} ms · CLS ${m.tocDo.cls} · tải ${m.tocDo.tongTai_kb} KB (JS ${m.tocDo.js_kb} KB, ảnh ${m.tocDo.anh_kb} KB) | |
| Ảnh | ${m.anh.tong} ảnh, lazy ${m.anh.lazy}, srcset ${m.anh.coSrcset}, ${dong(m.anh.dinhDang)} | |
| SEO | JSON-LD: ${m.seo.jsonLd.join(' | ') || 'không'} · OG image: ${m.seo.ogImage} | |

## Thứ tự khối (điện thoại)
${m.danKhung.map((k, i) => `${i + 1}. ${k.tag} · cao ${k.cao}px · ${k.tieuDe}${k.coAnh ? ' · có ảnh/video' : ''}`).join('\n')}

## Nút kêu gọi (điện thoại)
${m.nutCTA.map((c) => `- "${c.chu}" · nền ${c.nen} · cao ${c.cao}px · bo ${c.boGoc}`).join('\n')}
`;
await fs.writeFile(path.join(out, 'tom-tat.md'), tt);
console.log(`Đã lưu: ${out}/report.json, ${out}/tom-tat.md, ảnh trong ${anh}/ (không đưa ảnh lên Git)`);
