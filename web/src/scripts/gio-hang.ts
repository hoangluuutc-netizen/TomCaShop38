// Giỏ hàng lưu trong trình duyệt (localStorage). Giá chuẩn luôn lấy lại từ /du-lieu-sp.json (sinh từ products.csv).
export interface DongGio { sku: string; mau: string; sl: number }
export interface SpRutGon {
  sku: string; ten: string; gia: number; giaGoc: number | null; mau: string[]; tonKho: number;
  url: string; anh: string | null; hinh: 'vali' | 'cap' | 'hop'; mauHinh: string; doTuoi: string | null; danhMuc: string;
}

const KHOA = 'tomca-gio-v1';
const KHOA_XEM = 'tomca-vua-xem-v1';
export const MIEN_SHIP_TU = 2;

const doc = <T>(k: string, macDinh: T): T => {
  try { return JSON.parse(localStorage.getItem(k) ?? '') as T; } catch { return macDinh; }
};

export const docGio = (): DongGio[] => doc<DongGio[]>(KHOA, []).filter((d) => d && d.sku && d.sl > 0);
export function luuGio(gio: DongGio[]) {
  localStorage.setItem(KHOA, JSON.stringify(gio));
  capNhatSoGio();
}
export const tongSoLuong = (gio = docGio()) => gio.reduce((t, d) => t + d.sl, 0);

export function themVaoGio(sku: string, mau: string, sl = 1) {
  const gio = docGio();
  const co = gio.find((d) => d.sku === sku && d.mau === mau);
  if (co) co.sl = Math.min(co.sl + sl, 99); else gio.push({ sku, mau, sl });
  luuGio(gio);
  // Meta Pixel: AddToCart (giá lấy từ dữ liệu chuẩn)
  if (window.tomcaPixel) {
    layDuLieuSp().then((bang) => {
      const p = bang.get(sku);
      if (p) window.tomcaPixel?.('AddToCart', { content_ids: [sku], content_type: 'product', content_name: p.ten, value: p.gia * sl, currency: 'VND' });
    }).catch(() => {});
  }
}

export function capNhatSoGio() {
  const n = tongSoLuong();
  document.querySelectorAll<HTMLElement>('[data-so-gio]').forEach((el) => {
    el.textContent = String(n);
    el.classList.toggle('hidden', n === 0);
    el.classList.toggle('grid', n > 0);
  });
}

let boNhoSp: Promise<Map<string, SpRutGon>> | null = null;
export function layDuLieuSp() {
  boNhoSp ??= fetch('/du-lieu-sp.json').then((r) => r.json()).then((ds: SpRutGon[]) => new Map(ds.map((s) => [s.sku, s])));
  return boNhoSp;
}

export const giaVN = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

export function ghiVuaXem(sku: string) {
  const ds = doc<string[]>(KHOA_XEM, []).filter((s) => s !== sku);
  ds.unshift(sku);
  localStorage.setItem(KHOA_XEM, JSON.stringify(ds.slice(0, 8)));
}
export const docVuaXem = () => doc<string[]>(KHOA_XEM, []);

export function thongBao(noiDung: string, link?: { ten: string; url: string }) {
  let hop = document.getElementById('thong-bao');
  if (!hop) {
    hop = document.createElement('div');
    hop.id = 'thong-bao';
    hop.setAttribute('role', 'status');
    hop.className = 'fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 transition';
    document.body.append(hop);
  }
  hop.innerHTML = '';
  const the = document.createElement('div');
  the.className = 'flex items-center justify-between gap-3 rounded-2xl bg-xanh-800 px-4 py-3 text-sm text-white shadow-xl';
  const chu = document.createElement('span');
  chu.textContent = noiDung;
  the.append(chu);
  if (link) {
    const a = document.createElement('a');
    a.href = link.url; a.textContent = link.ten;
    a.className = 'shrink-0 rounded-full bg-white px-3 py-1.5 font-semibold text-xanh-800';
    the.append(a);
  }
  hop.append(the);
  clearTimeout((hop as any)._t);
  (hop as any)._t = setTimeout(() => hop!.innerHTML = '', 3500);
}

/** Gắn sự kiện cho mọi nút có data-them-gio='{"sku","mau":[...]}' (nút "+" trên thẻ sản phẩm). */
export function ganNutThemNhanh() {
  const hop = document.getElementById('chon-mau-nhanh') as HTMLDialogElement | null;
  document.addEventListener('click', (e) => {
    const nut = (e.target as HTMLElement).closest<HTMLElement>('[data-them-gio]');
    if (!nut) return;
    e.preventDefault();
    const { sku, ten, mau } = JSON.parse(nut.dataset.themGio!) as { sku: string; ten: string; mau: string[] };
    if (mau.length <= 1 || !hop) {
      themVaoGio(sku, mau[0] ?? '');
      thongBao(`Đã thêm "${ten}" vào giỏ`, { ten: 'Xem giỏ', url: '/gio-hang' });
      return;
    }
    hop.querySelector('[data-ten]')!.textContent = ten;
    const ds = hop.querySelector('[data-ds-mau]')!;
    ds.innerHTML = '';
    for (const m of mau) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = m;
      b.addEventListener('click', () => {
        themVaoGio(sku, m);
        hop.close();
        thongBao(`Đã thêm "${ten}" (${m}) vào giỏ`, { ten: 'Xem giỏ', url: '/gio-hang' });
      });
      ds.append(b);
    }
    hop.showModal();
  });
}
