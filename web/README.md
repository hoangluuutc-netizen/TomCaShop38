# Website TomcaShop38 (Astro 7 + Tailwind 4)

| Lệnh | Việc |
| --- | --- |
| `npm install` | Cài thư viện (lần đầu / sau khi đổi package.json) |
| `npm run sua-loi-windows` | **Chạy sau mỗi lần `npm install` trên máy Windows này** — xem lưu ý dưới |
| `npm run dev` | Chạy thử khi đang sửa (http://localhost:4321) |
| `npm run build` | Tạo bản web hoàn chỉnh vào `dist/` |
| `npm run preview` | Xem bản đã build |
| `npm test` | Kiểm thử đơn vị: dữ liệu sản phẩm, định dạng, payOS (không cần build, không gọi mạng thật) |
| `npm run test:e2e:cai` | Cài Playwright cho kiểm thử giao diện (lần đầu, dùng Chrome có sẵn) |
| `npm run test:e2e` | Kiểm thử giao diện 390px + 1280px trên bản build (tự bật preview). Bản online: `npm run test:e2e -- https://tomcashop38.pages.dev` |

## Lưu ý máy Windows có Application Control / Smart App Control
Astro 7 dùng trình biên dịch dạng file native (`astro.win32-x64-msvc.node`). Chính sách bảo mật Windows trên máy này chặn file đó
(lỗi `Cannot find native binding ... An Application Control policy has blocked this file`).
`npm run sua-loi-windows` cài bản WebAssembly dự phòng **chỉ trên máy này** (không ghi vào package.json); Astro tự dùng khi bản native bị chặn.
Cloudflare Pages (Linux) dùng bản native bình thường, không cần bước này.

## Cấu hình Cloudflare Pages
Root directory `web` · Build `npm run build` · Output `dist` · Node 24 (`.node-version`; nếu đã đặt biến `NODE_VERSION` trên Cloudflare thì đặt `24`).
Hàm máy chủ payOS: `functions/api/payos/*` (dùng chung `lib-server/payos.ts`). Hướng dẫn: `../docs/huong-dan-len-mang.md`, `../docs/huong-dan-payos.md`.
