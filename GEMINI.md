# GEMINI.md — TomcaShop38 (Đồng bộ Antigravity & Claude)

Tệp này đồng bộ quy tắc làm việc của **Antigravity** với `CLAUDE.md` và bộ kỹ năng trong `.claude/` để đảm bảo nhất quán thương hiệu, số liệu và kiến trúc Website & Fanpage của **TomcaShop38**.

## 1. Nguồn luật & Thương hiệu
- **Luôn đọc `CLAUDE.md`** và thư mục **`brand/`** trước khi viết nội dung hoặc chỉnh sửa giao diện.
- **Nguồn dữ liệu duy nhất:** Giá, size, chất liệu, tồn kho CHỈ lấy từ `products/products.csv`. Nếu thiếu thông tin phải hỏi người dùng, tuyệt đối không tự điền hay bịa số đơn/đánh giá/chứng nhận.
- **Quy tắc ngôn từ:** Tiếng Việt có dấu, xưng `"shop"` – gọi `"bố mẹ/ba mẹ"`. Giá dạng `1.290.000đ`, ngày `dd/mm/yyyy`, điện thoại `0xxx xxx xxx`. Không dùng từ tuyệt đối (`"tốt nhất"`, `"số 1"`, `"100%"`, `"an toàn tuyệt đối"`, `"rẻ nhất"`).

## 2. Kiến trúc Website (`web/`) & Fanpage (`fanpage/`)
- **Công nghệ Web:** Astro + Tailwind CSS, dữ liệu từ `products/products.csv`, host Cloudflare Pages. Thiết kế **mobile-first (390px trước)**, font `Be Vietnam Pro`.
- **Thành phần bắt buộc:** Nút nổi Zalo + Messenger + Gọi điện; thanh toán COD (mặc định) + chuyển khoản QR; form địa chỉ dùng danh mục tỉnh/thành – phường/xã hiện hành.
- **Tận dụng tài nguyên `.claude/`:** Khi làm giao diện, nội dung hoặc kiểm duyệt, đọc và áp dụng đúng chuẩn từ:
  - `.claude/skills/tomcashop-brand/SKILL.md`
  - `.claude/skills/ui-ux-pro-max/SKILL.md`
  - `.claude/agents/kiem-duyet-qc.md` (kiểm duyệt bài fanpage)
  - `.claude/agents/qa-web.md` (kiểm thử web)

## 3. Quy trình làm việc & Kiểm thử
- **Việc lớn:** Lập kế hoạch bằng `/plan`, chờ duyệt rồi mới sửa code.
- **Bảo mật:** Không đưa `.env`, khóa API, số tài khoản, dữ liệu khách hàng lên Git.
- **Nghiệm thu Web:** Trước khi báo xong phải chạy `npm run build` không lỗi và kiểm tra giao diện thực tế (qua `/browser` hoặc Playwright) ở kích thước **390px** và **1280px**.
- **Kết thúc:** Commit Git với mô tả tiếng Việt và ghi 1 dòng vào `docs/nhat-ky.md`.

## 4. Luật khóa phiên (Bắt buộc — Không được bỏ qua)
Không bao giờ báo "đã xong" hoặc chuyển công cụ khi chưa hoàn tất đủ 4 bước theo đúng thứ tự:
1. **Xong 1 việc:** Đúng phạm vi đã duyệt, đúng số liệu `products/products.csv` và chuẩn `brand/`.
2. **Test pass:** Chạy `npm run build` không lỗi và kiểm tra giao diện thực tế (`/browser` hoặc Playwright) ở **390px** và **1280px** (với bài Fanpage: kiểm duyệt theo `kiem-duyet-qc`).
3. **Cập nhật nhật ký:** Ghi 1 dòng tóm tắt kết quả vào `docs/nhat-ky.md`.
4. **Commit Git:** Kiểm tra `git status` (không để lọt `.env`, khóa API, dữ liệu khách) và `git commit` với mô tả tiếng Việt trước khi kết thúc phiên.

## 5. Luật tiếp quản khi hết token / đổi công cụ
- **Tình huống 1 (bên trước đã `git commit` sạch):** Đọc `git log -n 3` và `docs/nhat-ky.md` rồi dùng `/plan` cho bước tiếp theo.
- **Tình huống 2 (bên trước bị ngắt giữa chừng, chưa test/chưa commit):** Không xóa hay sửa đè bừa bãi; chạy ngay `git status` và `git diff`, đối chiếu `CLAUDE.md` + `products/products.csv` + `brand/`, chạy `npm run build` kiểm tra hiện trạng rồi báo ngắn trước khi hoàn thiện nốt theo **Luật khóa phiên**.
