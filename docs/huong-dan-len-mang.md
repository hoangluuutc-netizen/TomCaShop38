# Hướng dẫn đưa TomcaShop38 lên mạng

> Chủ shop tự làm các bước cần đăng nhập. Claude làm phần code và đẩy code lên (sau khi chủ shop đồng ý).
> Mọi dịch vụ dưới đây có gói **miễn phí** đủ dùng cho shop.

## Phần 1 — GitHub (kho lưu code)
1. Vào https://github.com → **Sign up** → tạo tài khoản bằng email của shop (bật xác minh 2 bước khi được hỏi).
2. Bấm **+** (góc trên phải) → **New repository**:
   - Repository name: `tomcashop38`
   - Chọn **Private** (chỉ chủ shop xem được code)
   - **KHÔNG** tích "Add a README", "Add .gitignore", "Choose a license"
   - Bấm **Create repository**.
3. Copy địa chỉ kho dạng `https://github.com/<tên-tài-khoản>/tomcashop38.git` → gửi cho Claude.
4. Claude sẽ hỏi lại trước khi đẩy code. Lần đầu đẩy, Windows mở cửa sổ **Git Credential Manager** → bấm **Sign in with your browser** → đăng nhập GitHub → **Authorize**. (Chủ shop tự đăng nhập; Claude không nhập mật khẩu.)

## Phần 2 — Cloudflare Pages (chạy website)
1. Vào https://dash.cloudflare.com/sign-up → tạo tài khoản (email + mật khẩu), xác nhận email.
2. Menu trái **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git** → **Connect GitHub** → cho phép Cloudflare truy cập kho `tomcashop38`.
3. Chọn kho `tomcashop38` → **Begin setup**, điền:
   | Ô | Giá trị |
   | --- | --- |
   | Project name | `tomcashop38` (địa chỉ sẽ là `tomcashop38.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory (Advanced) | `web` |
4. **Environment variables** (mục Advanced, hoặc sau này ở Settings → Variables and Secrets):
   | Tên | Giá trị | Khi nào |
   | --- | --- | --- |
   | `NODE_VERSION` | `24` (Astro 7 cần Node ≥ 22.23.4) | ngay |
   | `SITE_URL` | `https://tomcashop38.pages.dev` (đổi khi có tên miền) | ngay |
   | `PUBLIC_ORDER_ENDPOINT` | URL Apps Script (docs/huong-dan-apps-script.md) | khi tạo xong Apps Script |
   | `PUBLIC_BANK_ID` · `PUBLIC_BANK_ACCOUNT` · `PUBLIC_BANK_ACCOUNT_NAME` | mã ngân hàng VietQR · số TK · tên chủ TK | khi muốn hiện QR chuyển khoản |
   | `PUBLIC_META_PIXEL_ID` | ID Pixel (Phần 4) | khi có Pixel |
5. Bấm **Save and Deploy** → chờ 1–2 phút → mở `https://tomcashop38.pages.dev` → báo Claude kiểm thử.
6. Từ nay, mỗi lần Claude đẩy code mới lên GitHub, Cloudflare **tự build lại**. Đổi biến môi trường xong thì vào **Deployments → … → Retry deployment** để áp dụng.

> Lưu ý: số tài khoản chỉ đặt ở biến môi trường Cloudflare, **không** gửi vào Git. Mã QR chuyển khoản vẫn hiện số TK cho khách (đó là bình thường).

## Phần 3 — Tên miền (khi mua)
1. Mua tên miền (ví dụ `tomcashop38.vn` hoặc `.com`) ở nhà đăng ký bố mẹ tin dùng (Mắt Bão, PA Vietnam, Tenten, Cloudflare Registrar với .com…). Tên miền `.vn` cần khai báo thông tin chủ thể thật.
2. Cloudflare → dự án `tomcashop38` → **Custom domains** → **Set up a custom domain** → nhập tên miền → làm theo hướng dẫn (đổi nameserver hoặc thêm bản ghi CNAME tại nhà đăng ký).
3. Báo Claude tên miền để đổi `SITE_URL`, `robots.txt`, sitemap và kiểm thử lại.
4. Kiểm tra nghĩa vụ **thông báo website TMĐT bán hàng** với Bộ Công Thương (xem docs/cam-nang-du-an.md mục 6).

## Phần 4 — Meta Pixel (đo quảng cáo)
1. Vào https://business.facebook.com → **Events Manager** (Trình quản lý sự kiện) → **Connect data sources** → **Web** → đặt tên `TomcaShop38 Pixel` → **Create**.
2. Chọn cách cài **Manually** / "Tự cài mã" → **chỉ copy dãy số Pixel ID** (15–16 chữ số) gửi Claude, hoặc tự dán vào biến `PUBLIC_META_PIXEL_ID` trên Cloudflare.
3. Website đã cài sẵn các sự kiện: **PageView** (mọi trang), **ViewContent** (xem sản phẩm), **AddToCart** (thêm giỏ), **InitiateCheckout** (vào trang đặt hàng), **Purchase** (đặt hàng xong — không gửi với đơn thử). Không gửi tên/SĐT/địa chỉ khách.
4. **Xác minh tên miền** (khi đã có tên miền): Business Settings → Brand Safety → **Domains** → Add → chọn cách "Meta-tag" → gửi Claude đoạn `<meta name="facebook-domain-verification" …>` để gắn vào web.
5. Kiểm tra: Events Manager → **Test events** → nhập địa chỉ web → bấm thử xem sản phẩm, thêm giỏ → thấy sự kiện hiện ra là đạt.
