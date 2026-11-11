# KHỞI ĐỘNG — dán câu dưới đây vào Claude Code

Mở thư mục `tomcashop/` trong Claude Code (tab Code của Claude Desktop, hoặc gõ `claude` trong terminal tại thư mục này), rồi dán:

```
Đọc CLAUDE.md, KHOI-DONG.md và docs/cam-nang-du-an.md. Bạn là người triển khai dự án TomCaShop theo kế hoạch trong KHOI-DONG.md.
Bắt đầu từ Giai đoạn 0. Làm lần lượt từng giai đoạn; cuối mỗi giai đoạn dừng lại, tóm tắt đã làm gì, liệt kê việc tôi cần tự làm, và chờ tôi gõ "tiếp" mới sang giai đoạn sau.
Đánh dấu [x] vào checklist trong file này khi xong từng mục.
```

---

## Giai đoạn 0 — Chuẩn bị (≈30 phút)
- [x] Kiểm tra máy có `git`, `node` (bản LTS), `npm`; nếu thiếu, hướng dẫn tôi cài.
- [x] `git init`, commit đầu tiên.
- [x] Nhắc tôi cài plugin: frontend-design, playwright, superpowers, code-review (lệnh trong BAT-DAU.md).
- [x] Kiểm tra brand/ và products/products.csv; hỏi tôi những thông tin còn thiếu (logo, màu chính xác, giọng văn, chính sách đổi trả/ship, SĐT, Zalo, địa chỉ, danh sách sản phẩm).
- [x] Tạo skill dự án `tomcashop-brand` trong .claude/skills/ từ nội dung brand/ (màu, font, logo, giọng văn, từ cấm).
- [x] Ghi docs/chinh-sach.md từ thông tin tôi cung cấp.

## Giai đoạn 1 — Chốt thiết kế
- [x] Dùng skill brainstorming hỏi tôi từng câu để chốt phạm vi; ghi docs/spec-website.md.
- [x] Dùng ui-ux-pro-max + frontend-design làm 3 hướng giao diện trang chủ (HTML tĩnh trong docs/mau-giao-dien/), chụp ở 390px và 1280px để tôi chọn. — **Đã chọn Mẫu A (11/11/2026)**

## Giai đoạn 2 — Dựng website
- [x] Khởi tạo Astro + Tailwind trong web/, font Be Vietnam Pro, đọc sản phẩm từ products/products.csv.
- [x] Trang chủ, danh mục, trang sản phẩm (bảng size, chính sách dưới nút mua).
- [x] Nút nổi Zalo / Messenger / Gọi điện.
- [x] Giỏ hàng + form đặt hàng (COD mặc định, chuyển khoản QR), trang cảm ơn.
- [x] Gửi đơn về Google Sheets qua Apps Script; viết docs/huong-dan-apps-script.md để tôi tự tạo script. — *chờ chủ shop tạo script + dán URL*
- [x] Trang chính sách, giới thiệu, liên hệ.
- [x] SEO: title, meta, Open Graph, sitemap, schema Product.
- [x] Chạy /kiem-tra-web và sửa lỗi. — *đang dùng dữ liệu mẫu MAU-**

## Giai đoạn 3 — Fanpage
- [x] Thiết kế ảnh bìa Fanpage + ảnh đại diện (xuất PNG vào fanpage/). — ảnh bìa xong, đã chọn **A** (fanpage/anh/anh-bia-a.png); *ảnh đại diện chờ logo (khuôn sẵn ở fanpage/anh/nguon/anh-dai-dien.html)*
- [x] Viết phần giới thiệu Trang, hoàn thiện fanpage/messenger/kich-ban.md.
- [x] Lịch nội dung 1 tháng (fanpage/posts/<tháng>/lich.csv) theo 4 trụ cột; viết sẵn caption 2 tuần đầu + 3 kịch bản video ngắn (2–3 phương án A/B).
- [x] Chạy trợ lý con kiem-duyet-qc trên toàn bộ nội dung. — ĐẠT (11/11/2026)

## Giai đoạn 4 — Lên mạng
- [ ] Hướng dẫn tôi tạo kho GitHub và đẩy code (hỏi trước khi push).
- [ ] Hướng dẫn tôi kết nối Cloudflare Pages với kho GitHub, cấu hình build cho Astro, gắn tên miền.
- [ ] Gắn Meta Pixel (ID do tôi cung cấp) với sự kiện ViewContent, AddToCart, Purchase.
- [ ] Kiểm thử lại trên bản đã lên mạng bằng Playwright.

## Giai đoạn 5 — Thanh toán tự động & quảng cáo
- [ ] Tích hợp payOS: tạo link VietQR cho đơn chuyển khoản, nhận webhook (Cloudflare Pages Functions), cập nhật trạng thái đơn. Khóa API đặt trong biến môi trường, không commit.
- [ ] Hướng dẫn tôi đặt thử 1 đơn thật giá trị nhỏ.
- [ ] Soạn 2–3 mẫu quảng cáo mục tiêu Tin nhắn + bảng theo dõi chỉ số (CTR, chi phí/tin nhắn, tỉ lệ chốt, ROAS) trong fanpage/ads/.

## Hằng tuần
- [ ] /bao-cao-tuan
- [ ] Cập nhật CLAUDE.md khi có quy tắc mới
- [ ] Ghi docs/nhat-ky.md, commit và push
