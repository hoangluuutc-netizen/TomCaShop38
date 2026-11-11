---
name: tomcashop-brand
description: Bộ nhận diện thương hiệu TomCaShop (màu, font, logo, mascot Cá Baby, giọng văn, xưng hô, từ cấm). Dùng mỗi khi viết nội dung cho khách (web, Fanpage, Messenger, mô tả sản phẩm, quảng cáo) hoặc làm giao diện, banner, ảnh cho TomCaShop.
---

# TomCaShop — Bộ nhận diện thương hiệu

> Nguồn: `brand/ho-so-thuong-hieu.md`. Khi file đó thay đổi, cập nhật lại skill này.
> Mục ghi **[CHƯA CÓ]** là thông tin chủ shop chưa cung cấp — KHÔNG tự bịa, hỏi chủ shop.

## 1. Thương hiệu
- Tên: **TomCaShop** (viết liền, T và C viết hoa).
- Bán: vali trẻ em, cặp da trẻ em, đồ dùng cho bé.
- Tính cách: đáng yêu, thân thiện, dễ nhận biết.
- Khách chính: bố mẹ 25–45 tuổi, bé 3–15 tuổi, bán toàn quốc. Mua trên điện thoại,
  hay hỏi qua Messenger/Zalo trước khi mua.
- Kênh bán: website, Facebook, TikTok Shop, Shopee.

## 2. Logo & mascot
- Logo: tôm xanh + cá hồng đối diện nhau trong huy hiệu tròn. File logo: **[CHƯA CÓ]** (đặt vào `brand/`).
  Khi chưa có file: dùng chữ "TomCaShop" + chỗ trống ghi rõ "logo", không tự vẽ logo thay thế để dùng thật.
- Mascot: **Cá Baby** — nhân vật bé, dùng trong video, minh họa, lời chào Messenger.

## 3. Màu
| Vai trò | Màu | Mã |
| --- | --- | --- |
| Xanh nhạt nhất (nền) | xanh-50 | `#EEF7FD` |
| Xanh nhạt (nền khối, viền) | xanh-100 | `#D6ECFA` |
| **Xanh chủ đạo** (nút chính) | xanh-500 | `#2B8FD6` |
| Xanh đậm (hover) | xanh-600 | `#1F74B4` |
| Xanh rất đậm | xanh-700 | `#185F95` |
| Xanh tiêu đề / chân trang | xanh-800 | `#164C75` |
| Hồng nhạt (nền khối) | hong-50 / hong-100 | `#FFF1F6` / `#FFDCE8` |
| Hồng minh họa (Cá Baby) | hong-400 | `#F27AA3` |
| **Hồng chủ đạo** (nhãn, mảng màu, chữ to) | hong-500 | `#E85A8B` |
| Hồng đậm (giá, chữ hồng cỡ nhỏ) | hong-600 | `#C93D6E` |
| Chữ thường | slate-800 | `#1E293B` |

Chốt 11/11/2026 theo **Mẫu A · Biển xanh dịu** (`docs/mau-giao-dien/mau-a-bien-xanh.html`):
nền trắng + xanh nhạt, đường sóng, thẻ bo góc lớn (rounded-3xl), nút tròn (rounded-full), bóng nhẹ.
Quy tắc tương phản (WCAG AA ≥ 4.5:1):
- Nút chính: nền **xanh-600 `#1F74B4`** chữ trắng (≈ 5.0:1), hover xanh-700. `#2B8FD6` + chữ trắng chỉ ≈ 3.5:1 → chỉ dùng cho mảng màu, icon, chữ ≥ 24px.
- Giá và chữ hồng cỡ nhỏ trên nền trắng: **hong-600 `#C93D6E`** (≈ 4.8:1). `#E85A8B` (≈ 3.4:1) chỉ dùng cho nhãn, nền, chữ ≥ 24px.

- Nền sáng, góc bo tròn, chuyển động nhẹ.
- Bản mẫu giao diện được dùng màu tạm, nhưng phải ghi chú "màu tạm" và thay khi có mã chính thức.
- Chữ trên nền màu phải đạt tương phản WCAG AA (≥ 4.5:1 cho chữ thường).

## 4. Chữ
- Font: **Be Vietnam Pro** (Google Fonts, hỗ trợ đầy đủ tiếng Việt).
- Luôn kiểm tra chữ có dấu hiển thị đúng (ă, ơ, ư, ệ, ỹ…).

## 5. Giọng văn
- Xưng **"shop"**, gọi khách là **"bố mẹ"** / **"ba mẹ"**.
- Gần gũi, kể chuyện, câu ngắn, dễ đọc trên điện thoại.
- Bài Fanpage kết thúc bằng lời mời nhắn tin (Messenger/Zalo).
- Tiếng Việt có dấu đầy đủ. Emoji vừa phải (🐟 cho Cá Baby).

## 6. Định dạng
- Giá: `1.290.000đ` (dấu chấm ngăn nghìn, chữ "đ" liền sau).
- Ngày: `dd/mm/yyyy`.
- Điện thoại: `0xxx xxx xxx`.

## 7. Quy tắc nội dung (bắt buộc)
- Giá, size, chất liệu, tồn kho **chỉ lấy từ `products/products.csv`**. Thiếu → hỏi chủ shop.
- **Không bịa**: đánh giá, số đơn đã bán, chứng nhận, công dụng chưa chứng minh.
- **Từ cấm** (từ tuyệt đối): "tốt nhất", "số 1", "100%", "an toàn tuyệt đối", "rẻ nhất"
  và các biến thể ("hàng đầu", "duy nhất", "tuyệt đối", "cam kết 100%").
- Quảng cáo nhắm **bố mẹ**, không nhắm trẻ em; ảnh trẻ em cần phụ huynh đồng ý.
- Nội dung Fanpage/quảng cáo: chạy trợ lý con `kiem-duyet-qc` trước khi giao.

## 8. Liên hệ & chính sách
- Người bán: Nguyễn Hoàng Lưu · ĐT/Zalo: 0948 999 433 (zalo.me/0948999433)
- Địa chỉ: HH03A, TDP Thanh Hà 1, xã Bình Minh, TP Hà Nội · Giờ làm việc: 8h00 – 18h00
- Fanpage: TomcaShop (link m.me/…: **[CHƯA CÓ]**)
- Tóm tắt chính sách (bản chuẩn: `docs/chinh-sach.md`): giao toàn quốc 3–5 ngày · phí ship theo
  đơn vị vận chuyển · **miễn phí ship từ 2 sản phẩm** · được kiểm tra hàng · đổi trả trong 1 ngày
  nếu lỗi shop/vận chuyển, shop chịu phí · bảo hành 3 tháng · COD mặc định + chuyển khoản QR.
- Dòng "(đề xuất — chờ duyệt)" trong chinh-sach.md chưa dùng cho khách đến khi chủ shop duyệt.
