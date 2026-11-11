// Xuất ảnh từ brand/logo.png: ảnh đại diện Fanpage, logo website, favicon.
// Chạy: node tools/xuat-logo.mjs  (trong thư mục web/)
import sharp from 'sharp';
import fs from 'node:fs';

const LOGO = '../brand/logo.png';
const meta = await sharp(LOGO).metadata();
console.log('logo:', meta.width + 'x' + meta.height);

// 1) Ảnh đại diện Fanpage 720×720 — nền xanh nhạt, vòng tròn trắng viền xanh, logo ở giữa
const S = 720, R = 340;
const C = S / 2;
const nen = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="100%" height="100%" fill="#fff"/></svg>`);
// Lớp phủ: tô xanh nhạt phần ngoài vòng tròn + vẽ viền, để che góc vuông của logo
const phu = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
  <path fill="#EEF7FD" fill-rule="evenodd" d="M0 0H${S}V${S}H0Z M${C - R} ${C}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 -${2 * R} 0Z"/>
  <circle cx="${C}" cy="${C}" r="${R - 11}" fill="none" stroke="#2B8FD6" stroke-width="22"/>
  <circle cx="${C}" cy="${C}" r="${R - 27}" fill="none" stroke="#D6ECFA" stroke-width="8"/>
</svg>`);
const KL = 520; // cỡ logo: giữ chữ "TomcaShop38" nằm trọn trong vòng tròn
const logoNho = await sharp(LOGO).resize(KL, KL).toBuffer();
await sharp(nen)
  .composite([{ input: logoNho, top: (S - KL) / 2, left: (S - KL) / 2 }, { input: phu, top: 0, left: 0 }])
  .png().toFile('../fanpage/anh/anh-dai-dien.png');

// 2) Logo cho website (header 44px → xuất 2–3 lần cho màn hình nét)
fs.mkdirSync('public', { recursive: true });
await sharp(LOGO).resize(160, 160).webp({ quality: 90 }).toFile('public/logo-160.webp');
await sharp(LOGO).resize(512, 512).png({ compressionLevel: 9 }).toFile('public/logo-512.png');

// 3) Favicon: chỉ lấy phần tôm + cá (bỏ chữ, vì 32px không đọc được chữ)
const cat = { left: 185, top: 10, width: 880, height: 880 };
const bieuTuong = await sharp(LOGO).extract(cat).toBuffer();
await sharp(bieuTuong).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(bieuTuong).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('public/apple-touch-icon.png');
await sharp(bieuTuong).resize(192, 192).png().toFile('public/icon-192.png');

// 4) Màu chủ đạo của logo (lấy trung bình vùng thân tôm và thân cá)
const mau = async (left, top, w, h) => {
  const { data } = await sharp(LOGO).extract({ left, top, width: w, height: h }).raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 3) { r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
  return '#' + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('').toUpperCase();
};
console.log('màu tôm   :', await mau(380, 250, 120, 80));
console.log('màu cá    :', await mau(880, 620, 120, 100));
console.log('màu vòng nước:', await mau(150, 700, 40, 40));
console.log('màu chữ Shop:', await mau(720, 960, 40, 60));
console.log('đã xuất: fanpage/anh/anh-dai-dien.png, public/logo-160.webp, logo-512.png, favicon-32.png, apple-touch-icon.png, icon-192.png');
