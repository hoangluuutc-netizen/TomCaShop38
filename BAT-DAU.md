# Bắt đầu nhanh — TomCaShop trên Claude Code

1. Giải nén → được thư mục `tomcashop/`. Đặt ở nơi dễ tìm (ví dụ Documents).
2. Chép hồ sơ thương hiệu, logo, giọng văn vào `brand/`; ảnh sản phẩm vào `products/anh/`.
3. Mở Claude Desktop → tab **Code** → chọn thư mục `tomcashop/` (hoặc mở terminal tại thư mục này và gõ `claude`).
4. Cài plugin — gõ từng dòng trong Claude Code:
   ```
   /plugin install frontend-design@claude-plugins-official
   /plugin install playwright@claude-plugins-official
   /plugin install superpowers@claude-plugins-official
   /plugin install code-review@claude-plugins-official
   ```
   (ui-ux-pro-max và find-skills đã có sẵn trong `.claude/skills/`.)
5. Mở **KHOI-DONG.md**, copy câu lệnh trong khung và dán vào Claude Code. Claude sẽ làm theo từng giai đoạn và dừng chờ bạn duyệt.

Có sẵn:
- Lệnh tắt: `/them-san-pham`, `/bai-fanpage`, `/kiem-tra-web`, `/bao-cao-tuan`
- Trợ lý con: `kiem-duyet-qc`, `qa-web`
- Tài liệu: `docs/cam-nang-du-an.md` (toàn bộ hướng dẫn), `fanpage/messenger/kich-ban.md`
