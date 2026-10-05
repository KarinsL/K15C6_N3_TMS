import { ADMIN_ROLE } from '../../data/permissions';

// S1-08. Dữ liệu giả để chạy giao diện. Khi tích hợp, thay bằng GET /admin/users (có tìm kiếm, lọc, phân trang ở máy chủ).

export type UserStatus = 'ok' | 'wait' | 'off';
export type User = { name: string; email: string; phone: string; roles: number[]; status: UserStatus; lockReason?: string };

export const STATUS_LABEL: Record<UserStatus, string> = { ok: 'Hoạt động', wait: 'Chờ kích hoạt', off: 'Đã khoá' };

/** Email của người đang đăng nhập trong bản thử. */
export const CURRENT_USER_EMAIL = 'quocbao@tms.vn';

/** Lớp đang phụ trách, dùng cho cảnh báo bàn giao ở S1-10. */
export const CLASSES_BY_EMAIL: Record<string, string[]> = {
  'duclong@tms.vn': ['WEB-K15 · Lập trình web cơ bản', 'DB-K14 · Cơ sở dữ liệu'],
  'hoangnam@tms.vn': ['JS-K15 · JavaScript nâng cao'],
};

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu. */
export const bare = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

export const formatPhone = (p: string) => p.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

const SEED: [string, string, number[], UserStatus][] = [
  ['Nguyễn Minh Anh', 'minhanh', [0], 'ok'],
  ['Trần Thu Hà', 'thuha', [3], 'ok'],
  ['Lê Hoàng Nam', 'hoangnam', [2, 5], 'ok'],
  ['Phạm Gia Huy', 'giahuy', [1], 'wait'],
  ['Đỗ Thị Mai', 'domai', [4], 'ok'],
  ['Vũ Đức Long', 'duclong', [2], 'ok'],
  ['Hoàng Yến Nhi', 'yennhi', [0], 'ok'],
  ['Bùi Quang Khải', 'quangkhai', [0], 'off'],
  ['Trần Quốc Bảo', 'quocbao', [ADMIN_ROLE], 'ok'],
];
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Ngô', 'Đặng'];
const DEM = ['Minh', 'Thu', 'Gia', 'Quang', 'Thị', 'Đức', 'Hoàng', 'Ngọc', 'Thanh', 'Bảo'];
const TEN = ['Anh', 'Hà', 'Nam', 'Huy', 'Mai', 'Long', 'Nhi', 'Khải', 'Tú', 'Linh', 'Phúc', 'Trang', 'Sơn', 'Vy', 'Khoa'];

export function createMockUsers(total = 300): User[] {
  const users: User[] = SEED.map(([name, id, roles, status], i) => ({
    name,
    email: id + '@tms.vn',
    phone: '09' + String(12345678 + i * 7654321).slice(0, 8),
    roles,
    status,
  }));
  for (let i = 0; users.length < total; i++) {
    const name = `${HO[i % 10]} ${DEM[(i * 3 + 1) % 10]} ${TEN[(i * 7 + 2) % 15]}`;
    users.push({
      name,
      email: bare(name).replace(/ /g, '') + (i + 1) + '@tms.vn',
      phone: '09' + String(10000000 + ((i * 7919 + 123457) % 89999999)).slice(0, 8),
      roles: [i % 11 === 0 ? 2 : i % 17 === 0 ? 1 : 0],
      status: i % 23 === 0 ? 'wait' : i % 41 === 0 ? 'off' : 'ok',
    });
  }
  return users;
}
