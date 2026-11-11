// Form đặt hàng: kiểm tra dữ liệu, tính tiền từ dữ liệu chuẩn, gửi đơn về Google Apps Script.
import { docGio, luuGio, layDuLieuSp, giaVN, MIEN_SHIP_TU } from './gio-hang';

export interface DongDon { sku: string; ten: string; mau: string; sl: number; gia: number; thanhTien: number }
export interface Don {
  maDon: string; thoiGian: string; hoTen: string; sdt: string; tinh: string; xa: string; diaChi: string;
  ghiChu: string; thanhToan: 'COD' | 'CK'; dong: DongDon[]; soSp: number; tamTinh: number; phiShip: string;
  tong: number; cheDoThu: boolean; daGui: boolean;
}

const ENDPOINT = import.meta.env.PUBLIC_ORDER_ENDPOINT ?? '';
export const KHOA_DON = 'tomca-don-cuoi';

const hai = (n: number) => String(n).padStart(2, '0');
function taoMaDon(d = new Date()) {
  return `TC${hai(d.getDate())}${hai(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
}
const thoiGianVN = (d = new Date()) => `${hai(d.getDate())}/${hai(d.getMonth() + 1)}/${d.getFullYear()} ${hai(d.getHours())}:${hai(d.getMinutes())}`;
export const chuanHoaSdt = (s: string) => s.replace(/[\s.\-()]/g, '').replace(/^\+?84/, '0');
export const sdtHopLe = (s: string) => /^0(3|5|7|8|9)\d{8}$/.test(chuanHoaSdt(s));

type DuLieuDvhc = { tinh: [number, string, [number, string][]][] };

export async function khoiTaoDatHang() {
  const form = document.querySelector<HTMLFormElement>('[data-form-dat]')!;
  const $ = <T extends Element = HTMLElement>(s: string) => form.querySelector<T>(s)!;
  const chonTinh = $<HTMLSelectElement>('select[name=tinh]');
  const chonXa = $<HTMLSelectElement>('select[name=xa]');
  const locXa = $<HTMLInputElement>('[data-loc-xa]');

  // --- Giỏ hàng & tiền (giá luôn lấy từ du-lieu-sp.json) ---
  const bang = await layDuLieuSp();
  const gio = docGio().filter((d) => bang.get(d.sku)?.tonKho);
  if (!gio.length) { location.replace('/gio-hang'); return; }
  const dong: DongDon[] = gio.map((d) => {
    const p = bang.get(d.sku)!;
    const sl = Math.min(d.sl, p.tonKho);
    return { sku: p.sku, ten: p.ten, mau: d.mau, sl, gia: p.gia, thanhTien: p.gia * sl };
  });
  const soSp = dong.reduce((t, d) => t + d.sl, 0);
  const tamTinh = dong.reduce((t, d) => t + d.thanhTien, 0);
  const phiShip = soSp >= MIEN_SHIP_TU ? 'Miễn phí' : 'Shop báo khi xác nhận đơn';
  window.tomcaPixel?.('InitiateCheckout', { content_ids: dong.map((d) => d.sku), content_type: 'product', num_items: soSp, value: tamTinh, currency: 'VND' });
  const tomTat = $('[data-tom-tat]');
  tomTat.innerHTML = '';
  for (const d of dong) {
    const li = document.createElement('li');
    li.className = 'flex justify-between gap-3';
    const trai = document.createElement('span');
    trai.textContent = `${d.ten}${d.mau ? ` · ${d.mau}` : ''} × ${d.sl}`;
    const phai = document.createElement('b');
    phai.className = 'shrink-0'; phai.textContent = giaVN(d.thanhTien);
    li.append(trai, phai);
    tomTat.append(li);
  }
  $('[data-tam-tinh]').textContent = giaVN(tamTinh);
  $('[data-phi-ship]').innerHTML = soSp >= MIEN_SHIP_TU ? '<b class="text-xanh-700">Miễn phí</b>' : phiShip;
  $('[data-tong-tien]').textContent = soSp >= MIEN_SHIP_TU ? giaVN(tamTinh) : `${giaVN(tamTinh)} + ship`;

  // --- Tỉnh/thành – phường/xã ---
  let dvhc: DuLieuDvhc | null = null;
  try {
    dvhc = await fetch('/dvhc.json').then((r) => r.json());
    chonTinh.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';
    for (const [ma, ten] of dvhc!.tinh) chonTinh.add(new Option(ten, String(ma)));
    chonTinh.disabled = false;
  } catch {
    chonTinh.innerHTML = '<option value="">Không tải được danh sách — vui lòng tải lại trang</option>';
  }
  const veXa = () => {
    const t = dvhc?.tinh.find(([ma]) => String(ma) === chonTinh.value);
    const tu = locXa.value.trim().toLowerCase();
    const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    const giu = chonXa.value;
    chonXa.innerHTML = '';
    chonXa.add(new Option(t ? 'Chọn phường/xã' : 'Chọn tỉnh/thành trước', ''));
    for (const [ma, ten] of t?.[2] ?? []) if (!tu || boDau(ten.toLowerCase()).includes(boDau(tu))) chonXa.add(new Option(ten, String(ma)));
    chonXa.value = giu;
    chonXa.disabled = !t;
    locXa.classList.toggle('hidden', !t);
  };
  chonTinh.addEventListener('change', () => { locXa.value = ''; chonXa.value = ''; veXa(); });
  locXa.addEventListener('input', veXa);

  // --- Kiểm tra dữ liệu ---
  const baoLoi = (ten: string, loi: string) => {
    const o = form.querySelector<HTMLElement>(`[name=${ten}]`);
    const c = form.querySelector<HTMLElement>(`[data-loi=${ten}]`)!;
    c.textContent = loi; c.classList.toggle('hidden', !loi);
    o?.setAttribute('aria-invalid', String(!!loi));
    o?.classList.toggle('border-red-500', !!loi);
  };
  function kiemTra() {
    const f = new FormData(form);
    const loi: [string, string][] = [
      ['hoTen', String(f.get('hoTen') ?? '').trim().length < 2 ? 'Bố mẹ nhập họ tên người nhận giúp shop.' : ''],
      ['sdt', !sdtHopLe(String(f.get('sdt') ?? '')) ? 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).' : ''],
      ['tinh', !f.get('tinh') ? 'Chọn tỉnh/thành phố.' : ''],
      ['xa', !f.get('xa') ? 'Chọn phường/xã.' : ''],
      ['diaChi', String(f.get('diaChi') ?? '').trim().length < 3 ? 'Nhập số nhà, tên đường hoặc thôn/xóm.' : ''],
    ];
    loi.forEach(([k, v]) => baoLoi(k, v));
    const dau = loi.find(([, v]) => v);
    if (dau) form.querySelector<HTMLElement>(`[name=${dau[0]}]`)?.focus();
    return !dau;
  }
  form.addEventListener('input', (e) => {
    const ten = (e.target as HTMLInputElement).name;
    if (ten && form.querySelector(`[data-loi=${ten}]:not(.hidden)`)) baoLoi(ten, '');
  });

  // --- Gửi đơn ---
  const nut = $<HTMLButtonElement>('[data-nut-dat]');
  const loiChung = $('[data-loi-chung]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loiChung.classList.add('hidden');
    if (!kiemTra()) return;
    const f = new FormData(form);
    const don: Don = {
      maDon: taoMaDon(),
      thoiGian: thoiGianVN(),
      hoTen: String(f.get('hoTen')).trim(),
      sdt: chuanHoaSdt(String(f.get('sdt'))),
      tinh: chonTinh.selectedOptions[0].text,
      xa: chonXa.selectedOptions[0].text,
      diaChi: String(f.get('diaChi')).trim(),
      ghiChu: String(f.get('ghiChu') ?? '').trim(),
      thanhToan: f.get('thanhToan') === 'CK' ? 'CK' : 'COD',
      dong, soSp, tamTinh, phiShip, tong: tamTinh,
      cheDoThu: !ENDPOINT,
      daGui: false,
    };
    nut.disabled = true;
    nut.textContent = 'Đang gửi đơn…';
    try {
      if (ENDPOINT) {
        // text/plain để tránh preflight CORS với Google Apps Script
        const r = await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(don), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        const kq = await r.json().catch(() => ({ ok: r.ok }));
        if (!r.ok || kq.ok === false) throw new Error(kq.loi || `HTTP ${r.status}`);
        don.daGui = true;
      }
      sessionStorage.setItem(KHOA_DON, JSON.stringify(don));
      luuGio([]);
      location.href = '/cam-on';
    } catch (err) {
      console.error(err);
      nut.disabled = false;
      nut.textContent = 'Đặt hàng';
      loiChung.textContent = 'Chưa gửi được đơn (mạng chập chờn?). Bố mẹ thử lại, hoặc nhắn Zalo/gọi 0948 999 433 để shop lên đơn giúp nhé.';
      loiChung.classList.remove('hidden');
    }
  });
}
