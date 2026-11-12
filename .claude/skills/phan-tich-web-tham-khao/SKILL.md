---
name: phan-tich-web-tham-khao
description: Phân tích website/app tham khảo (bố cục, màu, font, hiệu ứng, 3D, tốc độ, luồng mua hàng) rồi dựng bản NGUYÊN BẢN theo thương hiệu TomcaShop38 — không sao chép code, chữ, ảnh hay nhận diện của trang gốc. Dùng khi chủ shop đưa link và nói "làm giống", "học theo", "clone", "lấy ý tưởng", "hiệu ứng như trang X", hoặc nhắc tới REA (Reverse Engineer Anything); cũng dùng để tự đo lại website TomcaShop38 (tốc độ, màu, khối) trước/sau khi sửa giao diện.
---

# Phân tích web tham khảo → dựng bản của TomcaShop38

Mục tiêu: hiểu **vì sao** một trang đẹp và bán tốt (nhịp khối, màu, chữ, hiệu ứng, luồng mua, tốc độ) rồi **viết lại từ đầu** cho TomcaShop38.
Kết quả phải là website của TomcaShop38 — người xem không nhầm với trang gốc.

Đọc kèm: `CLAUDE.md`, skill `tomcashop-brand`, `docs/spec-website.md`, `docs/tham-khao-giao-dien.md` (khảo sát 17 trang ngày 11/11/2026 — đừng làm lại phần đã có).

## Ranh giới bắt buộc

**Quyền truy cập (kiểm tra TRƯỚC khi mở bất kỳ công cụ tự động nào):**
- Trang công khai **không** có nghĩa là được phép truy cập tự động hay phân tích ngược (đúng như cảnh báo của chính REA).
- Đọc **Điều khoản sử dụng** của trang (tìm "automated", "bot", "scraping", "crawler", "AI") và `robots.txt`. Cấm → chỉ xem **bằng tay** trong trình duyệt, ghi nhận xét.
- Gặp trang đăng nhập, captcha, "pardon our interruption", "access restricted" → **dừng**, không vượt, không dùng tài khoản của chủ shop để vào.
- Không phân tích tự động: **Amazon** (cấm trợ lý AI trong điều khoản), **Shopee** (bắt đăng nhập), **eBay, Etsy, Taobao, 1688** (chặn bot) — script đã chặn sẵn các tên miền này.
- Trang của chính shop (`tomcashop38.pages.dev`, `localhost`) và mã nguồn mở có giấy phép thì phân tích thoải mái.

**Bản quyền & nhận diện:**
- **Được học**: bố cục, thứ tự khối, khoảng cách, cỡ chữ, cách phối màu, vị trí nút mua, kỹ thuật hiệu ứng (mô tả bằng lời: "vali xoay theo cuộn, ánh sáng mềm").
- **Không lấy**: mã nguồn, file JS/CSS, ảnh, video, mô hình 3D, font trả phí, logo, chữ viết; không giữ tên, màu nhận diện hay bố cục giống đến mức nhận ra trang gốc; không làm trang giả mạo thương hiệu thật.
- Ảnh chụp trang của người khác chỉ dùng **nội bộ** để phân tích: lưu ở `docs/tham-khao/<ten>/anh/` (đã nằm trong `.gitignore`), không đưa lên Git, không đăng.
- Ngoại lệ: template/mã nguồn mở (MIT, Apache, CC-BY…) dùng đúng điều kiện giấy phép, ghi nguồn trong `docs/tham-khao/nguon.md`.
- Chủ shop muốn "copy y nguyên" → giải thích ngắn rủi ro (bản quyền, khách nhầm lẫn, Luật Cạnh tranh về hành vi gây nhầm lẫn) và đề xuất bản "cùng cảm giác, khác nhận diện".

## Quy trình

Việc thay đổi giao diện lớn: theo `CLAUDE.md` → lập kế hoạch (Plan mode), chờ chủ shop duyệt rồi mới code.

### Bước 1 — Nhận đầu vào
Hỏi nếu chưa rõ: link tham khảo (tối đa 3), chủ shop thích **điều gì cụ thể** ở mỗi trang (hiệu ứng? trang sản phẩm? cách hiện giá/ship?), áp dụng cho trang nào của TomcaShop38.

### Bước 2 — Thu thập
1. **Kiểm tra quyền** (mục trên). Ghi link điều khoản vào `phan-tich.md`.
2. **Đo tự động** (chỉ khi được phép). Cài lần đầu:
   ```bash
   cd .claude/skills/phan-tich-web-tham-khao/scripts && npm install
   ```
   Dùng Google Chrome có sẵn trên máy (không tải Chromium; nếu không có Chrome: `npx playwright install chromium`). Chạy từ thư mục gốc dự án:
   ```bash
   node .claude/skills/phan-tich-web-tham-khao/scripts/analyze-site.mjs <url> docs/tham-khao/<ten-ngan> --da-doc-dieu-khoan
   ```
   (Trang của shop không cần cờ `--da-doc-dieu-khoan`.) Script tự dừng nếu robots.txt cấm hoặc gặp trang chặn; ghi:
   - `report.json`: màu (đã đổi về #HEX, kể cả oklch), font đang dùng/đã tải, cỡ chữ, độ đậm, giãn dòng, bo góc, đổ bóng, khoảng cách, thứ tự khối chính kèm chiều cao, nút CTA (chữ, màu, cao), phần tử dính, canvas/WebGL/video/Lottie, thư viện (three, gsap, lenis, swiper…), ảnh (lazy, srcset, định dạng), **tốc độ** (LCP, CLS, KB tải theo loại), SEO (JSON-LD, OG).
   - `tom-tat.md`: bảng tóm tắt đọc nhanh.
   - `anh/`: ảnh đầu trang + toàn trang ở 390px và 1280px.
3. **Xem bằng mắt**: Read từng ảnh PNG; dùng Playwright MCP (hoặc trình duyệt trong app) cuộn, bấm thử menu/giỏ hàng/hiệu ứng như người xem bình thường. Một lần xem mỗi trang là đủ, không tải lặp.
4. **REA (Reverse Engineer Anything) — chỉ khi thật cần, đúng phạm vi:**
   - REA (`morluto/rea`, gói npm `rea-agents`, MIT) là MCP server cho agent: đọc DOM/network qua Chrome DevTools, phân tích HAR, bundle JS, file nhị phân. Chạy cục bộ nhưng kết quả gửi tới mô hình AI; cài ở **mức người dùng** (`~/.claude.json`, `~/.claude/skills`) → ảnh hưởng mọi dự án; hỗ trợ Windows còn thử nghiệm; cần Node ≥ 22.23.4. Chỉ cài từ nguồn chính thức (có nhiều repo nhái).
   - **Dùng cho**: website của chính shop (ví dụ ghi HAR luồng đặt hàng để kiểm tra không lộ dữ liệu khách, xem bundle có lộ khóa không), template mã nguồn mở.
   - **Không dùng cho** website/app của người khác khi chưa có phép rõ ràng — điều khoản REA ghi rõ việc phần mềm công khai không tự nó cho phép phân tích.
   - Để hiểu kỹ thuật hiệu ứng của trang khác: mô tả từ quan sát (ảnh, cuộn thử) + kết quả script, rồi tự dựng bằng kiến thức chung (Three.js, CSS scroll-driven animation…). Ghi cách làm bằng lời/sơ đồ, không chép code.
   - Cài/gỡ REA là thay đổi cấu hình máy → hỏi chủ shop trước (`npx rea-agents@latest setup` / `rea uninstall`).

### Bước 3 — Phân tích → `docs/tham-khao/<ten-ngan>/phan-tich.md`
```markdown
# Phân tích: <tên trang> (<url>) — <dd/mm/yyyy>
Điều khoản/robots: <link + kết luận được phép xem tự động hay chỉ xem tay>
## Ấn tượng chung (3 câu)
## Bố cục (thứ tự khối, chiều cao ước lượng, vai trò từng khối) — điện thoại trước
## Hệ thống thiết kế đo được
| Hạng mục | Trang gốc | So với TomcaShop38 hiện tại |
| Màu chính / nền / chữ | | |
| Font, cỡ chữ, độ đậm | | |
| Bo góc, đổ bóng, khoảng cách | | |
## Hiệu ứng & công nghệ (thư viện, WebGL, chuyển động khi cuộn, reduced-motion)
## Tốc độ trên điện thoại (LCP, CLS, KB) — so với TomcaShop38
## Luồng mua hàng (số bước, CTA, cách hiện giá/ship/đổi trả, nút liên hệ)
## Nên học | Không nên học (và lý do)
```
Đối chiếu với `docs/tham-khao-giao-dien.md`: điểm nào đã có trên web rồi thì ghi "đã có".

### Bước 4 — Brief cho TomcaShop38 → `docs/tham-khao/<ten-ngan>/brief.md`
Mỗi điểm "nên học" thành một quyết định theo skill `tomcashop-brand`:
- **Màu**: bảng màu Mẫu A (xanh `#1F74B4`/`#2B8FD6`, hồng `#C93D6E`/`#E85A8B`, vàng nhấn `#F5B82E`) và quy tắc tương phản AA. Màu logo chỉ để trang trí.
- **Chữ**: chỉ Be Vietnam Pro. Viết mới bằng giọng shop (xưng "shop", gọi "bố mẹ"); không dịch/sửa nhẹ chữ của trang gốc; không từ tuyệt đối; giá/size/chất liệu chỉ từ `products/products.csv`.
- **Hình**: ảnh thật sản phẩm của shop, minh họa Cá Baby, logo `brand/logo.png`.
- **Bố cục**: giữ ý nhịp khối nhưng theo nhu cầu bố mẹ Việt: COD, kiểm tra hàng, miễn ship từ 2 SP, chọn theo tuổi, nút Zalo/Gọi nổi, đặt hàng 3 bước.
- **Ưu tiên** theo số trang cùng dùng (nguyên tắc chủ shop chọn 11/11/2026): mẫu nhiều trang dùng trước.
Cho chủ shop **duyệt brief** trước khi code.

### Bước 5 — Dựng lại trong `web/` (Astro 7 + Tailwind 4, mobile-first 390px)
- Dùng lại component sẵn có (`Header`, `TheSanPham`, `CamKet`, `DanhSachLoc`…) trước khi viết mới.
- **Hiệu ứng 3D** (nếu chọn): Three.js viết từ đầu, chỉ ở 1 khối (thường hero); mô hình là của shop (Blender tự dựng, mua có giấy phép, hoặc khối đơn giản). Bắt buộc: tải lười (IntersectionObserver), ảnh tĩnh thay thế khi không có WebGL/máy yếu, tôn trọng `prefers-reduced-motion`, ngân sách JS khối 3D ≤ ~300 KB nén.
- Chuyển động: ưu tiên CSS (kể cả scroll-driven animation) + IntersectionObserver; chỉ thêm GSAP/Lenis khi thật cần.
- **Ngân sách tốc độ trang chủ trên điện thoại** (đo bằng script): LCP ≤ 2.500 ms, CLS ≤ 0,1, tổng tải ≤ 500 KB lần đầu. Không làm chậm hơn bản hiện tại (LCP ~0,5–0,7 s, ~196 KB ngày 12/11/2026).

### Bước 6 — Kiểm tra
1. `npm run build` không lỗi (máy Windows này: chạy `npm run sua-loi-windows` sau mỗi `npm install`).
2. Chạy script trên bản của shop (localhost hoặc `tomcashop38.pages.dev`), đặt `tom-tat.md` và ảnh cạnh trang gốc; so tốc độ với ngân sách.
3. Checklist nguyên bản — tất cả phải "Đạt":
   - [ ] Không file JS/CSS/ảnh/video/mô hình/font nào lấy từ trang gốc
   - [ ] Chữ viết mới hoàn toàn; đã qua trợ lý con `kiem-duyet-qc`
   - [ ] Màu, logo, tên là của TomcaShop38; người xem không nhầm với trang gốc
   - [ ] Nguồn mở (nếu có) ghi trong `docs/tham-khao/nguon.md` kèm giấy phép
   - [ ] Ảnh chụp trang người khác không nằm trong Git
4. Kiểm thử bằng trợ lý con `qa-web` (390px + 1280px).
5. Commit tiếng Việt + 1 dòng `docs/nhat-ky.md`. Báo chủ shop: ảnh trước/sau, điểm đã học, điểm cố ý làm khác, số đo tốc độ, việc tiếp theo.
