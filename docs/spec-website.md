# Spec website TomCaShop (giai đoạn 1)

> Viết 11/11/2026. Chủ shop chọn "làm luôn" (bỏ qua phần hỏi đáp), nên phạm vi dưới đây do Claude chốt
> dựa trên CLAUDE.md, docs/cam-nang-du-an.md, docs/chinh-sach.md và brand/. Mục ghi *(Claude chọn)* chủ shop có thể đổi.

## 1. Mục đích
Website bán vali, cặp da và đồ dùng cho bé (3–15 tuổi), khách là bố mẹ 25–45 tuổi trên toàn quốc, chủ yếu xem bằng điện thoại.
Website phải giúp bố mẹ: (1) tin shop là người bán thật, (2) chọn đúng size theo tuổi bé, (3) đặt hàng trong 3 bước,
hoặc (4) nhắn Zalo/Messenger hỏi trước khi mua.

**Thành công =** bố mẹ đặt được đơn COD trên điện thoại trong dưới 2 phút, và đơn về Google Sheets của shop.

## 2. Mục tiêu / không làm / tuyệt đối tránh
- **Làm:** trang chủ, danh mục (lọc theo tuổi, giá, màu), trang sản phẩm, giỏ hàng, đặt hàng, trang cảm ơn,
  chính sách, giới thiệu, liên hệ, SEO cơ bản, nút Zalo/Messenger/Gọi nổi.
- **Chưa làm (giai đoạn sau):** tài khoản khách hàng, mã giảm giá, đánh giá sản phẩm, blog *(Claude chọn — để sau
  khi có bài viết)*, payOS tự động, Meta Pixel (Giai đoạn 4), tích hợp API vận chuyển.
- **Tuyệt đối tránh:** bịa đánh giá/số đã bán/chứng nhận; từ tuyệt đối ("tốt nhất", "số 1", "100%"…);
  form dài; bắt đăng ký tài khoản; trang nặng chậm trên 4G; chữ tiếng Việt lỗi dấu.

## 3. Ràng buộc
- Astro + Tailwind CSS, web tĩnh, host Cloudflare Pages; dữ liệu duy nhất từ `products/products.csv`.
- Mobile-first 390px; kiểm tra thêm 1280px. Font Be Vietnam Pro.
- Giá `1.290.000đ`, ngày `dd/mm/yyyy`, ĐT `0948 999 433`.
- Đơn hàng gửi về Google Sheets qua Apps Script (POST JSON); không lưu dữ liệu khách trong Git.
- Không có tài khoản ngân hàng trong code; thông tin chuyển khoản đặt ở biến môi trường.

## 4. Các trang
| Trang | Nội dung chính |
| --- | --- |
| Trang chủ | Banner + 2 nút (xem sản phẩm / nhắn Zalo tư vấn size), dải cam kết (COD, kiểm tra hàng, miễn ship từ 2 sản phẩm, bảo hành 3 tháng), 3 danh mục, chọn theo tuổi bé (3–5 / 6–10 / 11–15), sản phẩm nổi bật, câu chuyện Cá Baby, thông tin người bán |
| Danh mục | Vali trẻ em · Cặp da trẻ em · Đồ dùng bé. Lọc tuổi, khoảng giá, màu; sắp xếp giá |
| Sản phẩm | Ảnh (vuốt), giá + giá gốc, chọn màu, số lượng, nút **Thêm vào giỏ** + **Mua ngay**, ngay dưới nút: tóm tắt ship/đổi trả/bảo hành/kiểm tra hàng; bảng size, chất liệu, độ tuổi; nút "Hỏi shop qua Zalo" |
| Giỏ hàng | Danh sách, sửa số lượng, báo "thêm 1 sản phẩm nữa để được miễn phí ship" |
| Đặt hàng | 3 bước trên 1 trang: Thông tin (họ tên, SĐT) → Địa chỉ (tỉnh/thành → phường/xã theo danh mục hành chính hiện hành sau sáp nhập 2025, số nhà) → Thanh toán (COD mặc định / chuyển khoản QR) |
| Cảm ơn | Mã đơn, tóm tắt, QR chuyển khoản (nếu chọn), nút "Nhắn Zalo cho shop" |
| Chính sách | Từ `docs/chinh-sach.md` (chỉ dòng đã duyệt) |
| Giới thiệu / Liên hệ | Người bán Nguyễn Hoàng Lưu, địa chỉ, ĐT/Zalo, giờ làm việc, bản đồ |

## 5. Giỏ hàng & đơn *(Claude chọn)*
- Giỏ lưu trong trình duyệt (localStorage), không cần đăng nhập.
- Mã đơn dạng `TC` + ngày + 3 số (ví dụ `TC111126-042`).
- Phí ship hiển thị "Shop báo khi xác nhận đơn"; tự ghi "Miễn phí ship" khi giỏ có từ 2 sản phẩm.
- Tồn kho = 0 → hiện "Tạm hết hàng – nhắn shop để đặt trước", ẩn nút mua.

## 6. Giao diện
- Chốt bằng 3 mẫu trang chủ trong `docs/mau-giao-dien/` — chủ shop chọn 1 (có thể ghép ý).
- **Đã chọn Mẫu A · Biển xanh dịu** (11/11/2026). Bảng màu + quy tắc tương phản: skill tomcashop-brand.
- Logo: dùng file thật khi có; trước đó hiển thị khung "logo tạm".

## 7. Còn chờ chủ shop
- Danh sách sản phẩm + ảnh (bắt buộc trước khi dựng Giai đoạn 2).
- Logo, link m.me, đơn vị vận chuyển, phạm vi bảo hành, ngân hàng nhận chuyển khoản.
- Duyệt các dòng "(đề xuất — chờ duyệt)" trong docs/chinh-sach.md.
