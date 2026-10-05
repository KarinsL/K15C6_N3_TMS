import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_ROLE, ROLES, menuFor } from '../../data/permissions';
import { AppShell } from './AppShell';

// Tên mẫu cho từng vai trò, chỉ để xem thử menu.
const PEOPLE = ['Nguyễn Minh Anh', 'Phạm Gia Huy', 'Lê Hoàng Nam', 'Trần Thu Hà', 'Đỗ Thị Mai', 'Ngô Thanh Tú', 'Trần Quốc Bảo'];

// S1-06. Trang chủ minh hoạ layout: đổi vai trò để thấy menu thay đổi theo quyền.
export function HomePage() {
  const [roleIndex, setRoleIndex] = useState<number>(ADMIN_ROLE);
  const user = PEOPLE[roleIndex];
  return (
    <AppShell roleIndex={roleIndex} user={user} active="Trang chủ">
      <div className="h">
        <div>
          <h2>Xin chào, {user.split(' ').pop()}</h2>
          <p>Bạn đang đăng nhập với vai trò {ROLES[roleIndex]}.</p>
        </div>
        <div className="field" style={{ margin: 0, minWidth: 240 }}>
          <label htmlFor="role">Xem thử với vai trò</label>
          <div className="inp">
            <select id="role" value={roleIndex} onChange={(e) => setRoleIndex(Number(e.target.value))}>
              {ROLES.map((r, i) => (
                <option key={r} value={i}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="panel" style={{ padding: '20px 24px' }}>
        <b>Module hiện trong menu của vai trò này</b>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {menuFor(roleIndex)
            .slice(1)
            .map((m) => (
              <span className="pill" key={m.name}>
                {m.name}
              </span>
            ))}
        </div>
        <p className="hint" style={{ marginTop: 14 }}>
          Mục menu không thuộc quyền thì không hiển thị. Thu hẹp cửa sổ xuống dưới 900px để xem menu dạng ngăn trượt.
        </p>
      </div>
      <div className="panel" style={{ marginTop: 16, padding: '20px 24px' }}>
        <b>Liên kết nhanh</b>
        <p style={{ marginTop: 8 }}>
          <Link to="/s1">Mục lục Sprint 1</Link> · <Link to="/doi-mat-khau">Đổi mật khẩu</Link> ·{' '}
          <Link to="/quan-tri/phan-quyen">Ma trận phân quyền</Link> · <Link to="/quan-tri/tai-khoan">Tài khoản người dùng</Link>
        </p>
      </div>
    </AppShell>
  );
}
