import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { ADMIN_ROLE, ROLES } from '../../data/permissions';
import { AppShell } from '../S1-06-layout-menu/AppShell';
import { LockAccountDialog } from '../S1-10-khoa-tai-khoan/LockAccountDialog';
import { UserFormDrawer } from './UserFormDrawer';
import {
  CLASSES_BY_EMAIL,
  CURRENT_USER_EMAIL,
  STATUS_LABEL,
  bare,
  createMockUsers,
  formatPhone,
  type User,
  type UserStatus,
} from './mockUsers';
import './users.css';

const PAGE_SIZE = 20;
type FormTarget = { mode: 'new' } | { mode: 'edit'; email: string } | null;

// S1-08. Danh sách tài khoản: tìm kiếm, lọc theo vai trò và trạng thái, phân trang 20 dòng, tạo và sửa.
// Mở kèm ?mo=sua hoặc ?mo=khoa để xem ngay ngăn sửa (S1-09) hoặc hộp thoại khoá (S1-10).
export function UserListPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>(() => createMockUsers());
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormTarget>(null);
  const [lockEmail, setLockEmail] = useState<string | null>(null);

  useEffect(() => {
    const open = new URLSearchParams(window.location.search).get('mo');
    if (open === 'sua') setForm({ mode: 'edit', email: 'hoangnam@tms.vn' });
    if (open === 'khoa') setLockEmail('duclong@tms.vn');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setForm(null);
        setLockEmail(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = bare(query.trim());
    return users.filter(
      (u) =>
        (!q || bare(u.name).includes(q) || u.email.includes(q) || u.phone.includes(q.replace(/\s/g, ''))) &&
        (role === '' || u.roles.includes(Number(role))) &&
        (status === '' || u.status === status),
    );
  }, [users, query, role, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const from = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(from, from + PAGE_SIZE);
  const byEmail = (email: string | null) => users.find((u) => u.email === email);
  const editing = form?.mode === 'edit' ? byEmail(form.email) : undefined;
  const locking = byEmail(lockEmail);

  function askLock(u: User) {
    if (u.email === CURRENT_USER_EMAIL) {
      toast('Không thể khoá tài khoản của chính bạn');
      return;
    }
    setForm(null);
    setLockEmail(u.email);
  }

  function save(user: User, isNew: boolean) {
    if (isNew) {
      // Khi tích hợp: POST /admin/users, máy chủ gửi email kích hoạt kèm mật khẩu tạm.
      setUsers((list) => [user, ...list]);
      setPage(1);
      toast('Đã tạo tài khoản', `Email kích hoạt kèm mật khẩu tạm đã gửi tới ${user.email}.`);
    } else {
      setUsers((list) => list.map((u) => (u.email === user.email ? user : u)));
      toast('Đã lưu thay đổi', 'Vai trò mới có hiệu lực ngay ở thao tác kế tiếp.');
    }
    setForm(null);
  }

  function confirmLock(u: User, reason?: string) {
    const locked = u.status !== 'off';
    const next: UserStatus = locked ? 'off' : 'ok';
    setUsers((list) => list.map((x) => (x.email === u.email ? { ...x, status: next, lockReason: locked ? reason : undefined } : x)));
    toast(locked ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản', locked ? `Các phiên đang mở của ${u.name} đã bị thu hồi.` : undefined);
    setLockEmail(null);
  }

  const pageButtons: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - current) <= 1) pageButtons.push(p);
    else if (pageButtons[pageButtons.length - 1] !== '…') pageButtons.push('…');
  }

  return (
    <AppShell roleIndex={ADMIN_ROLE} user="Trần Quốc Bảo" active="Người dùng & nhật ký" crumb="Người dùng & nhật ký  /  Tài khoản">
      <div className="h">
        <div>
          <h2>Tài khoản người dùng</h2>
          <p>{users.length} tài khoản</p>
        </div>
        <button className="btn" onClick={() => toast('Nhập từ Excel thuộc story S2-01', 'Màn hình này sẽ làm ở Sprint 2.')}>
          <Icon name="upload" />
          Nhập từ Excel
        </button>
        <button className="btn primary" onClick={() => setForm({ mode: 'new' })}>
          <Icon name="plus" />
          Thêm tài khoản
        </button>
      </div>

      <div className="us-filters">
        <div className="inp lead">
          <Icon name="search" />
          <input
            placeholder="Tìm theo tên, email, số điện thoại"
            aria-label="Tìm kiếm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="inp">
          <select
            aria-label="Lọc theo vai trò"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Vai trò: Tất cả</option>
            {ROLES.map((r, i) => (
              <option key={r} value={i}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="inp">
          <select
            aria-label="Lọc theo trạng thái"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Trạng thái: Tất cả</option>
            {(Object.keys(STATUS_LABEL) as UserStatus[]).map((k) => (
              <option key={k} value={k}>
                {STATUS_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel">
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="us-empty">
                    Không có tài khoản nào khớp điều kiện tìm.
                  </td>
                </tr>
              )}
              {rows.map((u) => (
                <tr key={u.email}>
                  <td>
                    <span className="us-name">
                      <i>{u.name.split(' ').pop()?.[0]}</i>
                      {u.name}
                    </span>
                  </td>
                  <td className="us-muted">{u.email}</td>
                  <td className="us-muted">{formatPhone(u.phone)}</td>
                  <td>
                    {u.roles.map((r) => (
                      <span className="pill" key={r}>
                        {ROLES[r]}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={'pill ' + u.status}>{STATUS_LABEL[u.status]}</span>
                  </td>
                  <td className="us-act">
                    <button onClick={() => setForm({ mode: 'edit', email: u.email })}>Sửa</button>
                    <button className="d" onClick={() => askLock(u)}>
                      {u.status === 'off' ? 'Mở khoá' : 'Khoá'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="us-pager">
          <span>{filtered.length > 0 && `Hiển thị ${from + 1}–${from + rows.length} trong ${filtered.length} tài khoản`}</span>
          <span>
            <button disabled={current === 1} aria-label="Trang trước" onClick={() => setPage(current - 1)}>
              ‹
            </button>
            {pageButtons.map((p, i) =>
              p === '…' ? (
                <span key={'gap' + i}> … </span>
              ) : (
                <button key={p} className={p === current ? 'on' : undefined} onClick={() => setPage(p)}>
                  {p}
                </button>
              ),
            )}
            <button disabled={current === pages} aria-label="Trang sau" onClick={() => setPage(current + 1)}>
              ›
            </button>
          </span>
        </div>
      </div>

      {form && (form.mode === 'new' || editing) && (
        <UserFormDrawer
          user={editing}
          users={users}
          currentUserEmail={CURRENT_USER_EMAIL}
          onSave={save}
          onClose={() => setForm(null)}
          onLockClick={askLock}
        />
      )}
      {locking && (
        <LockAccountDialog
          user={locking}
          classes={CLASSES_BY_EMAIL[locking.email] ?? []}
          onConfirm={(reason) => confirmLock(locking, reason)}
          onCancel={() => setLockEmail(null)}
        />
      )}
    </AppShell>
  );
}
