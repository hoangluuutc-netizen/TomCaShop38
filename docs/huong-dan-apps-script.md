# Hướng dẫn: nhận đơn hàng website vào Google Sheets

> Mất khoảng 10 phút. Làm bằng tài khoản Google của shop. Không cần biết lập trình.

## 1. Tạo Google Sheet
1. Vào https://sheets.google.com → **Trống** (Blank).
2. Đặt tên file, ví dụ **TomcaShop38 – Đơn hàng**.

## 2. Dán mã nhận đơn
1. Trong Sheet: menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
2. Xóa hết nội dung có sẵn trong `Code.gs`.
3. Mở file `docs/apps-script/Code.gs` trong dự án, copy toàn bộ, dán vào.
4. (Tùy chọn) Ở dòng `var EMAIL_BAO_DON = '';` điền email của shop giữa hai dấu nháy để nhận email mỗi khi có đơn.
5. Bấm biểu tượng **Lưu** (💾).

## 3. Triển khai thành Web App
1. Bấm **Triển khai → Tùy chọn triển khai mới** (Deploy → New deployment).
2. Bấm bánh răng ⚙ cạnh "Chọn loại" → **Ứng dụng web** (Web app).
3. Điền:
   - Mô tả: `Nhận đơn TomcaShop38`
   - Thực thi dưới dạng: **Tôi** (Me)
   - Ai có quyền truy cập: **Bất kỳ ai** (Anyone)
4. Bấm **Triển khai** → Google hỏi quyền → **Cho phép** (chọn tài khoản của shop; nếu hiện "Google chưa xác minh ứng dụng này" bấm **Nâng cao → Đi tới … (không an toàn)** — đây là script của chính shop).
5. Copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).

## 4. Gắn URL vào website
- **Khi chạy thử trên máy**: trong thư mục `web/`, chép `.env.example` thành `.env`, dán URL vào dòng `PUBLIC_ORDER_ENDPOINT=`.
- **Trên Cloudflare Pages** (Giai đoạn 4): Settings → Environment variables → thêm `PUBLIC_ORDER_ENDPOINT` = URL trên → build lại.
- Gửi URL cho Claude cũng được — Claude sẽ hướng dẫn đặt vào đúng chỗ (URL này không phải mật khẩu, nhưng **không** đưa file `.env` lên Git).

## 5. Thử
1. Mở website, thêm sản phẩm vào giỏ, đặt 1 đơn.
2. Mở Sheet → tab **Don hang** có 1 dòng mới, cột "Trạng thái" = Mới.
3. Sau khi gọi khách xác nhận, đổi "Trạng thái" thành *Đã xác nhận / Đã gửi / Đã giao / Hủy* để theo dõi.

## Khi sửa mã Code.gs
Sửa xong phải **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai**. URL giữ nguyên.

## Lưu ý
- Sheet chứa dữ liệu khách hàng (tên, SĐT, địa chỉ): chỉ chia sẻ cho người cần xử lý đơn.
- Mã đã kiểm tra dữ liệu cơ bản (SĐT, mã đơn, giỏ không rỗng). Nếu bị spam đơn ảo, báo Claude để thêm lớp chống spam.
- Chuyển khoản: thông tin ngân hàng **không** nằm ở Apps Script mà ở biến môi trường `PUBLIC_BANK_ID`, `PUBLIC_BANK_ACCOUNT`, `PUBLIC_BANK_ACCOUNT_NAME` của website.
