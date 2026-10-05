type Props = { secondsLeft: number; onStay: () => void; onLogout: () => void };

const mmss = (s: number) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

// Hộp thoại cảnh báo phiên sắp hết hạn.
export function SessionWarningDialog({ secondsLeft, onStay, onLogout }: Props) {
  return (
    <div className="overlay">
      <div className="modal" role="alertdialog" aria-labelledby="session-warning-title">
        <h3 id="session-warning-title" style={{ fontSize: 22 }}>
          Phiên sắp hết hạn
        </h3>
        <p style={{ color: 'var(--muted)', margin: '10px 0 22px', fontSize: 15 }}>
          Bạn chưa thao tác một lúc. Phiên sẽ tự kết thúc sau <b>{mmss(secondsLeft)}</b>. Nội dung đang nhập vẫn được giữ nguyên.
        </p>
        <div className="acts">
          <button className="btn" onClick={onLogout}>
            Đăng xuất
          </button>
          <button className="btn primary" style={{ flex: 1 }} onClick={onStay}>
            Tiếp tục làm việc
          </button>
        </div>
      </div>
    </div>
  );
}
