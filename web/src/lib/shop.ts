// Thông tin shop — nguồn: brand/ho-so-thuong-hieu.md và docs/chinh-sach.md. Sửa ở đây khi thông tin thay đổi.
export const SHOP = {
  ten: 'TomCaShop',
  moTa: 'Vali, cặp da và đồ dùng cho bé 3–15 tuổi. Giao toàn quốc, thanh toán khi nhận hàng.',
  nguoiBan: 'Nguyễn Hoàng Lưu',
  diaChi: 'HH03A, TDP Thanh Hà 1, xã Bình Minh, TP Hà Nội',
  dienThoai: '0948 999 433',
  dienThoaiSo: '0948999433',
  zalo: 'https://zalo.me/0948999433',
  // Chưa có link m.me của Fanpage → để null thì nút Messenger tự ẩn.
  messenger: null as string | null,
  fanpage: 'TomcaShop',
  gioLamViec: '8h00 – 18h00',
} as const;

/** Chính sách tóm tắt — chỉ dòng chủ shop đã cung cấp (không dùng dòng "đề xuất — chờ duyệt"). */
export const CHINH_SACH = {
  giaoHang: 'Giao toàn quốc 3–5 ngày',
  phiShip: 'Phí ship theo đơn vị vận chuyển, shop báo khi xác nhận đơn',
  mienShipTu: 2, // số sản phẩm
  mienShip: 'Miễn phí ship cho đơn từ 2 sản phẩm',
  kiemTra: 'Được kiểm tra hàng trước khi thanh toán',
  doiTra: 'Đổi trả trong 1 ngày nếu hàng hư hỏng do shop hoặc vận chuyển, shop chịu phí ship',
  baoHanh: 'Bảo hành 3 tháng',
  thanhToan: 'Thanh toán khi nhận hàng (COD) hoặc chuyển khoản QR',
} as const;

/** Từ khóa gợi ý "Bố mẹ hay tìm" — chỉ trỏ tới bộ lọc có sẵn. */
export const BO_ME_HAY_TIM = [
  { ten: 'Vali cho bé mầm non', url: '/danh-muc/vali-tre-em?tuoi=3-5' },
  { ten: 'Cặp đi học lớp 1', url: '/danh-muc/cap-da-tre-em?tuoi=6-10' },
  { ten: 'Cặp cho học sinh THCS', url: '/danh-muc/cap-da-tre-em?tuoi=11-15' },
  { ten: 'Vali đi du lịch', url: '/danh-muc/vali-tre-em' },
  { ten: 'Hộp cơm, bình nước', url: '/danh-muc/do-dung-be' },
  { ten: 'Dưới 300.000đ', url: '/tim-kiem?gia=duoi-300' },
];
