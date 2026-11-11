// Đọc sản phẩm từ products/products.csv — nguồn dữ liệu DUY NHẤT về giá, size, chất liệu, tồn kho.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

export type MaDanhMuc = 'vali-tre-em' | 'cap-da-tre-em' | 'do-dung-be';
export type Hinh = 'vali' | 'cap' | 'hop';

export interface DanhMuc {
  slug: MaDanhMuc;
  ten: string;
  hinh: Hinh;
  moTa: string;
  nen: string; // lớp Tailwind cho nền ô danh mục
  mauHinh: string; // màu hình minh họa
}

export const DANH_MUC: DanhMuc[] = [
  { slug: 'vali-tre-em', ten: 'Vali trẻ em', hinh: 'vali', moTa: 'Vali kéo cho bé đi chơi, về quê, du lịch.', nen: 'bg-xanh-50', mauHinh: '#2B8FD6' },
  { slug: 'cap-da-tre-em', ten: 'Cặp da trẻ em', hinh: 'cap', moTa: 'Cặp đi học cho bé từ mẫu giáo đến THCS.', nen: 'bg-hong-50', mauHinh: '#F27AA3' },
  { slug: 'do-dung-be', ten: 'Đồ dùng bé', hinh: 'hop', moTa: 'Hộp cơm, bình nước, túi bút và đồ dùng hằng ngày.', nen: 'bg-vang-50', mauHinh: '#F5B82E' },
];

export const NHOM_TUOI = [
  { slug: '3-5', ten: '3–5 tuổi', phu: 'mầm non', tu: 3, den: 5 },
  { slug: '6-10', ten: '6–10 tuổi', phu: 'tiểu học', tu: 6, den: 10 },
  { slug: '11-15', ten: '11–15 tuổi', phu: 'THCS', tu: 11, den: 15 },
] as const;

export const KHOANG_GIA = [
  { slug: 'duoi-300', ten: 'Dưới 300.000đ', tu: 0, den: 299_999 },
  { slug: '300-600', ten: '300.000đ – 600.000đ', tu: 300_000, den: 600_000 },
  { slug: 'tren-600', ten: 'Trên 600.000đ', tu: 600_001, den: Infinity },
] as const;

const MA_MAU: Record<string, string> = {
  'xanh dương': '#2B8FD6', 'xanh': '#2B8FD6', 'xanh navy': '#1E3A6E', 'hồng': '#F27AA3', 'vàng': '#F5B82E',
  'xanh lá': '#7CC242', 'xám': '#94A3B8', 'đen': '#1E293B', 'trắng': '#FFFFFF', 'đỏ': '#E5484D',
  'tím': '#9B7FE6', 'cam': '#F59340', 'be': '#E8D9C0', 'nâu': '#8B5E3C',
};
export const maMau = (ten: string) => MA_MAU[ten.trim().toLowerCase()] ?? '#CBD5E1';

export interface SanPham {
  sku: string;
  ten: string;
  danhMuc: DanhMuc;
  giaBan: number;
  giaGoc: number | null;
  phanTramGiam: number | null;
  kichThuoc: string;
  mau: string[];
  chatLieu: string;
  doTuoi: { tu: number; den: number; nhan: string } | null;
  tonKho: number;
  anh: string[]; // đường dẫn ảnh đã sẵn trên web, rỗng = dùng hình minh họa
  moTaNgan: string;
  laMau: boolean;
  url: string;
}

const tachDanh = (s: string) => s.split('|').map((x) => x.trim()).filter(Boolean);

function timDanhMuc(ten: string): DanhMuc {
  const t = ten.trim().toLowerCase();
  const dm = DANH_MUC.find((d) => d.ten.toLowerCase() === t || d.slug === t);
  if (!dm) throw new Error(`products.csv: danh mục không hợp lệ "${ten}". Dùng: ${DANH_MUC.map((d) => d.ten).join(', ')}`);
  return dm;
}

function docTuoi(s: string): SanPham['doTuoi'] {
  const m = s.trim().match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (!m) return null;
  const tu = +m[1], den = +m[2];
  return { tu, den, nhan: `${tu}–${den} tuổi` };
}

function docSo(s: string, cot: string, sku: string): number | null {
  const t = (s ?? '').replace(/[.\s,đ]/g, '');
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) throw new Error(`products.csv: ${sku} cột ${cot} không phải số: "${s}"`);
  return n;
}

let boNho: SanPham[] | null = null;

export function laySanPham(): SanPham[] {
  if (boNho) return boNho;
  const file = path.resolve(process.cwd(), '../products/products.csv');
  const dong: Record<string, string>[] = parse(fs.readFileSync(file, 'utf8'), {
    columns: true, skip_empty_lines: true, trim: true, bom: true,
  });
  boNho = dong.map((d) => {
    const sku = d.sku;
    const giaBan = docSo(d.gia_ban, 'gia_ban', sku);
    if (giaBan === null) throw new Error(`products.csv: ${sku} thiếu gia_ban`);
    const giaGocRaw = docSo(d.gia_goc, 'gia_goc', sku);
    const giaGoc = giaGocRaw && giaGocRaw > giaBan ? giaGocRaw : null;
    return {
      sku,
      ten: d.ten,
      danhMuc: timDanhMuc(d.danh_muc),
      giaBan,
      giaGoc,
      phanTramGiam: giaGoc ? Math.round((1 - giaBan / giaGoc) * 100) : null,
      kichThuoc: d.kich_thuoc ?? '',
      mau: tachDanh(d.mau ?? ''),
      chatLieu: d.chat_lieu ?? '',
      doTuoi: docTuoi(d.do_tuoi ?? ''),
      tonKho: docSo(d.ton_kho, 'ton_kho', sku) ?? 0,
      anh: tachDanh(d.anh ?? '').map((a) => (a.startsWith('http') ? a : `/anh-sp/${a}`)),
      moTaNgan: d.mo_ta_ngan ?? '',
      laMau: sku.toUpperCase().startsWith('MAU-'),
      url: `/san-pham/${sku.toLowerCase()}`,
    } satisfies SanPham;
  });
  return boNho;
}

export const coDuLieuMau = () => laySanPham().some((s) => s.laMau);

export const giaVN = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

/** Sản phẩm có hợp với nhóm tuổi không (khoảng tuổi giao nhau). */
export const hopTuoi = (sp: SanPham, tu: number, den: number) =>
  !!sp.doTuoi && sp.doTuoi.tu <= den && sp.doTuoi.den >= tu;

export const nhomTuoiCua = (sp: SanPham) => NHOM_TUOI.filter((n) => hopTuoi(sp, n.tu, n.den)).map((n) => n.slug);
export const khoangGiaCua = (sp: SanPham) => KHOANG_GIA.find((k) => sp.giaBan >= k.tu && sp.giaBan <= k.den)!.slug;
