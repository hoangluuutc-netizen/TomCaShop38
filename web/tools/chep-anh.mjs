// Chép ảnh sản phẩm từ products/anh/ sang public/anh-sp/ trước khi chạy dev/build.
import fs from 'node:fs';
import path from 'node:path';
const nguon = path.resolve('../products/anh');
const dich = path.resolve('public/anh-sp');
fs.rmSync(dich, { recursive: true, force: true });
fs.mkdirSync(dich, { recursive: true });
let n = 0;
if (fs.existsSync(nguon)) {
  for (const f of fs.readdirSync(nguon)) {
    if (/\.(jpe?g|png|webp|avif|gif)$/i.test(f)) { fs.copyFileSync(path.join(nguon, f), path.join(dich, f)); n++; }
  }
}
console.log(`[chep-anh] Đã chép ${n} ảnh sản phẩm.`);
