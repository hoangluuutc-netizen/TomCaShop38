# Hướng dẫn bật thanh toán tự động payOS

> payOS tạo mã QR chuyển khoản cho từng đơn và **tự báo về** khi khách chuyển đúng tiền, đơn trong Google Sheets tự đổi sang "Đã thanh toán".
> Tiền về thẳng tài khoản ngân hàng của shop. payOS **không có môi trường thử** — kiểm tra bằng 1 đơn thật giá trị nhỏ.
> Chủ shop tự làm các bước đăng nhập/xác thực và tự dán khóa vào Cloudflare. **Không gửi khóa vào chat.**

## Cần có trước
- Website đã chạy (https://tomcashop38.pages.dev) ✓
- Apps Script nhận đơn đã chạy và đã làm mục "Bật xác nhận chuyển khoản tự động" trong `docs/huong-dan-apps-script.md` (Script Property `BI_MAT` + Cloudflare secret `APPS_SCRIPT_SECRET`).
- Tài khoản ngân hàng đứng tên chủ shop/hộ kinh doanh.

## 1. Tạo tài khoản payOS
1. Vào https://my.payos.vn → **Đăng ký** (email hoặc số điện thoại).
2. **Xác thực tổ chức/cá nhân** theo hướng dẫn trên màn hình (hộ kinh doanh hoặc cá nhân có CCCD).
3. **Liên kết tài khoản ngân hàng** nhận tiền.

## 2. Tạo kênh thanh toán và lấy 3 khóa
1. my.payos.vn → **Kênh thanh toán** → **Tạo kênh thanh toán** → chọn tài khoản ngân hàng vừa liên kết → đặt tên `TomcaShop38 web`.
2. Mở kênh vừa tạo → copy 3 giá trị: **Client ID**, **API Key**, **Checksum Key**.

## 3. Dán khóa vào Cloudflare
Cloudflare → Workers & Pages → `tomcashop38` → **Settings → Variables and Secrets** → **Add** (chọn loại **Secret**, môi trường **Production**):

| Tên | Giá trị |
| --- | --- |
| `PAYOS_CLIENT_ID` | Client ID |
| `PAYOS_API_KEY` | API Key |
| `PAYOS_CHECKSUM_KEY` | Checksum Key |

Sau đó **Deployments → bản mới nhất → … → Retry deployment** để áp dụng.

## 4. Đặt Webhook (để payOS báo tiền về)
1. my.payos.vn → kênh thanh toán → **Webhook** → nhập:
   ```
   https://tomcashop38.pages.dev/api/payos/webhook
   ```
   (khi có tên miền thật, đổi sang `https://<tên-miền>/api/payos/webhook`)
2. Bấm **Lưu / Xác nhận**. payOS gửi thử một gói dữ liệu — web trả lời "ok" là thành công.

## 5. Đặt thử 1 đơn thật nhỏ
1. Mở web → chọn sản phẩm rẻ nhất → **Mua ngay** → chọn **Chuyển khoản qua mã QR** → Đặt hàng.
2. Trang cảm ơn hiện QR có ghi chú "Thanh toán qua payOS" và nút **Mở trang thanh toán payOS**. Nội dung chuyển khoản dạng `TC1234567` (9 ký tự).
3. Quét QR bằng app ngân hàng, chuyển đúng số tiền.
4. Trong ~1 phút, Google Sheet: dòng đơn đổi **Trạng thái = "Đã thanh toán"**, cột **Đã nhận tiền** có số tiền (và có email báo nếu đã bật).
5. Báo Claude kết quả. Nếu không đổi trạng thái: gửi Claude ảnh chụp dòng đơn trong Sheet + mục Webhook trong payOS (che khóa).

## Cách hoạt động (để tham khảo)
- Khách chọn chuyển khoản → website gọi `/api/payos/tao-link` (chạy trên máy chủ Cloudflare). Máy chủ **tự tính lại tiền** từ dữ liệu sản phẩm, ký bằng Checksum Key, gọi payOS lấy tài khoản nhận tiền + nội dung.
- Số tiền QR = **tiền hàng**. Đơn dưới 2 sản phẩm: phí ship khách trả cho shipper khi nhận.
- payOS báo tiền về → `/api/payos/webhook` kiểm tra chữ ký → báo Apps Script đổi trạng thái (kèm chuỗi bí mật).
- payOS chưa bật hoặc lỗi → web tự quay về QR tĩnh (`PUBLIC_BANK_*`) hoặc "shop gửi thông tin chuyển khoản qua Zalo".
- Link thanh toán hết hạn sau 24 giờ.
