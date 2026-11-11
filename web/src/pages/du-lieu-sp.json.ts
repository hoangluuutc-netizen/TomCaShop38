// Danh sách sản phẩm rút gọn cho giỏ hàng / đặt hàng (sinh lúc build từ products.csv).
import type { APIRoute } from 'astro';
import { laySanPham } from '../lib/san-pham';

export const GET: APIRoute = () => {
  const ds = laySanPham().map((s) => ({
    sku: s.sku, ten: s.ten, gia: s.giaBan, giaGoc: s.giaGoc, mau: s.mau, tonKho: s.tonKho, url: s.url,
    anh: s.anh[0] ?? null, hinh: s.danhMuc.hinh, mauHinh: s.danhMuc.mauHinh, doTuoi: s.doTuoi?.nhan ?? null, danhMuc: s.danhMuc.ten,
  }));
  return new Response(JSON.stringify(ds), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
