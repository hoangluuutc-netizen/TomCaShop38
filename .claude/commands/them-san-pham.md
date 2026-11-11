---
description: Thêm sản phẩm mới và sinh nội dung cho mọi kênh
argument-hint: [tên sản phẩm]
---
Thêm sản phẩm mới: $ARGUMENTS

1. Hỏi tôi đủ thông tin còn thiếu: tên, mã (sku), danh mục, giá bán, giá gốc, size/kích thước, màu, chất liệu, độ tuổi phù hợp, tồn kho, ảnh (đặt trong products/anh/).
2. Thêm 1 dòng vào products/products.csv (giữ đúng thứ tự cột).
3. Viết theo brand/:
   - Mô tả cho website chuẩn SEO (title ≤ 60 ký tự, meta description ≤ 155 ký tự).
   - 1 bài Fanpage lưu vào fanpage/posts/<tháng>/.
   - Tiêu đề + mô tả Shopee (từ khóa đầu tiêu đề, mô tả gạch đầu dòng, thông số đầy đủ).
4. Gọi trợ lý con kiem-duyet-qc rà toàn bộ nội dung.
5. Chạy `npm run build` trong web/, chụp trang sản phẩm mới ở khung 390px và báo lại cho tôi.
