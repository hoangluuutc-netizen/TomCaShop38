---
description: Build và kiểm thử toàn bộ website trước khi đưa lên mạng
---
Kiểm tra website trong web/:

1. `npm run build` — báo lỗi nếu có.
2. Chạy bản preview, dùng Playwright mở mọi trang ở khung 390px và 1280px, chụp màn hình lưu vào docs/kiem-thu/<ngày>/.
3. Đặt thử 1 đơn COD và 1 đơn chuyển khoản từ trang sản phẩm đến trang cảm ơn.
4. Kiểm tra: nút Zalo/Messenger/Gọi hoạt động, giá khớp products.csv, ảnh có alt tiếng Việt, mỗi trang có title + meta description, không có link hỏng.
5. Tóm tắt kết quả thành bảng: Mục · Đạt/Lỗi · Ghi chú. Sửa lỗi nhỏ ngay; lỗi lớn thì hỏi tôi trước.
