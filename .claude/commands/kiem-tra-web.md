---
description: Build và kiểm thử toàn bộ website trước khi đưa lên mạng
---
Kiểm tra website trong web/:

1. `npm run build` — báo lỗi nếu có. (Máy Windows này: nếu vừa `npm install`, chạy `npm run sua-loi-windows` trước.)
2. `npm test` — kiểm thử đơn vị: dữ liệu products.csv (giá, size, màu, độ tuổi, từ cấm), định dạng giá/SĐT, payOS (chữ ký, tạo link, webhook — giả lập mạng).
3. `npm run test:e2e` — kiểm thử giao diện bằng Playwright (tự bật preview): mọi trang + mọi sản phẩm ở 390px và 1280px (tràn ngang, 1 H1, font, title/description, nút ≥ 44px, lỗi JS), tìm kiếm, lọc, giỏ hàng + miễn ship, form đặt hàng, đơn COD, đơn chuyển khoản, nút Zalo/Gọi. Ảnh lưu docs/kiem-thu/<ngày>/e2e/. Lần đầu: `npm run test:e2e:cai`.
4. Sau khi đẩy lên GitHub và Cloudflare build xong: `npm run test:e2e -- https://tomcashop38.pages.dev` (thêm kiểm tra hàm payOS).
5. Kiểm tra thêm bằng mắt những gì script chưa bắt: ảnh có alt tiếng Việt, giá hiển thị khớp products.csv, bố cục đẹp trên ảnh chụp.
6. Tóm tắt kết quả thành bảng: Mục · Đạt/Lỗi · Ghi chú. Sửa lỗi nhỏ ngay; lỗi lớn thì hỏi tôi trước.
