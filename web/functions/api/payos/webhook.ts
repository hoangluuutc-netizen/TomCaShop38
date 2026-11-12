// POST /api/payos/webhook — payOS gọi khi khách chuyển khoản thành công.
// Kiểm tra chữ ký bằng PAYOS_CHECKSUM_KEY, rồi báo Apps Script đổi trạng thái đơn thành "Đã thanh toán".
// Luôn trả 2xx để payOS ghi nhận đã gửi (theo tài liệu payOS).
import { kiemTraChuKyWebhook, json, type MoiTruong } from '../../../lib-server/payos.ts';

interface Webhook { code?: string; desc?: string; success?: boolean; data?: Record<string, unknown>; signature?: string }

export const onRequestPost = async ({ request, env }: { request: Request; env: MoiTruong }) => {
  let wh: Webhook;
  try { wh = await request.json(); } catch { return json({ ok: false, loi: 'JSON lỗi' }, 200); }

  if (!env.PAYOS_CHECKSUM_KEY || !wh.data || !wh.signature) return json({ ok: false, loi: 'Thiếu dữ liệu' }, 200);
  const hopLe = await kiemTraChuKyWebhook(wh.data, wh.signature, env.PAYOS_CHECKSUM_KEY);
  if (!hopLe) {
    console.warn('payOS webhook: chữ ký sai');
    return json({ ok: false, loi: 'Chữ ký không hợp lệ' }, 200);
  }

  const thanhCong = wh.code === '00' && wh.data.code === '00';
  if (thanhCong && env.PUBLIC_ORDER_ENDPOINT && env.APPS_SCRIPT_SECRET) {
    try {
      await fetch(env.PUBLIC_ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          thaoTac: 'capNhatTrangThai',
          biMat: env.APPS_SCRIPT_SECRET,
          maPayos: Number(wh.data.orderCode),
          soTien: Number(wh.data.amount),
          maGiaoDich: String(wh.data.reference ?? ''),
          thoiGian: String(wh.data.transactionDateTime ?? ''),
          trangThai: 'Đã thanh toán',
        }),
      });
    } catch (e) {
      console.error('Không gọi được Apps Script', e);
    }
  }
  return json({ ok: true });
};

// payOS kiểm tra URL bằng GET/POST khi đăng ký — trả 200 cho GET để xác nhận URL tồn tại.
export const onRequestGet = () => json({ ok: true, thongTin: 'TomcaShop38 payOS webhook' });
