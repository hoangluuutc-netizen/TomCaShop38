// Tiện ích payOS dùng chung cho Cloudflare Pages Functions (chạy phía máy chủ, không lộ khóa ra trình duyệt).
// Tài liệu: https://payos.vn/docs/api/ · https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/

export const PAYOS_API = 'https://api-merchant.payos.vn';

export interface MoiTruong {
  PAYOS_CLIENT_ID?: string;
  PAYOS_API_KEY?: string;
  PAYOS_CHECKSUM_KEY?: string;
  APPS_SCRIPT_SECRET?: string;
  PUBLIC_ORDER_ENDPOINT?: string;
}

export const coKhoaPayos = (env: MoiTruong) => !!(env.PAYOS_CLIENT_ID && env.PAYOS_API_KEY && env.PAYOS_CHECKSUM_KEY);

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function hmacSha256(khoa: string, duLieu: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(khoa), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(duLieu)));
}

/** Chữ ký tạo link: amount=…&cancelUrl=…&description=…&orderCode=…&returnUrl=… (đúng thứ tự alphabet). */
export function chuoiKyTaoLink(p: { amount: number; cancelUrl: string; description: string; orderCode: number; returnUrl: string }) {
  return `amount=${p.amount}&cancelUrl=${p.cancelUrl}&description=${p.description}&orderCode=${p.orderCode}&returnUrl=${p.returnUrl}`;
}

const sapKhoa = (o: Record<string, unknown>) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

/** Chuỗi ký cho dữ liệu webhook: sắp khóa theo alphabet, null/undefined → "", mảng → JSON (khóa phần tử đã sắp). */
export function chuoiKyDuLieu(data: Record<string, unknown>): string {
  return Object.keys(data).sort().map((k) => {
    let v = data[k];
    if (v === null || v === undefined || v === 'null' || v === 'undefined') v = '';
    else if (Array.isArray(v)) v = JSON.stringify(v.map((x) => (x && typeof x === 'object' ? sapKhoa(x as Record<string, unknown>) : x)));
    else if (typeof v === 'object') v = JSON.stringify(sapKhoa(v as Record<string, unknown>));
    return `${k}=${v}`;
  }).join('&');
}

/** So sánh chuỗi an toàn thời gian (tránh dò chữ ký). */
export function bangNhau(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function kiemTraChuKyWebhook(data: Record<string, unknown>, chuKy: string, checksumKey: string) {
  if (!data || typeof chuKy !== 'string') return false;
  return bangNhau(await hmacSha256(checksumKey, chuoiKyDuLieu(data)), chuKy.toLowerCase());
}

/** orderCode dạng số nguyên (payOS yêu cầu integer), duy nhất theo thời gian. */
export const taoOrderCode = () => Math.floor(Date.now() / 1000) % 100_000_000 * 100 + Math.floor(Math.random() * 100);

/** Nội dung chuyển khoản ≤ 9 ký tự (giới hạn của payOS với tài khoản ngân hàng chưa liên kết qua payOS). */
export const moTaChuyenKhoan = (orderCode: number) => `TC${String(orderCode).slice(-7)}`;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
