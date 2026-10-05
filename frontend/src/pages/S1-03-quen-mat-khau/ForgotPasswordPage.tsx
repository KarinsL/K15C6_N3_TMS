import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge, CardPage } from '../../components/CardPage';
import { Icon } from '../../components/Icon';
import { PasswordField } from '../../components/PasswordField';
import { PasswordRules, isStrongPassword } from '../../components/PasswordRules';
import { useToast } from '../../components/Toast';

// S1-03. Liên kết đặt lại: hiệu lực 30 phút, dùng một lần.
// Ở đây token giữ trong state của trang. Khi tích hợp: máy chủ tạo token, gửi email, và kiểm tra khi mở liên kết.
const TTL = 30 * 60;
const RESEND_WAIT = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mmss = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

type Step = 'email' | 'sent' | 'new' | 'dead' | 'done';
type Token = { created: number; used: boolean };

export function ForgotPasswordPage() {
  const toast = useToast();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [token, setToken] = useState<Token | null>(null);
  const [now, setNow] = useState(Date.now());
  const [resendAt, setResendAt] = useState(0);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');

  useEffect(() => {
    if (step !== 'sent') return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [step]);

  const tokenValid = (t: Token | null) => !!t && !t.used && Date.now() - t.created < TTL * 1000;
  const left = token ? Math.max(0, TTL - Math.floor((now - token.created) / 1000)) : 0;
  const resendLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  function issue() {
    const t = Date.now();
    setToken({ created: t, used: false });
    setNow(t);
    setResendAt(t + RESEND_WAIT * 1000);
  }

  function submitEmail(e: FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setEmailError('Vui lòng nhập email');
    if (!EMAIL_RE.test(v)) return setEmailError('Email không đúng định dạng');
    setEmailError('');
    // Luôn hiện cùng một thông báo, dù email có tài khoản hay không, để không dò được ai có tài khoản.
    issue();
    setStep('sent');
  }

  function submitPassword(e: FormEvent) {
    e.preventDefault();
    if (!tokenValid(token)) return setStep('dead');
    setToken({ ...token!, used: true });
    setStep('done');
  }

  const mismatch = p2 !== '' && p1 !== p2;
  const canSave = isStrongPassword(p1) && p2 !== '' && !mismatch;

  const demo =
    token && (step === 'sent' || step === 'dead') ? (
      <details className="demo">
        <summary>Công cụ thử (thay cho hộp thư thật)</summary>
        <button className="btn" onClick={() => setStep(tokenValid(token) ? 'new' : 'dead')}>
          Mở liên kết trong email
        </button>
        <button
          className="btn"
          onClick={() => {
            setToken({ ...token, created: token.created - 31 * 60 * 1000 });
            setStep('dead');
          }}
        >
          Giả lập đã quá 30 phút
        </button>
        <p style={{ marginTop: 8 }}>Bản thử không gửi email. Khi có backend, hai nút này được thay bằng liên kết thật trong thư.</p>
      </details>
    ) : undefined;

  return (
    <CardPage closeTo="/dang-nhap" footer={demo}>
      {step === 'email' && (
        <section>
          <Badge icon="mail" />
          <h1>Quên mật khẩu?</h1>
          <p className="lead-t">Nhập email bạn dùng để đăng nhập.</p>
          <form onSubmit={submitEmail} noValidate>
            <div className="field">
              <label htmlFor="email">Email đăng nhập</label>
              <div className={'inp lead' + (emailError ? ' bad' : '')}>
                <Icon name="mail" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                />
              </div>
              {emailError && <p className="err">{emailError}</p>}
              <p className="hint">Chúng tôi sẽ gửi một liên kết bảo mật đến email này.</p>
            </div>
            <button className="btn primary block">
              Gửi liên kết đặt lại <Icon name="go" />
            </button>
          </form>
          <div className="center">
            <Icon name="back" />
            <Link to="/dang-nhap">Quay lại đăng nhập</Link>
          </div>
        </section>
      )}

      {step === 'sent' && (
        <section>
          <Badge icon="check" />
          <p className="eyebrow">Đã gửi yêu cầu</p>
          <h1>Kiểm tra hộp thư của bạn</h1>
          <p className="lead-t">
            Nếu <b>{email.trim()}</b> có tài khoản, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ này.
          </p>
          <div className="box">
            <Icon name="clock" />
            <div>
              <b>Liên kết hết hạn sau {mmss(left)}</b>
              Chỉ sử dụng được một lần.
            </div>
          </div>
          <button
            className="btn block"
            style={{ height: 50 }}
            disabled={resendLeft > 0}
            onClick={() => {
              issue();
              toast('Đã gửi lại liên kết', 'Liên kết cũ không còn dùng được.');
            }}
          >
            <Icon name="refresh" />
            {resendLeft > 0 ? `Gửi lại liên kết (${mmss(resendLeft)})` : 'Gửi lại liên kết'}
          </button>
          <div className="center">
            <Icon name="back" />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setToken(null);
                setStep('email');
              }}
            >
              Nhập email khác
            </a>
          </div>
        </section>
      )}

      {step === 'new' && (
        <section>
          <Badge icon="lock" />
          <h1>Tạo mật khẩu mới</h1>
          <p className="lead-t">Chọn một mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
          <form onSubmit={submitPassword} noValidate>
            <PasswordField id="p1" label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" value={p1} onChange={setP1} />
            <PasswordField
              id="p2"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={p2}
              onChange={setP2}
              error={mismatch ? 'Hai mật khẩu chưa khớp nhau' : undefined}
            />
            <PasswordRules value={p1} />
            <button className="btn primary block" disabled={!canSave}>
              Cập nhật mật khẩu
            </button>
          </form>
        </section>
      )}

      {step === 'dead' && (
        <section>
          <Badge icon="alert" amber />
          <h1>Liên kết không còn hiệu lực</h1>
          <p className="lead-t">Bạn cần yêu cầu một liên kết mới để đặt lại mật khẩu.</p>
          <div className="box warn">
            <Icon name="clock" />
            <div>
              <b>Liên kết đã hết hạn hoặc đã được dùng</b>
              Mỗi liên kết chỉ dùng được một lần trong vòng 30 phút.
            </div>
          </div>
          <button
            className="btn primary block"
            onClick={() => {
              setToken(null);
              setStep('email');
            }}
          >
            Yêu cầu liên kết mới <Icon name="go" />
          </button>
          <div className="center">
            <Icon name="back" />
            <Link to="/dang-nhap">Quay lại đăng nhập</Link>
          </div>
        </section>
      )}

      {step === 'done' && (
        <section>
          <Badge icon="check" />
          <p className="eyebrow">Hoàn tất</p>
          <h1>Mật khẩu đã được đặt lại</h1>
          <p className="lead-t">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
          <div className="box ok">
            <Icon name="devices" />
            <div>
              <b>Các phiên cũ đã bị đăng xuất</b>
              Mọi thiết bị khác cần đăng nhập lại bằng mật khẩu mới.
            </div>
          </div>
          <Link className="btn primary block" to="/dang-nhap">
            Đăng nhập <Icon name="go" />
          </Link>
        </section>
      )}
    </CardPage>
  );
}
