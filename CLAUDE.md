# TomCaShop — Website bán hàng & Fanpage

## Về shop
- Bán: đồ dùng trẻ em, vali, cặp da trẻ em.
- Khách chính: bố mẹ có con nhỏ, mua trên điện thoại, hay hỏi qua Messenger/Zalo trước khi mua.
- Thương hiệu: đáng yêu, thân thiện, dễ nhận biết. Màu chủ đạo xanh dương + hồng.
  Logo: tôm xanh + cá hồng đối diện nhau trong huy hiệu tròn. Mascot: Cá Baby.
- Chi tiết: thư mục brand/ — ĐỌC TRƯỚC khi viết nội dung hoặc làm giao diện.

## Quy tắc bắt buộc
- Giá, size, chất liệu, tồn kho CHỈ lấy từ products/products.csv. Thiếu thì hỏi tôi, không tự điền.
- Không bịa đánh giá, số đơn đã bán, chứng nhận, công dụng chưa được chứng minh.
- Không dùng từ tuyệt đối: "tốt nhất", "số 1", "100%", "an toàn tuyệt đối", "rẻ nhất".
- Chữ hiển thị cho khách: tiếng Việt có dấu, xưng "shop" – gọi "bố mẹ/ba mẹ".
- Giá: 1.290.000đ. Ngày: dd/mm/yyyy. Điện thoại: 0xxx xxx xxx.
- Không đưa lên Git: file .env, khóa API, số tài khoản, dữ liệu khách hàng.

## Website (thư mục web/)
- Công nghệ: Astro + Tailwind CSS; dữ liệu từ products/products.csv; host Cloudflare Pages.
- Mobile-first (thiết kế cho 390px trước), font hỗ trợ tiếng Việt: Be Vietnam Pro.
- Luôn có: nút Zalo + Messenger + Gọi điện nổi; thanh toán COD (mặc định) + chuyển khoản QR.
- Form địa chỉ dùng danh mục tỉnh/thành – phường/xã hiện hành.
- Đơn hàng giai đoạn 1 gửi về Google Sheets (Apps Script); giai đoạn 2 tích hợp payOS.
- Trước khi báo xong: `npm run build` không lỗi + kiểm tra bằng Playwright ở 390px và 1280px.

## Fanpage (thư mục fanpage/)
- Giọng văn: gần gũi, kể chuyện, kết thúc bằng lời mời nhắn tin.
- 4 trụ cột: Sản phẩm thật 40% · Hữu ích cho bố mẹ 30% · Thương hiệu & Cá Baby 20% · Ưu đãi 10%.
- Mỗi bài: caption + gợi ý ảnh/video + hashtag + giờ đăng đề xuất.
- Trước khi giao: chạy trợ lý con kiem-duyet-qc.

## Cách làm việc
- Việc lớn: lập kế hoạch trước (Plan mode), chờ tôi duyệt rồi mới làm.
- Xong mỗi việc: commit Git với mô tả tiếng Việt, ghi 1 dòng vào docs/nhat-ky.md.
- Trả lời tôi bằng tiếng Việt, ngắn gọn, giải thích thuật ngữ khi cần.
- Khi tôi sửa cùng một lỗi lần thứ hai: đề xuất thêm quy tắc vào file này.
