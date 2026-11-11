# Cẩm nang dự án: Website bán hàng + Fanpage TomCaShop

> Tài liệu tham chiếu cho Claude Code. Quy tắc làm việc nằm ở CLAUDE.md; kế hoạch triển khai nằm ở KHOI-DONG.md.

## 1. Mục tiêu (4 tuần)

- **Website bán hàng**: giới thiệu sản phẩm, giỏ hàng, đặt hàng, thanh toán COD + chuyển khoản VietQR. Mobile-first, thân thiện với bố mẹ Việt, hiện đại và dễ thương theo thương hiệu xanh–hồng, mascot Cá Baby.
- **Fanpage Facebook**: nhận diện thương hiệu, lịch nội dung, kịch bản Messenger, sẵn sàng chạy quảng cáo.
- Nguyên tắc: làm bản đơn giản chạy được trước (tuần 1–2), thanh toán tự động và quảng cáo sau (tuần 3–4).

| Tuần | Website | Fanpage |
| --- | --- | --- |
| 1 · Nền móng | CLAUDE.md, brand/, products.csv, cài skill | Tạo Trang, ảnh đại diện, ảnh bìa, 3 bài đầu |
| 2 · Dựng phần chính | Trang chủ, danh mục, sản phẩm, giỏ hàng, đặt hàng → Google Sheets | Lịch nội dung tháng, kịch bản Messenger |
| 3 · Lên mạng | Chính sách, SEO, kiểm thử Playwright, Cloudflare Pages + tên miền | Gắn Meta Pixel, đủ 10–15 bài |
| 4 · Bán thật và đo | payOS VietQR, đặt thử đơn thật | Quảng cáo thử, mục tiêu tin nhắn |

### Phân vai
- **Claude Code làm**: code website, giao diện, mô tả sản phẩm SEO, bài Fanpage, thiết kế ảnh bìa/banner, kịch bản video, kiểm thử, hướng dẫn triển khai.
- **Chủ shop tự làm** (cần danh tính, thanh toán, đăng nhập): mua tên miền, tạo tài khoản Cloudflare/GitHub/payOS, tạo Fanpage & Meta Business, khai báo pháp lý, chụp ảnh sản phẩm thật, bấm đăng bài.

## 2. Công nghệ đã chọn

| Thành phần | Lựa chọn | Lý do |
| --- | --- | --- |
| Khung web | Astro + Tailwind CSS | Web tĩnh, nhanh trên 4G, chuẩn SEO, ít thứ để hỏng |
| Dữ liệu sản phẩm | products/products.csv | Một nguồn duy nhất cho web, Fanpage, Shopee |
| Hosting | Cloudflare Pages (miễn phí, cho phép thương mại) | Vercel Hobby cấm dùng thương mại |
| Đơn hàng giai đoạn 1 | Google Sheets qua Apps Script + email báo đơn | Miễn phí, chủ shop xem được ngay |
| Thanh toán | COD mặc định + VietQR qua payOS (giai đoạn 2) | payOS: tiền về thẳng tài khoản, webhook tự xác nhận; cần HTTPS thật, không có sandbox |
| Vận chuyển | Tạo đơn thủ công GHN/GHTK/Viettel Post, phí ship cố định theo vùng | Chỉ tích hợp API khi đơn đủ nhiều |
| Font | Be Vietnam Pro | Hiển thị tiếng Việt đẹp |

Phương án thay thế khi đơn lớn, cần đồng bộ kho đa kênh: chuyển phần bán sang Sapo/Haravan, giữ website làm trang thương hiệu.

## 3. Website — trang cần có

- [ ] Trang chủ: banner, 3 danh mục (Vali trẻ em, Cặp da trẻ em, Đồ dùng bé), sản phẩm nổi bật, câu chuyện thương hiệu cùng Cá Baby
- [ ] Danh mục: lọc theo tuổi, giá, màu
- [ ] Trang sản phẩm: ảnh thật + video, bảng size theo tuổi/chiều cao, chất liệu, chính sách đổi trả ngay dưới nút mua
- [ ] Giỏ hàng + đặt hàng: họ tên, SĐT, địa chỉ theo tỉnh/thành – phường/xã hiện hành; COD hoặc chuyển khoản QR
- [ ] Trang cảm ơn: mã đơn, QR thanh toán, nút "Nhắn Zalo cho shop"
- [ ] Chính sách: đổi trả, bảo hành, vận chuyển, thanh toán, bảo mật dữ liệu cá nhân
- [ ] Giới thiệu + Liên hệ: thông tin người bán, địa chỉ, SĐT, giờ làm việc
- [ ] Blog: hướng dẫn chọn vali/cặp cho bé

### Yếu tố thân thiện với người Việt
- Mobile-first, nút to, đặt hàng xong trong 3 bước.
- Nút Zalo, Messenger, Gọi điện luôn nổi ở góc màn hình.
- COD mặc định; chuyển khoản QR là lựa chọn thứ hai.
- Hiện phí ship / ngưỡng miễn phí ship ngay trên trang sản phẩm.
- Giá dạng 1.290.000đ; ngày dd/mm/yyyy.
- Nền sáng, màu xanh–hồng, góc bo tròn, minh họa Cá Baby, chuyển động nhẹ.
- Ảnh/video thật, đánh giá thật, thông tin người bán rõ ràng. Không bịa đánh giá hay số đơn.
- SEO: title, meta description, ảnh chia sẻ Facebook (Open Graph), sitemap, dữ liệu có cấu trúc Product.
- Meta Pixel với sự kiện ViewContent, AddToCart, Purchase.

## 4. Fanpage

### Thiết lập (chủ shop làm, Claude chuẩn bị nội dung)
1. Tên: "TomCaShop – Vali & Cặp da cho bé"; username @tomcashop; hạng mục cửa hàng đồ trẻ em.
2. Ảnh đại diện: logo huy hiệu tròn tôm–cá. Ảnh bìa: Claude thiết kế, kiểm tra trên điện thoại và máy tính.
3. Nút "Gửi tin nhắn"; thêm website, SĐT, Zalo, giờ mở cửa.
4. Meta Business Suite: danh mục doanh nghiệp, gắn Trang, phương thức thanh toán quảng cáo, xác minh tên miền.
5. Messenger: lời chào, câu hỏi gợi ý, trả lời nhanh, tin nhắn vắng mặt — từ fanpage/messenger/kich-ban.md.

### Nội dung: 4 trụ cột, 4–5 bài/tuần
| Trụ cột | Tỉ lệ | Ví dụ |
| --- | --- | --- |
| Sản phẩm thật | 40% | Video thử kéo vali; so kích thước cặp với dáng bé lớp 1 |
| Hữu ích cho bố mẹ | 30% | Checklist đồ cho bé đi du lịch Tết; chọn cặp không hại lưng |
| Thương hiệu & Cá Baby | 20% | Chuyện tên TomCaShop; hậu trường đóng gói |
| Ưu đãi | 10% | Combo vali + cặp; miễn phí ship dịp tựu trường |

Kịch bản video: Hook (3 giây đầu) – Vấn đề – Sản phẩm – Bằng chứng – Kêu gọi; ghi rõ thời lượng, phân cảnh, lời thoại, chữ trên màn hình, góc quay, nhạc, caption, hashtag; 2–3 phương án để A/B.

### Quảng cáo
- Chỉ chạy khi Trang có 10–15 bài và website đã gắn Pixel.
- Mục tiêu đầu: Tin nhắn. Thử 2–3 mẫu, ngân sách nhỏ, 5–7 ngày; ngân sách cụ thể chốt theo biên lợi nhuận.
- Nhắm bố mẹ, không nhắm trẻ em; ảnh trẻ em cần phụ huynh đồng ý.
- Theo dõi: CTR, chi phí mỗi tin nhắn, tỉ lệ chốt đơn, ROAS.
- Hẹn giờ đăng thủ công trong Meta Business Suite (không dùng Graph API giai đoạn đầu).

## 5. Skill & plugin

| Mức | Tên | Cài |
| --- | --- | --- |
| Bắt buộc | frontend-design | `/plugin install frontend-design@claude-plugins-official` |
| Bắt buộc | playwright | `/plugin install playwright@claude-plugins-official` |
| Bắt buộc | superpowers | `/plugin install superpowers@claude-plugins-official` |
| Bắt buộc | ui-ux-pro-max | Có sẵn trong .claude/skills/ |
| Bắt buộc | tomcashop-brand | Tạo trong tuần 1 bằng skill-creator, từ brand/ |
| Nên có | code-review | `/plugin install code-review@claude-plugins-official` |
| Nên có | github | `/plugin install github@claude-plugins-official` |
| Nên có | find-skills | Có sẵn trong .claude/skills/ |

Danh sách plugin thay đổi thường xuyên — gõ `/plugin` để xem bản hiện tại. Skill cộng đồng nên đọc qua trước khi dùng.

## 6. Pháp lý (chủ shop kiểm tra, không phải tư vấn luật)

Luật Thương mại điện tử và Nghị định 248/2026/NĐ-CP hiệu lực từ 01/07/2026: minh bạch thông tin người bán, quảng cáo trung thực, định danh người livestream bán hàng. Chưa xác nhận thủ tục cụ thể cho website bán hàng riêng — hỏi Sở Công Thương trước khi chạy quảng cáo.

- [ ] Đăng ký hộ kinh doanh, hỏi cách kê khai thuế bán online hiện hành
- [ ] Kiểm tra nghĩa vụ thông báo website với Bộ Công Thương (trước đây qua online.gov.vn)
- [ ] Công khai trên web: người bán, địa chỉ, SĐT, giá, đổi trả, bảo hành, vận chuyển, khiếu nại, bảo mật dữ liệu
- [ ] Giữ hóa đơn, nguồn gốc hàng; hỏi nhà cung cấp về chứng nhận hợp quy nếu mặt hàng trẻ em thuộc diện bắt buộc

## Nguồn
- Claude Code — cài đặt: https://code.claude.com/docs/en/setup
- Vercel Hobby phi thương mại: https://vercel.com/docs/plans/hobby
- So sánh hosting: https://hostfleet.pages.dev/cf-pages-vs-vercel-vs-netlify-2026/
- payOS: https://wordpress.org/plugins/payos/ · SDK: https://npmjs.org/package/@payos/node
- Plugin chính thức: https://designrevision.com/blog/official-claude-code-plugins
- Bộ Công Thương — Luật TMĐT & NĐ 248/2026: https://moit.gov.vn/tin-tuc/bo-cong-thuong-pho-bien-luat-thuong-mai-dien-tu-va-nghi-dinh-so-248-2026-nd-cp.html
- Tham khảo giao diện: https://github.com/creativetimofficial/astro-ecommerce
