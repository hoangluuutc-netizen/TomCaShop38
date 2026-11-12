// Kiểm thử giao diện TomcaShop38 bằng Playwright (Chrome có sẵn trên máy), khổ 390px và 1280px.
// Cài lần đầu:  npm run test:e2e:cai          (trong thư mục web/)
// Chạy bản cục bộ: npm run build && npm run test:e2e      → tự bật `astro preview`, chạy xong tự tắt
// Chạy bản online: npm run test:e2e -- https://tomcashop38.pages.dev
// Ảnh chụp lưu ở ../docs/kiem-thu/<ngày>/ (không đưa lên Git).
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(dir, 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); } catch { console.error('Chưa cài: chạy `npm run test:e2e:cai` trong web/'); process.exit(1); }

const webDir = path.resolve(dir, '../..');
let BASE = process.argv[2];
let preview;
if (!BASE) {
  const PORT = 4329;
  BASE = `http://127.0.0.1:${PORT}`;
  preview = spawn(process.execPath, [path.join(webDir, 'node_modules/astro/bin/astro.mjs'), 'preview', '--port', String(PORT), '--host', '127.0.0.1'], { cwd: webDir, stdio: 'ignore' });
  let san = false;
  for (let i = 0; i < 60 && !san; i++) { try { san = (await fetch(BASE)).ok; } catch {} if (!san) await new Promise((r) => setTimeout(r, 500)); }
  if (!san) { preview.kill(); console.error('Không bật được astro preview — đã chạy npm run build chưa?'); process.exit(1); }
}
const coHam = !BASE.includes('127.0.0.1') && !BASE.includes('localhost'); // bản online có Pages Functions
const ngay = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }); // yyyy-mm-dd giờ Việt Nam
const ANH = path.resolve(webDir, `../docs/kiem-thu/${ngay}/e2e`);
await fs.mkdir(ANH, { recursive: true });

let dat = 0, loi = 0;
const ketQua = [];
const kt = (ten, ok, chiTiet = '') => { ok ? dat++ : loi++; ketQua.push(`${ok ? '✔' : '✘'} ${ten}${chiTiet ? ' — ' + chiTiet : ''}`); };

let browser;
try { browser = await chromium.launch({ channel: 'chrome' }); } catch { browser = await chromium.launch(); }
try {
  // 1. Các trang ở 2 khổ
  const TRANG = ['/', '/danh-muc/vali-tre-em', '/danh-muc/cap-da-tre-em', '/danh-muc/do-dung-be', '/tim-kiem?q=cap', '/gio-hang', '/dat-hang', '/cam-on', '/chinh-sach/van-chuyen', '/chinh-sach/bao-mat', '/gioi-thieu', '/lien-he'];
  const sku = (await (await fetch(BASE + '/du-lieu-sp.json')).json()).map((s) => s.url);
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    const loiJs = []; p.on('pageerror', (e) => loiJs.push(e.message));
    const hong = [];
    for (const u of [...TRANG, ...sku]) {
      const r = await p.goto(BASE + u, { waitUntil: 'networkidle' });
      const i = await p.evaluate(() => ({
        tran: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        h1: document.querySelectorAll('h1').length, font: getComputedStyle(document.body).fontFamily.includes('Be Vietnam'),
        moTa: !!document.querySelector('meta[name=description]')?.content, title: !!document.title,
        nutNho: [...document.querySelectorAll('header a, header button, main button, main a.chip')].filter((e) => { const b = e.getBoundingClientRect(); return b.height > 0 && b.height < 44; }).length,
      }));
      const van = [];
      if (r.status() !== 200 && u !== '/dat-hang') van.push('HTTP ' + r.status()); // /dat-hang giỏ trống tự chuyển về giỏ
      if (i.tran) van.push('tràn ngang'); if (i.h1 !== 1) van.push(i.h1 + ' H1'); if (!i.font) van.push('sai font');
      if (!i.moTa || !i.title) van.push('thiếu title/description'); if (i.nutNho) van.push(i.nutNho + ' nút < 44px');
      if (van.length) hong.push(`${u}: ${van.join(', ')}`);
    }
    await p.goto(BASE + '/', { waitUntil: 'networkidle' }); await p.screenshot({ path: `${ANH}/trang-chu-${w}.png`, fullPage: true });
    kt(`${TRANG.length + sku.length} trang ở ${w}px: không tràn, 1 H1, đúng font, đủ SEO, nút ≥ 44px`, !hong.length, hong.join(' | '));
    kt(`không lỗi JavaScript ở ${w}px`, !loiJs.length, loiJs.join(' | '));
    await ctx.close();
  }

  // 2. Luồng mua hàng trên điện thoại
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const ds = await (await fetch(BASE + '/du-lieu-sp.json')).json();
  const mot = ds.find((s) => s.tonKho > 0 && s.mau.length > 1), hai = ds.find((s) => s.tonKho > 0 && s.sku !== mot.sku);

  await p.goto(BASE + '/tim-kiem?q=cap', { waitUntil: 'networkidle' });
  const timKhongDau = await p.evaluate(() => [...document.querySelectorAll('[data-the-sp]')].filter((e) => !e.hidden).length);
  kt('tìm kiếm không dấu ("cap" ra cặp)', timKhongDau > 0, timKhongDau + ' kết quả');

  await p.goto(BASE + '/tim-kiem?tuoi=3-5', { waitUntil: 'networkidle' });
  const loc = await p.evaluate(() => [...document.querySelectorAll('[data-the-sp]')].filter((e) => !e.hidden).every((e) => e.dataset.tuoi.split(' ').includes('3-5')));
  kt('lọc theo tuổi 3–5 chỉ hiện sản phẩm đúng tuổi', loc);

  await p.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await p.goto(BASE + mot.url, { waitUntil: 'networkidle' });
  await p.locator(`label:has(input[value="${mot.mau[1]}"])`).click();
  await p.locator('[data-khoi-nut] [data-them]').click();
  const gio1 = await p.evaluate(() => JSON.parse(localStorage.getItem('tomca-gio-v1') || '[]'));
  kt('thêm vào giỏ đúng màu đã chọn', gio1[0]?.mau === mot.mau[1], JSON.stringify(gio1));
  await p.evaluate(() => window.scrollTo(0, 1600)); await p.waitForTimeout(600);
  kt('thanh mua dính đáy hiện khi cuộn qua nút mua', await p.evaluate(() => !document.querySelector('[data-thanh-mua]')?.classList.contains('translate-y-full')));

  await p.goto(BASE + '/gio-hang', { waitUntil: 'networkidle' });
  const chu1 = await p.locator('[data-tien-do-chu]').textContent();
  kt('giỏ 1 món: nhắc thêm 1 món để miễn ship', /Thêm 1 sản phẩm/.test(chu1), chu1);
  await p.goto(BASE + hai.url, { waitUntil: 'networkidle' });
  await p.locator('[data-khoi-nut] [data-them]').click();
  await p.goto(BASE + '/gio-hang', { waitUntil: 'networkidle' });
  const tong = await p.locator('[data-tong-tien]').textContent();
  const dung = (mot.gia + hai.gia).toLocaleString('vi-VN') + 'đ';
  kt('giỏ 2 món: miễn ship, tổng tiền khớp dữ liệu', (await p.locator('[data-phi-ship]').textContent()).includes('Miễn phí') && tong === dung, `${tong} (đúng: ${dung})`);

  await p.goto(BASE + '/dat-hang', { waitUntil: 'networkidle' });
  await p.locator('[data-nut-dat]').click();
  kt('form trống báo đủ 5 lỗi', (await p.locator('[data-loi]:not(.hidden)').count()) === 5);
  await p.fill('[name=hoTen]', 'Kiểm Thử Tự Động'); await p.fill('[name=sdt]', '0912 345 678');
  await p.selectOption('[name=tinh]', { label: 'Thành phố Hà Nội' });
  await p.fill('[data-loc-xa]', 'ba dinh');
  kt('lọc phường/xã không dấu', (await p.locator('[name=xa] option').count()) === 2);
  await p.selectOption('[name=xa]', { index: 1 }); await p.fill('[name=diaChi]', 'Đơn kiểm thử tự động');
  await p.locator('[data-nut-dat]').click(); await p.waitForURL(/cam-on/); await p.waitForTimeout(400);
  const ma = await p.locator('[data-ma-don]').first().textContent();
  kt('đặt đơn COD → trang cảm ơn có mã đơn, giỏ được xóa', /^TC\d{6}-\d{3}$/.test(ma) && (await p.evaluate(() => localStorage.getItem('tomca-gio-v1'))) === '[]', ma);
  await p.screenshot({ path: `${ANH}/cam-on-cod-390.png`, fullPage: true });

  await p.goto(BASE + mot.url, { waitUntil: 'networkidle' });
  await p.locator('[data-khoi-nut] [data-mua-ngay]').click(); await p.waitForURL(/dat-hang/); await p.waitForTimeout(500);
  await p.fill('[name=hoTen]', 'Kiểm Thử CK'); await p.fill('[name=sdt]', '+84 987 654 321');
  await p.selectOption('[name=tinh]', { index: 5 }); await p.selectOption('[name=xa]', { index: 2 }); await p.fill('[name=diaChi]', 'Đơn kiểm thử');
  await p.locator('label:has(input[value=CK])').click(); await p.locator('[data-nut-dat]').click(); await p.waitForURL(/cam-on/); await p.waitForTimeout(500);
  const ck = await p.evaluate(() => ({ khoi: !document.querySelector('[data-ck]').classList.contains('hidden'), qr: !document.querySelector('[data-co-qr]').classList.contains('hidden'), chuaQr: !document.querySelector('[data-chua-qr]').classList.contains('hidden'), sdt: document.querySelector('[data-sdt]').textContent }));
  kt('đặt đơn chuyển khoản → hiện khối chuyển khoản (QR hoặc hướng dẫn Zalo), SĐT +84 chuẩn hóa', ck.khoi && (ck.qr || ck.chuaQr) && ck.sdt === '0987 654 321', JSON.stringify(ck));
  await p.screenshot({ path: `${ANH}/cam-on-ck-390.png`, fullPage: true });

  const nut = await p.evaluate(() => ({ zalo: document.querySelector('[data-nut-noi] a')?.getAttribute('href'), goi: document.querySelector('[data-nut-noi] a[href^="tel:"]')?.getAttribute('href') }));
  kt('nút nổi Zalo + Gọi đúng số', nut.zalo === 'https://zalo.me/0948999433' && nut.goi === 'tel:0948999433');
  await ctx.close();

  // 3. Hàm máy chủ payOS (chỉ có ở bản online)
  if (coHam) {
    const a = await fetch(BASE + '/api/payos/webhook'); kt('GET /api/payos/webhook → 200', a.status === 200);
    const b = await fetch(BASE + '/api/payos/webhook', { method: 'POST', body: '{"data":{"a":1},"signature":"x"}' }); kt('webhook chữ ký sai → 200, không xử lý', b.status === 200 && !(await b.json()).ok);
  }
} finally {
  await browser.close();
  preview?.kill();
}

console.log(`\nKiểm thử giao diện ${BASE}\n` + ketQua.join('\n') + `\n\n${dat} đạt · ${loi} lỗi · ảnh: ${ANH}`);
process.exit(loi ? 1 : 0);
