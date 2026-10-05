import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { ADMIN_ROLE } from '../../data/permissions';
import { RoleChips } from '../S1-09-gan-vai-tro/RoleChips';
import { STATUS_LABEL, formatPhone, type User } from './mockUsers';

type Props = {
  /** Có user là sửa, không có là tạo mới. */
  user?: User;
  users: User[];
  currentUserEmail: string;
  onSave: (user: User, isNew: boolean) => void;
  onClose: () => void;
  onLockClick: (user: User) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// S1-08. Ngăn bên phải để tạo hoặc sửa tài khoản. Phần vai trò là thành phần của S1-09.
export function UserFormDrawer({ user, users, currentUserEmail, onSave, onClose, onLockClick }: Props) {
  const isNew = !user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user ? formatPhone(user.phone) : '');
  const [roles, setRoles] = useState<number[]>(user?.roles ?? []);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; roles?: string }>({});
  const title = isNew ? 'Thêm tài khoản' : 'Sửa tài khoản';

  function submit() {
    const next: typeof errors = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\s/g, '');
    if (!cleanName) next.name = 'Vui lòng nhập họ và tên';
    if (isNew) {
      const dup = users.find((u) => u.email === cleanEmail);
      if (!cleanEmail) next.email = 'Vui lòng nhập email';
      else if (!EMAIL_RE.test(cleanEmail)) next.email = 'Email không đúng định dạng';
      else if (dup) next.email = `Email này đã được dùng cho tài khoản ${dup.name}`;
    }
    if (!/^0\d{9}$/.test(cleanPhone)) next.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    if (roles.length === 0) next.roles = 'Chọn ít nhất một vai trò';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave({ ...(user ?? { status: 'wait' as const }), name: cleanName, email: cleanEmail, phone: cleanPhone, roles }, isNew);
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={title}>
        <header>
          <h3>{title}</h3>
          <button aria-label="Đóng" onClick={onClose}>
            <Icon name="x" />
          </button>
        </header>
        <div className="body">
          {user && (
            <div className="us-head">
              <i>{user.name.split(' ').pop()?.[0]}</i>
              <div>
                <b>{user.name}</b>
                <span className={'pill ' + user.status}>{STATUS_LABEL[user.status]}</span>
              </div>
            </div>
          )}
          <div className="field">
            <label htmlFor="u-name">Họ và tên</label>
            <div className={'inp' + (errors.name ? ' bad' : '')}>
              <input id="u-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus={isNew} />
            </div>
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="u-email">Email</label>
            <div className={'inp lead' + (errors.email ? ' bad' : '')}>
              <Icon name="mail" />
              <input id="u-email" type="email" value={email} disabled={!isNew} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {errors.email && <p className="err">{errors.email}</p>}
            {!isNew && <p className="hint">Email là tên đăng nhập, không đổi được ở đây.</p>}
          </div>
          <div className="field">
            <label htmlFor="u-phone">Số điện thoại</label>
            <div className={'inp' + (errors.phone ? ' bad' : '')}>
              <input id="u-phone" value={phone} placeholder="09xx xxx xxx" onChange={(e) => setPhone(e.target.value)} />
            </div>
            {errors.phone && <p className="err">{errors.phone}</p>}
          </div>

          <div className="us-sect">
            <b>Vai trò</b>
            <RoleChips
              value={roles}
              onChange={(r) => {
                setRoles(r);
                setErrors((x) => ({ ...x, roles: undefined }));
              }}
              protectedRole={user?.email === currentUserEmail ? ADMIN_ROLE : undefined}
              onBlocked={() => setErrors((x) => ({ ...x, roles: 'Bạn không thể tự thu hồi vai trò quản trị của chính mình.' }))}
            />
            {errors.roles && <p className="err">{errors.roles}</p>}
            <p className="hint" style={{ marginTop: 10 }}>
              Một người có thể giữ nhiều vai trò cùng lúc. Thay đổi vai trò có hiệu lực ngay ở thao tác kế tiếp, người dùng không cần
              đăng nhập lại.
            </p>
          </div>

          {isNew ? (
            <div className="box" style={{ marginTop: 20 }}>
              <Icon name="mail" />
              <div>
                <b>Email kích hoạt sẽ được gửi ngay</b>
                Kèm mật khẩu tạm, người dùng đổi lại ở lần đăng nhập đầu.
              </div>
            </div>
          ) : (
            <div className="us-sect">
              <b>Trạng thái tài khoản</b>
              <button className="btn us-danger" onClick={() => onLockClick(user)}>
                <Icon name="lock" />
                {user.status === 'off' ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
              </button>
            </div>
          )}
        </div>
        <footer>
          <button className="btn" onClick={onClose}>
            Huỷ
          </button>
          <button className="btn primary" onClick={submit}>
            {isNew ? 'Tạo tài khoản' : 'Lưu thay đổi'}
          </button>
        </footer>
      </aside>
    </>
  );
}
