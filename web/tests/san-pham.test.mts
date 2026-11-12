// Kiểm thử dữ liệu sản phẩm (products/products.csv) và định dạng hiển thị.
// Chạy: npm test   (trong thư mục web/ — đọc ../products/products.csv)
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { laySanPham, giaVN, DANH_MUC, nhomTuoiCua, khoangGiaCua, hopTuoi } from '../src/lib/san-pham.ts';
import { SHOP, CHINH_SACH } from '../src/lib/shop.ts';

const ds = laySanPham();

describe('products.csv', () => {
  test('có sản phẩm, sku không trùng, mỗi danh mục có ít nhất 1 sản phẩm', () => {
    assert.ok(ds.length > 0);
    assert.equal(new Set(ds.map((s) => s.sku)).size, ds.length);
    for (const d of DANH_MUC) assert.ok(ds.some((s) => s.danhMuc.slug === d.slug), `danh mục ${d.ten} trống`);
  });
  test('giá hợp lệ: số nguyên dương, giá gốc (nếu có) lớn hơn giá bán', () => {
    for (const s of ds) {
      assert.ok(Number.isInteger(s.giaBan) && s.giaBan > 0, `${s.sku} giá bán ${s.giaBan}`);
      if (s.giaGoc !== null) assert.ok(s.giaGoc > s.giaBan, `${s.sku} giá gốc`);
      if (s.phanTramGiam !== null) assert.ok(s.phanTramGiam > 0 && s.phanTramGiam < 100);
    }
  });
  test('đủ thông tin hiển thị: tên, kích thước, chất liệu, độ tuổi, ít nhất 1 màu', () => {
    for (const s of ds) {
      assert.ok(s.ten && s.kichThuoc && s.chatLieu, `${s.sku} thiếu tên/kích thước/chất liệu`);
      assert.ok(s.doTuoi && s.doTuoi.tu >= 0 && s.doTuoi.den >= s.doTuoi.tu, `${s.sku} độ tuổi`);
      assert.ok(s.mau.length > 0, `${s.sku} chưa có màu`);
      assert.ok(Number.isInteger(s.tonKho) && s.tonKho >= 0, `${s.sku} tồn kho`);
    }
  });
  test('mỗi sản phẩm thuộc ít nhất 1 nhóm tuổi và 1 khoảng giá (bộ lọc không bỏ sót)', () => {
    for (const s of ds) {
      assert.ok(nhomTuoiCua(s).length > 0, `${s.sku} không thuộc nhóm tuổi nào`);
      assert.ok(khoangGiaCua(s), `${s.sku} không thuộc khoảng giá nào`);
    }
  });
  test('không có từ tuyệt đối trong tên / mô tả', () => {
    const cam = /tốt nhất|số 1|100 ?%|rẻ nhất|an toàn tuyệt đối|duy nhất|chống gù|bảo vệ cột sống/i;
    for (const s of ds) assert.ok(!cam.test(s.ten + ' ' + s.moTaNgan), `${s.sku} có từ cấm`);
  });
});

describe('Định dạng', () => {
  test('giá kiểu 1.290.000đ', () => {
    assert.equal(giaVN(1290000), '1.290.000đ');
    assert.equal(giaVN(90000), '90.000đ');
  });
  test('SĐT kiểu 0xxx xxx xxx, Zalo khớp SĐT', () => {
    assert.match(SHOP.dienThoai, /^0\d{3} \d{3} \d{3}$/);
    assert.equal(SHOP.dienThoai.replace(/ /g, ''), SHOP.dienThoaiSo);
    assert.ok(SHOP.zalo.endsWith(SHOP.dienThoaiSo));
  });
  test('ngưỡng miễn ship khớp câu chữ chính sách', () => {
    assert.ok(CHINH_SACH.mienShip.includes(String(CHINH_SACH.mienShipTu)));
  });
  test('lọc tuổi giao nhau đúng', () => {
    const s = ds[0];
    assert.ok(hopTuoi(s, s.doTuoi!.tu, s.doTuoi!.tu));
    assert.ok(!hopTuoi(s, 100, 120));
  });
});
