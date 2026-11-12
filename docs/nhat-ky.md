# Nhật ký dự án TomCaShop

| Ngày | Việc đã làm | Ghi chú |
| --- | --- | --- |
| 11/11/2026 | Giai đoạn 0: git init, tạo skill tomcashop-brand (bản nháp), phiếu docs/can-bo-sung.md | Chờ chủ shop bổ sung thông tin + sản phẩm |
| 11/11/2026 | Nhận thông tin shop: cập nhật hồ sơ thương hiệu, viết docs/chinh-sach.md, điền kịch bản Messenger, hoàn thiện skill tomcashop-brand | Còn thiếu logo, màu, sản phẩm |
| 11/11/2026 | Giai đoạn 1: viết docs/spec-website.md, làm 3 mẫu giao diện trang chủ (A/B/C) + ảnh 390/1280px | Chờ chủ shop chọn mẫu |
| 11/11/2026 | Chủ shop chọn Mẫu A; chốt bảng màu (xanh #2B8FD6, hồng #E85A8B) + quy tắc tương phản vào skill tomcashop-brand | Kết thúc Giai đoạn 1 |
| 11/11/2026 | Giai đoạn 2 (bước 1–3): khảo sát 17 web (docs/tham-khao-giao-dien.md), khởi tạo Astro + Tailwind, 9 sản phẩm mẫu, header/footer/nút nổi, trang chủ | Dữ liệu mẫu MAU-* |
| 11/11/2026 | Giai đoạn 2 xong (dữ liệu mẫu): danh mục/tìm kiếm có lọc, trang sản phẩm, giỏ hàng, đặt hàng 34 tỉnh–3.321 xã, cảm ơn + QR, Apps Script, chính sách, SEO; kiểm thử 390/1280px đạt | Chờ sản phẩm thật, URL Apps Script, ngân hàng, link m.me |
| 11/11/2026 | Giai đoạn 3: thông tin Trang, kịch bản Messenger, lịch 16/11–13/12 (18 bài), 6 bài + 3 kịch bản video A/B; kiểm duyệt QC ĐẠT | Ảnh bìa làm ở phiên riêng; ảnh đại diện chờ logo |
| 11/11/2026 | Giai đoạn 3: 2 phương án ảnh bìa Fanpage 1640×624 + ảnh xem trước + khuôn ảnh đại diện | Chờ chủ shop chọn A/B, gửi logo |
| 11/11/2026 | Chủ shop chọn ảnh bìa Fanpage phương án A | Giai đoạn 3 hoàn tất (trừ ảnh đại diện chờ logo) |
| 11/11/2026 | Nhận logo: xuất ảnh đại diện Fanpage, logo + favicon website, ghi màu logo vào skill | Hỏi chủ shop tên hiển thị TomCaShop hay TomcaShop38 |
| 11/11/2026 | Đổi tên hiển thị TomCaShop → TomcaShop38 (web, Fanpage, Messenger, bài viết, hồ sơ, skill, CLAUDE.md); xuất lại ảnh bìa A/B, ảnh xem trước, ảnh chia sẻ Facebook có logo; domain tạm tomcashop38.pages.dev | Username đề xuất @tomcashop38 |
| 11/11/2026 | Giai đoạn 4: chuẩn bị Cloudflare Pages (.node-version, _headers), gắn Meta Pixel bật theo biến môi trường (5 sự kiện, đã thử), hướng dẫn docs/huong-dan-len-mang.md | Chờ URL kho GitHub, Pixel ID |
| 11/11/2026 | Đẩy code lên GitHub hoangluuutc-netizen/TomCaShop38 (nhánh main) | Tiếp: kết nối Cloudflare Pages |
| 12/11/2026 | Kiểm thử bản online tomcashop38.pages.dev: 13 trang × 390/1280px đạt, đặt thử COD + CK đạt; sửa chuyển hướng 308 (build.format file) + canonical | |
| 12/11/2026 | Kiểm thử lại sau sửa chuyển hướng: các trang 200 trực tiếp, đặt hàng thông suốt. Giai đoạn 4 xong (trừ tên miền, Pixel ID) | |
| 12/11/2026 | Giai đoạn 5 phần A: payOS qua Cloudflare Pages Functions (tạo link tính lại tiền ở máy chủ, webhook kiểm chữ ký), Apps Script cập nhật trạng thái, hướng dẫn docs/huong-dan-payos.md; 16 kiểm thử hàm + Playwright 390/1280 đạt | Chờ tài khoản payOS + khóa |
| 12/11/2026 | Giai đoạn 5 phần B: 3 mẫu quảng cáo mục tiêu Tin nhắn (A/B, kiểm duyệt ĐẠT sau 2 lượt), bảng Excel theo dõi CTR/chi phí tin nhắn/tỉ lệ chốt/ROAS + ngân sách hòa vốn | Chỉ chạy QC khi đủ 5 điều kiện |
