import { useRef, useState, type FormEvent } from 'react';
import { Badge } from '../../components/CardPage';
import { Icon } from '../../components/Icon';
import { PasswordField } from '../../components/PasswordField';
import { useToast } from '../../components/Toast';
import { AppShell } from '../S1-06-layout-menu/AppShell';
import { SessionWarningDialog } from './SessionWarningDialog';
import { useIdleSession } from './useIdleSession';
import './session.css';

// Thời gian rút ngắn để dễ thử; có thể đổi nhanh bằng ?idle=20&warn=10 trên địa chỉ.
// Khi tích hợp, lấy thời hạn phiên từ cấu hình của máy chủ (ví dụ 30 phút).
const params = new URLSearchParams(window.location.search);
const IDLE_LIMIT = Number(params.get('idle')) || 60;
const WARN_BEFORE = Number(params.get('warn')) || 20;

const FIELDS = [
  ['name', 'Họ và tên'],
  ['phone', 'Số điện thoại'],
  ['email', 'Email'],
  ['course', 'Khoá học quan tâm'],
] as const;
type Draft = Record<(typeof FIELDS)[number][0] | 'note', string>;
const EMPTY: Draft = { name: '', phone: '', email: '', course: '', note: '' };
const mmss = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

type Notice = { kind: 'info' | 'ok'; title: string; text: string };

// S1-02. Trang minh hoạ: form đang nhập dở + phiên tự gia hạn, đăng xuất, hết hạn và khôi phục bản nháp.
export function SessionDemoPage() {
  const toast = useToast();
  const [loggedIn, setLoggedIn] = useState(true);
  const [form, setForm] = useState<Draft>(EMPTY);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const draft = useRef<Draft | null>(null);

  const { secondsLeft, warning, renew } = useIdleSession({
    idleLimit: IDLE_LIMIT,
    warnBefore: WARN_BEFORE,
    active: loggedIn,
    onExpire: () => {
      draft.current = form; // hệ thống thật lưu nháp vào sessionStorage hoặc máy chủ
      setNotice({
        kind: 'info',
        title: 'Phiên đăng nhập đã hết hạn',
        text: 'Vui lòng đăng nhập lại. Nội dung bạn đang nhập dở đã được lưu nháp và sẽ được khôi phục sau khi đăng nhập.',
      });
      setLoggedIn(false);
    },
  });

  function logout() {
    // Khi tích hợp: gọi POST /auth/logout để máy chủ huỷ phiên ngay, rồi mới xoá token ở trình duyệt.
    draft.current = null;
    setForm(EMPTY);
    setNotice({ kind: 'ok', title: 'Bạn đã đăng xuất', text: 'Phiên làm việc đã kết thúc trên máy chủ.' });
    setLoggedIn(false);
  }

  function relogin(e: FormEvent) {
    e.preventDefault();
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      return;
    }
    setPassword('');
    setPasswordError('');
    renew();
    setLoggedIn(true);
    const saved = draft.current;
    draft.current = null;
    if (saved) {
      setForm(saved);
      if (Object.values(saved).some(Boolean)) {
        toast('Đã khôi phục nội dung đang nhập dở', 'Bản nháp được lưu trước khi phiên hết hạn.');
      }
    }
  }

  if (!loggedIn) {
    return (
      <div className="page">
        <div className="card" style={{ maxWidth: 480, paddingTop: 36 }}>
          <Badge icon="lock" />
          <h1>Đăng nhập</h1>
          <p className="lead-t">Nhập lại mật khẩu để tiếp tục.</p>
          {notice && (
            <div className={'box ' + notice.kind}>
              <Icon name={notice.kind === 'ok' ? 'check' : 'clock'} />
              <div>
                <b>{notice.title}</b>
                {notice.text}
              </div>
            </div>
          )}
          <form onSubmit={relogin} noValidate>
            <div className="field">
              <label htmlFor="relogin-email">Email</label>
              <div className="inp lead">
                <Icon name="mail" />
                <input id="relogin-email" type="email" defaultValue="thuha@tms.vn" />
              </div>
            </div>
            <PasswordField
              id="relogin-password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              error={passwordError}
              onChange={setPassword}
            />
            <button className="btn primary block">Đăng nhập</button>
          </form>
        </div>
        <p className="demo">Bản thử: nhập mật khẩu bất kỳ để đăng nhập lại.</p>
      </div>
    );
  }

  return (
    <AppShell roleIndex={3} user="Trần Thu Hà" active="Hồ sơ học viên" crumb="Hồ sơ học viên  /  Thêm học viên" onLogout={logout}>
      <p className="hint" style={{ marginBottom: 12 }}>
        Phiên còn {mmss(secondsLeft)}. Mỗi thao tác sẽ tự gia hạn phiên (bản thử: {IDLE_LIMIT} giây không thao tác thì hết hạn).
      </p>
      <div className="panel">
        <div className="ss-head">
          <span className="ss-tile">
            <Icon name="users" size={24} />
          </span>
          <h2>Thêm học viên mới</h2>
        </div>
        <form
          className="ss-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            toast('Đã lưu học viên', '(Bản thử: chưa ghi vào cơ sở dữ liệu.)');
          }}
        >
          <div className="ss-grid">
            {FIELDS.map(([key, label]) => (
              <div className="field" key={key}>
                <label htmlFor={'s-' + key}>{label}</label>
                <div className="inp">
                  <input id={'s-' + key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
          <div className="field">
            <label htmlFor="s-note">Ghi chú tư vấn</label>
            <div className="inp">
              <textarea id="s-note" style={{ height: 120 }} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn" onClick={() => setForm(EMPTY)}>
              Huỷ
            </button>
            <button className="btn primary">Lưu học viên</button>
          </div>
        </form>
      </div>
      {warning && <SessionWarningDialog secondsLeft={secondsLeft} onStay={renew} onLogout={logout} />}
    </AppShell>
  );
}
