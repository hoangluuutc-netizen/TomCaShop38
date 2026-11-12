// POST /api/payos/tao-link — tạo link thanh toán payOS cho đơn chuyển khoản.
// Số tiền được TÍNH LẠI ở máy chủ từ du-lieu-sp.json (sinh từ products.csv), không tin số tiền trình duyệt gửi lên.
import { PAYOS_API, coKhoaPayos, hmacSha256, chuoiKyTaoLink, taoOrderCode, moTaChuyenKhoan, json, type MoiTruong } from '../../../lib-server/payos.ts';

interface YeuCau { maDon?: string; dong?: { sku: string; sl: number }[] }
interface SpRutGon { sku: string; ten: string; gia: number; tonKho: number }

export const onRequestPost = async ({ request, env }: { request: Request; env: MoiTruong }) => {
  if (!coKhoaPayos(env)) return json({ ok: false, loi: 'payOS chưa được cấu hình' }, 503);

  let yc: YeuCau;
  try { yc = await request.json(); } catch { return json({ ok: false, loi: 'Dữ liệu không hợp lệ' }, 400); }
  if (!yc.maDon || !/^TC\d{6}-\d{3}$/.test(yc.maDon) || !Array.isArray(yc.dong) || !yc.dong.length || yc.dong.length > 50) {
    return json({ ok: false, loi: 'Đơn không hợp lệ' }, 400);
  }

  // Lấy giá chuẩn từ chính website
  const goc = new URL(request.url).origin;
  const ds: SpRutGon[] = await fetch(`${goc}/du-lieu-sp.json`).then((r) => r.json());
  const bang = new Map(ds.map((s) => [s.sku, s]));
  const items: { name: string; quantity: number; price: number }[] = [];
  let amount = 0;
  for (const d of yc.dong) {
    const p = bang.get(d.sku);
    const sl = Math.floor(Number(d.sl));
    if (!p || p.tonKho <= 0 || !(sl >= 1 && sl <= 99)) return json({ ok: false, loi: `Sản phẩm ${d.sku} không hợp lệ` }, 400);
    amount += p.gia * sl;
    items.push({ name: p.ten.slice(0, 100), quantity: sl, price: p.gia });
  }

  const orderCode = taoOrderCode();
  const description = moTaChuyenKhoan(orderCode);
  const returnUrl = `${goc}/cam-on?thanhtoan=ok`;
  const cancelUrl = `${goc}/cam-on?thanhtoan=huy`;
  const signature = await hmacSha256(env.PAYOS_CHECKSUM_KEY!, chuoiKyTaoLink({ amount, cancelUrl, description, orderCode, returnUrl }));
  const expiredAt = Math.floor(Date.now() / 1000) + 24 * 3600; // link hết hạn sau 24 giờ

  const r = await fetch(`${PAYOS_API}/v2/payment-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-client-id': env.PAYOS_CLIENT_ID!, 'x-api-key': env.PAYOS_API_KEY! },
    body: JSON.stringify({ orderCode, amount, description, items, cancelUrl, returnUrl, expiredAt, signature }),
  });
  const kq = await r.json().catch(() => null) as { code?: string; desc?: string; data?: Record<string, unknown> } | null;
  if (!r.ok || !kq || kq.code !== '00' || !kq.data) {
    console.error('payOS tạo link lỗi', r.status, kq?.code, kq?.desc);
    return json({ ok: false, loi: 'Không tạo được link thanh toán' }, 502);
  }
  const d = kq.data;
  return json({
    ok: true,
    orderCode,
    amount,
    description,
    checkoutUrl: d.checkoutUrl,
    bin: d.bin,
    accountNumber: d.accountNumber,
    accountName: d.accountName,
  });
};
