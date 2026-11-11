/**
 * TomcaShop38 — nhận đơn hàng từ website và ghi vào Google Sheets.
 * Cách cài: xem docs/huong-dan-apps-script.md
 *
 * Website gửi POST (Content-Type: text/plain) với nội dung JSON:
 * { maDon, thoiGian, hoTen, sdt, tinh, xa, diaChi, ghiChu, thanhToan: "COD"|"CK",
 *   dong: [{ sku, ten, mau, sl, gia, thanhTien }], soSp, tamTinh, phiShip, tong }
 */

// ====== CẤU HÌNH ======
var TEN_TRANG = 'Don hang';                 // tên tab trong Google Sheet
var EMAIL_BAO_DON = '';                     // email nhận báo đơn mới, để trống = không gửi email
// ======================

var COT = ['Mã đơn', 'Thời gian', 'Họ tên', 'SĐT', 'Tỉnh/Thành', 'Phường/Xã', 'Địa chỉ', 'Sản phẩm',
           'Số SP', 'Tiền hàng', 'Phí ship', 'Thanh toán', 'Ghi chú', 'Trạng thái'];

function doPost(e) {
  var khoa = LockService.getScriptLock();
  khoa.waitLock(20000);
  try {
    var don = JSON.parse(e.postData.contents);
    var loi = kiemTra(don);
    if (loi) return traVe({ ok: false, loi: loi });

    var trang = layTrang();
    var sanPham = don.dong.map(function (d) {
      return d.ten + (d.mau ? ' (' + d.mau + ')' : '') + ' x' + d.sl + ' = ' + dinhDangGia(d.thanhTien);
    }).join('\n');

    trang.appendRow([
      don.maDon, don.thoiGian, don.hoTen, "'" + don.sdt, don.tinh, don.xa, don.diaChi, sanPham,
      don.soSp, don.tamTinh, don.phiShip, don.thanhToan === 'CK' ? 'Chuyển khoản' : 'COD', don.ghiChu || '', 'Mới',
    ]);

    if (EMAIL_BAO_DON) {
      MailApp.sendEmail(EMAIL_BAO_DON, '[TomcaShop38] Đơn mới ' + don.maDon + ' — ' + dinhDangGia(don.tamTinh),
        'Khách: ' + don.hoTen + ' — ' + don.sdt + '\n' +
        'Địa chỉ: ' + don.diaChi + ', ' + don.xa + ', ' + don.tinh + '\n' +
        'Thanh toán: ' + (don.thanhToan === 'CK' ? 'Chuyển khoản' : 'COD') + '\n\n' + sanPham + '\n\n' +
        'Tiền hàng: ' + dinhDangGia(don.tamTinh) + ' · Phí ship: ' + don.phiShip + '\n' +
        'Ghi chú: ' + (don.ghiChu || '—'));
    }
    return traVe({ ok: true, maDon: don.maDon });
  } catch (err) {
    return traVe({ ok: false, loi: String(err) });
  } finally {
    khoa.releaseLock();
  }
}

function doGet() {
  return traVe({ ok: true, thongTin: 'TomcaShop38 nhận đơn — dùng POST' });
}

function kiemTra(d) {
  if (!d || typeof d !== 'object') return 'Dữ liệu trống';
  if (!/^TC\d{6}-\d{3}$/.test(d.maDon || '')) return 'Mã đơn không hợp lệ';
  if (!d.hoTen || String(d.hoTen).length > 100) return 'Thiếu họ tên';
  if (!/^0(3|5|7|8|9)\d{8}$/.test(d.sdt || '')) return 'SĐT không hợp lệ';
  if (!d.tinh || !d.xa || !d.diaChi) return 'Thiếu địa chỉ';
  if (!Array.isArray(d.dong) || d.dong.length === 0 || d.dong.length > 50) return 'Giỏ hàng trống';
  return '';
}

function layTrang() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var t = ss.getSheetByName(TEN_TRANG) || ss.insertSheet(TEN_TRANG);
  if (t.getLastRow() === 0) {
    t.appendRow(COT);
    t.getRange(1, 1, 1, COT.length).setFontWeight('bold').setBackground('#D6ECFA');
    t.setFrozenRows(1);
  }
  return t;
}

function dinhDangGia(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

function traVe(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
