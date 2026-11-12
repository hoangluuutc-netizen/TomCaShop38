// Kiểm thử payOS: hàm ký, kiểm chữ ký webhook, hàm tạo link & webhook (giả lập mạng — KHÔNG gọi payOS thật).
// Chạy: npm test   (trong thư mục web/)
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { laySanPham } from '../src/lib/san-pham.ts';
import { hmacSha256, chuoiKyTaoLink, chuoiKyDuLieu, kiemTraChuKyWebhook, taoOrderCode, moTaChuyenKhoan } from '../lib-server/payos.ts';
import { onRequestPost as taoLink } from '../functions/api/payos/tao-link.ts';
import { onRequestPost as webhook, onRequestGet as webhookGet } from '../functions/api/payos/webhook.ts';

const K = 'khoa-checksum-thu-khong-phai-that';
const ky = (s: string, k = K) => createHmac('sha256', k).update(s).digest('hex');

describe('Hàm ký payOS (lib-server/payos.ts)', () => {
  test('chuỗi ký tạo link đúng thứ tự alphabet', () => {
    const s = chuoiKyTaoLink({ amount: 590000, cancelUrl: 'https://x/huy', description: 'TC1234567', orderCode: 123, returnUrl: 'https://x/ok' });
    assert.equal(s, 'amount=590000&cancelUrl=https://x/huy&description=TC1234567&orderCode=123&returnUrl=https://x/ok');
  });
  test('HMAC Web Crypto khớp node:crypto', async () => {
    assert.equal(await hmacSha256(K, 'abc'), ky('abc'));
  });
  test('dữ liệu webhook: sắp khóa, null/undefined → rỗng, mảng → JSON khóa đã sắp', () => {
    const s = chuoiKyDuLieu({ b: 2, a: 'x', c: null, d: undefined, e: [{ z: 1, y: 2 }] });
    assert.equal(s, 'a=x&b=2&c=&d=&e=[{"y":2,"z":1}]');
  });
  test('orderCode là số nguyên an toàn, mô tả ≤ 9 ký tự', () => {
    for (let i = 0; i < 50; i++) {
      const oc = taoOrderCode();
      assert.ok(Number.isSafeInteger(oc) && oc > 0);
      assert.match(moTaChuyenKhoan(oc), /^TC\d{7}$/);
    }
  });
});

describe('Kiểm chữ ký webhook', () => {
  const data = { orderCode: 123, amount: 3000, description: 'TC0000123', reference: 'FT1', code: '00', desc: 'success', virtualAccountNumber: null };
  const dung = ky(chuoiKyDuLieu(data));
  test('chữ ký đúng → chấp nhận', async () => assert.ok(await kiemTraChuKyWebhook(data, dung, K)));
  test('chữ ký sai → từ chối', async () => assert.ok(!(await kiemTraChuKyWebhook(data, 'a' + dung.slice(1) === dung ? 'b' + dung.slice(1) : 'a' + dung.slice(1), K))));
  test('sửa số tiền → từ chối', async () => assert.ok(!(await kiemTraChuKyWebhook({ ...data, amount: 1 }, dung, K))));
  test('sai khóa → từ chối', async () => assert.ok(!(await kiemTraChuKyWebhook(data, dung, K + 'x'))));
});

// ---- Hàm máy chủ (Cloudflare Pages Functions) với mạng giả lập ----
// Dữ liệu giống /du-lieu-sp.json (src/pages/du-lieu-sp.json.ts), lấy thẳng từ products.csv — không cần build trước
const sp = laySanPham().map((s) => ({ sku: s.sku, ten: s.ten, gia: s.giaBan, tonKho: s.tonKho }));
const conHang = sp.filter((s) => s.tonKho > 0);
const hetHang = sp.find((s) => s.tonKho <= 0);
let goi: { u: string; body: any; headers: any }[] = [];
const fetchGoc = globalThis.fetch;
beforeEach(() => {
  goi = [];
  globalThis.fetch = (async (url: any, init?: any) => {
    const u = String(url);
    goi.push({ u, body: init?.body ? JSON.parse(init.body) : null, headers: init?.headers });
    if (u.endsWith('/du-lieu-sp.json')) return new Response(JSON.stringify(sp));
    if (u.includes('api-merchant.payos.vn')) { const b = JSON.parse(init.body); return new Response(JSON.stringify({ code: '00', desc: 'success', data: { bin: '970422', accountNumber: 'VQRQ0001', accountName: 'TOMCASHOP38', amount: b.amount, description: b.description, orderCode: b.orderCode, checkoutUrl: 'https://pay.payos.vn/web/thu' } })); }
    if (u.includes('script.google')) return new Response('{"ok":true}');
    throw new Error('Kiểm thử gọi mạng lạ: ' + u);
  }) as typeof fetch;
});
process.on('exit', () => { globalThis.fetch = fetchGoc; });
const req = (p: string, body: unknown) => new Request('https://tomcashop38.pages.dev' + p, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) });
const ENV = { PAYOS_CLIENT_ID: 'id', PAYOS_API_KEY: 'key', PAYOS_CHECKSUM_KEY: K, APPS_SCRIPT_SECRET: 'bimat', PUBLIC_ORDER_ENDPOINT: 'https://script.google.com/macros/s/thu/exec' };
const doc = async (r: Response) => ({ s: r.status, j: await r.json() as any });

describe('POST /api/payos/tao-link', () => {
  test('thiếu khóa → 503 (web quay về QR tĩnh)', async () => {
    const r = await doc(await taoLink({ request: req('/api/payos/tao-link', { maDon: 'TC121126-001', dong: [{ sku: conHang[0].sku, sl: 1 }] }), env: {} }));
    assert.equal(r.s, 503);
  });
  test('tiền được tính lại ở máy chủ, ký đúng, gửi đủ header', async () => {
    const [a, b] = conHang;
    const r = await doc(await taoLink({ request: req('/api/payos/tao-link', { maDon: 'TC121126-001', dong: [{ sku: a.sku, sl: 2 }, { sku: b.sku, sl: 1 }] }), env: ENV }));
    assert.equal(r.s, 200);
    assert.equal(r.j.amount, a.gia * 2 + b.gia);
    const g = goi.find((x) => x.u.includes('payos'))!;
    assert.equal(g.headers['x-client-id'], 'id');
    assert.equal(g.headers['x-api-key'], 'key');
    const p = g.body;
    assert.equal(p.signature, ky(`amount=${p.amount}&cancelUrl=${p.cancelUrl}&description=${p.description}&orderCode=${p.orderCode}&returnUrl=${p.returnUrl}`));
    assert.equal(p.returnUrl, 'https://tomcashop38.pages.dev/cam-on?thanhtoan=ok');
    assert.ok(p.description.length <= 9);
  });
  test('sản phẩm hết hàng / số lượng vô lý / mã đơn sai / JSON hỏng → 400', async () => {
    if (hetHang) assert.equal((await taoLink({ request: req('/x', { maDon: 'TC121126-001', dong: [{ sku: hetHang.sku, sl: 1 }] }), env: ENV })).status, 400);
    assert.equal((await taoLink({ request: req('/x', { maDon: 'TC121126-001', dong: [{ sku: conHang[0].sku, sl: 1000 }] }), env: ENV })).status, 400);
    assert.equal((await taoLink({ request: req('/x', { maDon: 'xyz', dong: [] }), env: ENV })).status, 400);
    assert.equal((await taoLink({ request: req('/x', 'khong-phai-json'), env: ENV })).status, 400);
  });
});

describe('POST /api/payos/webhook', () => {
  const data = { orderCode: 9446752815, amount: 1330000, description: 'TC6752815', reference: 'FT123', transactionDateTime: '2026-11-12 10:00:00', code: '00', desc: 'success', virtualAccountNumber: null };
  const sig = ky(chuoiKyDuLieu(data));
  test('chữ ký đúng → báo Apps Script kèm bí mật', async () => {
    const r = await doc(await webhook({ request: req('/api/payos/webhook', { code: '00', success: true, data, signature: sig }), env: ENV }));
    assert.equal(r.s, 200); assert.ok(r.j.ok);
    const g = goi.find((x) => x.u.includes('script.google'))!;
    assert.deepEqual([g.body.thaoTac, g.body.maPayos, g.body.soTien, g.body.biMat], ['capNhatTrangThai', 9446752815, 1330000, 'bimat']);
  });
  test('bị sửa số tiền → không báo Apps Script, vẫn trả 200', async () => {
    const r = await doc(await webhook({ request: req('/x', { code: '00', data: { ...data, amount: 1 }, signature: sig }), env: ENV }));
    assert.equal(r.s, 200); assert.ok(!r.j.ok);
    assert.ok(!goi.some((x) => x.u.includes('script.google')));
  });
  test('giao dịch không thành công → không đổi trạng thái', async () => {
    const d2 = { ...data, code: '01' };
    await webhook({ request: req('/x', { code: '01', data: d2, signature: ky(chuoiKyDuLieu(d2)) }), env: ENV });
    assert.ok(!goi.some((x) => x.u.includes('script.google')));
  });
  test('JSON hỏng → 200, GET → 200 (payOS xác nhận URL)', async () => {
    assert.equal((await webhook({ request: req('/x', 'abc'), env: ENV })).status, 200);
    assert.equal((await webhookGet()).status, 200);
  });
});
