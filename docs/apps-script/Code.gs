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

// Bí mật dùng chung với website (APPS_SCRIPT_SECRET) — KHÔNG ghi ở đây.
// Đặt trong: Cài đặt dự án (⚙) → Thuộc tính tập lệnh → thêm  BI_MAT = <chuỗi ngẫu nhiên>.

var COT = ['Mã đơn', 'Thời gian', 'Họ tên', 'SĐT', 'Tỉnh/Thành', 'Phường/Xã', 'Địa chỉ', 'Sản phẩm',
           'Số SP', 'Tiền hàng', 'Phí ship', 'Thanh toán', 'Ghi chú', 'Trạng thái', 'Mã payOS', 'Đã nhận tiền', 'Mã giao dịch'];
var COT_TRANG_THAI = 14, COT_MA_PAYOS = 15, COT_DA_NHAN = 16, COT_MA_GD = 17; // vị trí cột (đếm từ 1)

function doPost(e) {
  var khoa = LockService.getScriptLock();
  khoa.waitLock(20000);
  try {
    var don = JSON.parse(e.postData.contents);
    if (don.thaoTac === 'capNhatTrangThai') return capNhatTrangThai(don);
    var loi = kiemTra(don);
    if (loi) return traVe({ ok: false, loi: loi });

    var trang = layTrang();
    var sanPham = don.dong.map(function (d) {
      return d.ten + (d.mau ? ' (' + d.mau + ')' : '') + ' x' + d.sl + ' = ' + dinhDangGia(d.thanhTien);
    }).join('\n');

    trang.appendRow([
      don.maDon, don.thoiGian, don.hoTen, "'" + don.sdt, don.tinh, don.xa, don.diaChi, sanPham,
      don.soSp, don.tamTinh, don.phiShip, don.thanhToan === 'CK' ? 'Chuyển khoản' : 'COD', don.ghiChu || '',
      don.thanhToan === 'CK' ? 'Chờ chuyển khoản' : 'Mới', don.maPayos ? String(don.maPayos) : '', '', '',
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

/**
 * Website (Cloudflare, sau khi kiểm chữ ký payOS) báo đơn đã được chuyển khoản.
 * Dữ liệu: { thaoTac:'capNhatTrangThai', biMat, maPayos, soTien, maGiaoDich, thoiGian, trangThai }
 */
function capNhatTrangThai(d) {
  var biMat = PropertiesService.getScriptProperties().getProperty('BI_MAT');
  if (!biMat || d.biMat !== biMat) return traVe({ ok: false, loi: 'Sai bí mật' });
  if (!d.maPayos) return traVe({ ok: false, loi: 'Thiếu mã payOS' });

  var trang = layTrang();
  var n = trang.getLastRow();
  if (n < 2) return traVe({ ok: false, loi: 'Không có đơn' });
  var maPayos = trang.getRange(2, COT_MA_PAYOS, n - 1, 1).getDisplayValues();
  for (var i = 0; i < maPayos.length; i++) {
    if (maPayos[i][0] === String(d.maPayos)) {
      var dong = i + 2;
      var tienHang = Number(trang.getRange(dong, 10).getValue());
      var du = Number(d.soTien) >= tienHang;
      trang.getRange(dong, COT_TRANG_THAI).setValue(du ? 'Đã thanh toán' : 'Thanh toán thiếu — kiểm tra');
      trang.getRange(dong, COT_DA_NHAN).setValue(Number(d.soTien) || 0);
      trang.getRange(dong, COT_MA_GD).setValue((d.maGiaoDich || '') + (d.thoiGian ? ' · ' + d.thoiGian : ''));
      if (EMAIL_BAO_DON) {
        MailApp.sendEmail(EMAIL_BAO_DON, '[TomcaShop38] Đã nhận chuyển khoản đơn ' + trang.getRange(dong, 1).getValue(),
          'Số tiền: ' + dinhDangGia(Number(d.soTien) || 0) + (du ? '' : ' (THIẾU so với tiền hàng ' + dinhDangGia(tienHang) + ')'));
      }
      return traVe({ ok: true });
    }
  }
  return traVe({ ok: false, loi: 'Không tìm thấy đơn có mã payOS ' + d.maPayos });
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
  } else if (t.getLastColumn() < COT.length) {
    // Sheet tạo từ bản cũ (14 cột) → bổ sung tiêu đề cột mới
    t.getRange(1, 1, 1, COT.length).setValues([COT]).setFontWeight('bold').setBackground('#D6ECFA');
  }
  return t;
}

function dinhDangGia(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

function traVe(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
