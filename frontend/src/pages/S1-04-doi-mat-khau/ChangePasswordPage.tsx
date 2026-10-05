import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge, CardPage } from '../../components/CardPage';
import { Icon } from '../../components/Icon';
import { PasswordField } from '../../components/PasswordField';
import { PasswordRules, isStrongPassword } from '../../components/PasswordRules';

// S1-04. Mật khẩu hiện tại của tài khoản mẫu. Khi tích hợp: gọi POST /auth/change-password,
// máy chủ kiểm tra mật khẩu hiện tại và thu hồi mọi phiên đăng nhập khác.
const DEMO_CURRENT = 'Tms@2026';

export function ChangePasswordPage() {
  const [current, setCurrent] = useState('');
  const [currentError, setCurrentError] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [done, setDone] = useState(false);

  const mismatch = p2 !== '' && p1 !== p2;
  const canSave = current !== '' && isStrongPassword(p1) && p2 !== '' && !mismatch;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (current !== DEMO_CURRENT) {
      setCurrentError('Mật khẩu hiện tại không đúng');
      return;
    }
    setDone(true);
  }

  const footer = (
    <details className="demo">
      <summary>Ghi chú thử</summary>
      <p style={{ marginTop: 8 }}>
        Mật khẩu hiện tại của tài khoản mẫu là <code>{DEMO_CURRENT}</code>.
      </p>
    </details>
  );

  return (
    <CardPage closeTo="/" footer={done ? undefined : footer}>
      {done ? (
        <section>
          <Badge icon="check" />
          <p className="eyebrow">Hoàn tất</p>
          <h1>Đã đổi mật khẩu</h1>
          <p className="lead-t">Mật khẩu mới có hiệu lực ngay từ bây giờ.</p>
          <div className="box ok">
            <Icon name="devices" />
            <div>
              <b>Các phiên đăng nhập khác đã bị thu hồi</b>
              Phiên trên thiết bị này vẫn giữ nguyên.
            </div>
          </div>
          <Link className="btn primary block" to="/">
            Về trang chủ <Icon name="go" />
          </Link>
        </section>
      ) : (
        <section>
          <Badge icon="key" />
          <h1>Đổi mật khẩu</h1>
          <p className="lead-t">Nhập mật khẩu hiện tại rồi chọn một mật khẩu mới.</p>
          <form onSubmit={submit} noValidate>
            <PasswordField
              id="current"
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              autoComplete="current-password"
              value={current}
              error={currentError}
              onChange={(v) => {
                setCurrent(v);
                setCurrentError('');
              }}
            />
            <PasswordField id="p1" label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" value={p1} onChange={setP1} />
            <PasswordField
              id="p2"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              value={p2}
              onChange={setP2}
              error={mismatch ? 'Hai mật khẩu chưa khớp nhau' : undefined}
            />
            <PasswordRules value={p1} />
            <div className="box">
              <Icon name="devices" />
              <div>
                <b>Các thiết bị khác sẽ bị đăng xuất</b>
                Phiên trên thiết bị này vẫn giữ nguyên.
              </div>
            </div>
            <button className="btn primary block" disabled={!canSave}>
              Cập nhật mật khẩu
            </button>
          </form>
        </section>
      )}
    </CardPage>
  );
}
