# Đề xuất tối ưu dự án TomcaShop38 (12/11/2026)

> Sau khi nghiên cứu REA và cách "học từ web/app khác", cộng với số đo thật của chính website (skill `phan-tich-web-tham-khao`).
> Ký hiệu công sức: S = vài giờ · M = 1 buổi · L = nhiều ngày. "Cần shop" = cần dữ liệu/tài khoản của chủ shop.

## 1. REA nên dùng thế nào cho dự án này
- **REA là gì:** công cụ mã nguồn mở (`morluto/rea`, gói npm `rea-agents`, MIT) gắn vào Claude Code dạng MCP để phân tích ngược: DOM/network qua Chrome DevTools, file HAR, bundle JavaScript, file nhị phân (cần Ghidra/IDA…).
- **Không cần cài lúc này.** Lý do:
  - Điều khoản của REA: chỉ phân tích phần mềm **mình sở hữu hoặc được phép**; "trang công khai" không tự nó là được phép → không dùng để soi web của shop khác.
  - Để học **thiết kế** (bố cục, màu, hiệu ứng, tốc độ) thì quan sát như người xem bình thường là đủ — đã làm thành skill `phan-tich-web-tham-khao` (script đo + ảnh chụp + tóm tắt), nhẹ hơn và đúng phạm vi.
  - REA cài ở mức người dùng (ảnh hưởng mọi dự án), hỗ trợ Windows còn thử nghiệm; máy này lại có chính sách Application Control đã chặn file native của Astro 7.
- **Khi nào đáng dùng:** kiểm tra **chính website TomcaShop38** — ghi HAR luồng đặt hàng để chắc không lộ dữ liệu khách/khóa, xem bundle JS có chứa gì không nên có. Cài bằng `npx rea-agents@latest setup` sau khi chủ shop đồng ý.

## 2. Số đo website hiện tại (trang chủ, điện thoại, 12/11/2026)
| Chỉ số | Kết quả | Nhận xét |
| --- | --- | --- |
| LCP | ~0,5–0,7 s | Rất tốt (ngưỡng tốt ≤ 2,5 s) |
| CLS | 0 – 0,002 | Rất tốt |
| Tổng tải lần đầu | ~196 KB | Nhỏ; **font chiếm ~166 KB (10 file)** |
| JS | ~2 KB trang chủ | Rất nhẹ |
| Ảnh | 1 ảnh (logo webp) | Chưa có ảnh sản phẩm thật — khi có sẽ là phần nặng nhất |

## 3. Đề xuất, xếp theo ưu tiên

### Ưu tiên 1 — nên làm sớm
| # | Việc | Học từ | Lợi ích | Công sức |
| --- | --- | --- | --- | --- |
| 1 | **Ảnh sản phẩm tối ưu**: dùng `<Picture>` của Astro xuất AVIF/WebP nhiều cỡ (srcset), lazy-load, khung vuông cố định | Mọi sàn lớn (Tiki, Lazada, Target) | Trang vẫn nhanh khi có 10–50 ảnh thật | M · cần shop (ảnh) |
| 2 | **Giảm font ~166 KB → ~100 KB**: bỏ độ đậm 500 (14 chỗ dùng → đổi sang 400/600), chỉ preload 700 | Số đo của chính web | Tải nhanh hơn trên 4G yếu | S |
| 3 | **Đưa bộ kiểm thử vào dự án** (`web/tests/`): 16 kiểm thử payOS + kịch bản Playwright đặt hàng COD/CK, chạy 1 lệnh | Quy trình CI của các shop lớn | Sửa gì cũng kiểm lại được ngay, không phụ thuộc phiên làm việc | M |
| 4 | **Cloudflare Web Analytics** (miễn phí, không dùng cookie) | Mọi web bán hàng | Biết trang nào được xem, khách từ đâu — trước khi chạy quảng cáo | S · cần shop bật |
| 5 | **Trang tra cứu đơn hàng** (nhập mã đơn + SĐT → trạng thái từ Google Sheet) | Tiki, Lazada "theo dõi đơn" | Bớt tin nhắn "đơn em tới đâu rồi", tăng tin tưởng | M |

### Ưu tiên 2 — khi đã có sản phẩm thật
| # | Việc | Học từ | Lợi ích | Công sức |
| --- | --- | --- | --- | --- |
| 6 | **Feed sản phẩm tự động** từ `products.csv` cho Meta Catalog (quảng cáo động, Shop trên Facebook/Instagram) và Google Merchant | Shop lớn chạy quảng cáo | Thêm sản phẩm 1 lần, mọi kênh tự cập nhật | S–M |
| 7 | **Gợi ý món thứ 2 ngay trong giỏ** (cùng độ tuổi, giá thấp) cạnh thanh "thêm 1 món để miễn ship" | Lazada/Tiki ngưỡng freeship, Target "mua cùng" | Tăng đơn 2 sản phẩm | S |
| 8 | **Bảng size theo chiều cao bé** (cm) cho vali/cặp | Target size guide | Bớt hỏi size, bớt đổi trả | S · cần shop (số đo) |
| 9 | **Đánh giá thật** sau đơn (link gửi qua Zalo → Google Sheet → hiện trên web + schema đánh giá) | Lazada, Target | Niềm tin; Google hiện sao | M · cần đơn thật |
| 10 | **Bài hướng dẫn trên web** (tái dùng bài Fanpage 20/11, 23/11: checklist đi chơi, chọn vali theo tuổi) | Blog của shop đồ trẻ em | Khách tìm Google ra web | S mỗi bài |

### Ưu tiên 3 — cân nhắc sau
| # | Việc | Ghi chú |
| --- | --- | --- |
| 11 | **Video thật ở banner** (từ Video 1 "bé tự kéo vali"), nén ≤ 1 MB, có ảnh tĩnh thay thế | Hợp shop đồ trẻ em hơn 3D; chỉ làm khi có video thật |
| 12 | **Hiệu ứng 3D** (vali xoay theo cuộn) | Đẹp nhưng nặng, chưa chắc tăng đơn; chỉ làm khi có mô hình 3D của shop và ngân sách JS ≤ 300 KB |
| 13 | **Zalo OA + nút chat Zalo chính thức** | Khi shop đăng ký Zalo Official Account |
| 14 | **REA kiểm tra chính web** (HAR luồng đặt hàng) | Sau khi bật payOS + Apps Script thật |

## 4. Quy trình "học từ web khác" từ nay
1. Chủ shop gửi link + điều mình thích → Claude dùng skill `phan-tich-web-tham-khao`.
2. Kiểm tra điều khoản/robots → đo bằng script (nếu được phép) hoặc xem tay.
3. `phan-tich.md` → `brief.md` theo thương hiệu → chủ shop duyệt → code mới → kiểm tra nguyên bản + tốc độ.
4. Ảnh chụp trang người khác chỉ dùng nội bộ, không đưa lên Git.
