import { Link } from 'react-router-dom';

const STORIES = [
  ['S1-01', 'Đăng nhập', '/dang-nhap'],
  ['S1-02', 'Phiên đăng nhập và đăng xuất', '/phien'],
  ['S1-03', 'Quên mật khẩu', '/quen-mat-khau'],
  ['S1-04', 'Đổi mật khẩu', '/doi-mat-khau'],
  ['S1-05', 'Ma trận phân quyền', '/quan-tri/phan-quyen'],
  ['S1-06', 'Layout và menu theo vai trò', '/'],
  ['S1-07', 'Trang lỗi 403, 404, 500', '/loi/403'],
  ['S1-08', 'Tài khoản người dùng', '/quan-tri/tai-khoan'],
  ['S1-09', 'Gán vai trò (trong ngăn Sửa tài khoản)', '/quan-tri/tai-khoan?mo=sua'],
  ['S1-10', 'Khoá tài khoản (hộp thoại)', '/quan-tri/tai-khoan?mo=khoa'],
] as const;

// Trang mục lục để đội dev và người duyệt mở nhanh từng story của Sprint 1.
export function StoryIndexPage() {
  return (
    <div className="page">
      <div className="card">
        <h1>Sprint 1</h1>
        <p className="lead-t">Chọn một story để mở màn hình tương ứng.</p>
        <table>
          <tbody>
            {STORIES.map(([id, name, to]) => (
              <tr key={id}>
                <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{id}</td>
                <td>
                  <Link to={to}>{name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
