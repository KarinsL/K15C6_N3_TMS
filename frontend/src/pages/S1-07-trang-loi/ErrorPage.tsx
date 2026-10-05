import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon, type IconName } from '../../components/Icon';
import './error.css';

type Code = '403' | '404' | '500';
type Action = { label: string; kind: 'home' | 'back' | 'reload' };

const ERRORS: Record<Code, { icon: IconName; title: string; text: string; actions: [Action, Action] }> = {
  '403': {
    icon: 'lock',
    title: 'Bạn không có quyền truy cập trang này',
    text: 'Tài khoản của bạn chưa được cấp quyền cho chức năng này. Hãy liên hệ quản trị hệ thống nếu bạn cần dùng.',
    actions: [
      { label: 'Về trang chủ', kind: 'home' },
      { label: 'Quay lại', kind: 'back' },
    ],
  },
  '404': {
    icon: 'search',
    title: 'Không tìm thấy trang',
    text: 'Đường dẫn có thể đã đổi hoặc bị gõ nhầm. Bạn có thể về trang chủ rồi đi tiếp từ menu.',
    actions: [
      { label: 'Về trang chủ', kind: 'home' },
      { label: 'Quay lại', kind: 'back' },
    ],
  },
  '500': {
    icon: 'alert',
    title: 'Hệ thống đang gặp sự cố',
    text: 'Lỗi này không phải do bạn. Vui lòng thử lại sau ít phút.',
    actions: [
      { label: 'Thử lại', kind: 'reload' },
      { label: 'Về trang chủ', kind: 'home' },
    ],
  },
};

// S1-07. Một mẫu dùng chung cho 403, 404, 500, dàn ra cả trang.
// Dùng: <ErrorPage code="403" /> hoặc mở /loi/403. incidentId là mã sự cố do máy chủ trả về (nếu có).
export function ErrorPage({ code, incidentId }: { code?: Code; incidentId?: string }) {
  const params = useParams();
  const navigate = useNavigate();
  const fromUrl = params.code;
  const c: Code = code ?? (fromUrl === '403' || fromUrl === '500' ? fromUrl : '404');
  const e = ERRORS[c];

  const render = (a: Action, primary: boolean) => {
    const className = 'btn' + (primary ? ' primary' : '');
    if (a.kind === 'home')
      return (
        <Link key={a.label} className={className} to="/">
          {a.label}
        </Link>
      );
    return (
      <button key={a.label} className={className} onClick={() => (a.kind === 'back' ? navigate(-1) : window.location.reload())}>
        {a.label}
      </button>
    );
  };

  return (
    <div className="er-full">
      <Link className="er-brand" to="/">
        <span>
          <Icon name="cap" size={22} />
        </span>
        TMS.
      </Link>
      <main className="er-mid">
        <div className="er-num" aria-hidden="true">
          {c}
        </div>
        <div className={'badge' + (c === '500' ? ' amber' : '')}>
          <Icon name={e.icon} />
        </div>
        <p className="eyebrow">Lỗi {c}</p>
        <h1>{e.title}</h1>
        <p className="lead-t">
          {e.text}
          {c === '500' && incidentId ? ` Mã sự cố: ${incidentId}` : ''}
        </p>
        <div className="er-acts">
          {render(e.actions[0], true)}
          {render(e.actions[1], false)}
        </div>
      </main>
    </div>
  );
}
