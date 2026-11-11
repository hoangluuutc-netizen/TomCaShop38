// Nội dung trang chính sách — chép từ docs/chinh-sach.md, CHỈ gồm các dòng chủ shop đã cung cấp.
// Dòng "(đề xuất — chờ duyệt)" trong chinh-sach.md chưa đưa lên web; khi chủ shop duyệt thì thêm vào đây.
import { SHOP } from './shop';

export interface TrangChinhSach { slug: string; ten: string; moTa: string; doan: { tieuDe?: string; y: string[] }[] }

export const CHINH_SACH_TRANG: TrangChinhSach[] = [
  {
    slug: 'van-chuyen',
    ten: 'Vận chuyển & kiểm tra hàng',
    moTa: 'Giao toàn quốc 3–5 ngày, miễn phí ship đơn từ 2 sản phẩm, được kiểm tra hàng trước khi thanh toán.',
    doan: [
      { tieuDe: 'Giao hàng', y: [
        'Shop giao hàng toàn quốc.',
        'Thời gian giao: 3 – 5 ngày kể từ khi shop xác nhận đơn.',
        'Phí ship tính theo bảng giá của đơn vị vận chuyển; shop báo phí chính xác khi xác nhận đơn.',
        'Miễn phí ship cho đơn từ 2 sản phẩm trở lên.',
      ] },
      { tieuDe: 'Kiểm tra hàng', y: [
        'Bố mẹ được kiểm tra hàng trước khi thanh toán (mở hộp xem sản phẩm, không dùng thử).',
        'Gợi ý: bố mẹ quay video lúc mở hàng để shop hỗ trợ nhanh nếu có vấn đề.',
      ] },
    ],
  },
  {
    slug: 'doi-tra',
    ten: 'Đổi trả',
    moTa: 'Đổi trả trong 1 ngày nếu sản phẩm hư hỏng do shop hoặc do vận chuyển, shop chịu toàn bộ phí ship.',
    doan: [
      { y: [
        'Shop nhận đổi trả khi sản phẩm hư hỏng do lỗi của shop hoặc do quá trình vận chuyển.',
        'Thời hạn: không quá 1 ngày kể từ khi đơn hàng được giao thành công.',
        'Shop chịu toàn bộ phí vận chuyển đổi trả.',
        `Cách báo: nhắn Zalo hoặc gọi ${SHOP.dienThoai}, gửi kèm ảnh/video sản phẩm lỗi.`,
      ] },
    ],
  },
  {
    slug: 'bao-hanh',
    ten: 'Bảo hành',
    moTa: 'Sản phẩm TomCaShop được bảo hành 3 tháng kể từ ngày nhận hàng.',
    doan: [
      { y: [
        'Bảo hành 3 tháng kể từ ngày nhận hàng.',
        `Khi cần bảo hành, bố mẹ nhắn Zalo hoặc gọi ${SHOP.dienThoai} kèm mã đơn và ảnh/video sản phẩm để shop hướng dẫn.`,
      ] },
    ],
  },
  {
    slug: 'thanh-toan',
    ten: 'Thanh toán',
    moTa: 'Thanh toán khi nhận hàng (COD) hoặc chuyển khoản qua mã QR.',
    doan: [
      { y: [
        'COD — thanh toán tiền mặt khi nhận hàng (mặc định). Bố mẹ được kiểm tra hàng trước khi trả tiền.',
        'Chuyển khoản qua mã QR: mã QR kèm số tiền và nội dung (mã đơn) hiện ngay sau khi đặt hàng.',
      ] },
    ],
  },
  {
    slug: 'bao-mat',
    ten: 'Bảo mật thông tin',
    moTa: 'Cách TomCaShop thu thập và sử dụng thông tin khi bố mẹ đặt hàng.',
    doan: [
      { tieuDe: 'Thông tin shop thu thập', y: ['Khi đặt hàng, bố mẹ cung cấp: họ tên, số điện thoại, địa chỉ giao hàng và ghi chú (nếu có).'] },
      { tieuDe: 'Mục đích sử dụng', y: ['Xác nhận đơn, giao hàng (thông tin được chuyển cho đơn vị vận chuyển để giao), hỗ trợ đổi trả và bảo hành.'] },
      { tieuDe: 'Liên hệ về thông tin cá nhân', y: [`Bố mẹ muốn xem, sửa hoặc xóa thông tin của mình, vui lòng liên hệ ${SHOP.dienThoai} (gọi/Zalo) trong giờ làm việc ${SHOP.gioLamViec}.`] },
    ],
  },
];
