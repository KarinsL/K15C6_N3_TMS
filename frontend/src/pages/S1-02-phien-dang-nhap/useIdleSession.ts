import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  /** Số giây không thao tác thì phiên hết hạn. */
  idleLimit: number;
  /** Hiện cảnh báo trước khi hết hạn bao nhiêu giây. */
  warnBefore: number;
  /** Chỉ theo dõi khi người dùng đang đăng nhập. */
  active: boolean;
  onExpire: () => void;
};

// S1-02. Phiên tự gia hạn khi người dùng còn thao tác; sắp hết hạn thì báo trước; hết hạn thì gọi onExpire.
// Khi tích hợp: mỗi lần gia hạn gọi API làm mới token (refresh token), thời hạn do máy chủ quyết định.
export function useIdleSession({ idleLimit, warnBefore, active, onExpire }: Options) {
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + idleLimit * 1000);
  const [now, setNow] = useState(() => Date.now());

  const secondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const warning = active && secondsLeft <= warnBefore;

  const renew = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setExpiresAt(t + idleLimit * 1000);
  }, [idleLimit]);

  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, [active]);

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  useEffect(() => {
    if (active && now >= expiresAt) onExpireRef.current();
  }, [active, now, expiresAt]);

  // Thao tác của người dùng tự gia hạn phiên, trừ khi hộp cảnh báo đang mở (lúc đó phải bấm nút).
  const warningRef = useRef(warning);
  warningRef.current = warning;
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const onActivity = () => {
      if (warningRef.current) return;
      const t = Date.now();
      if (t - last > 1000) {
        last = t;
        setExpiresAt(t + idleLimit * 1000);
      }
    };
    const events = ['keydown', 'pointerdown', 'input'] as const;
    events.forEach((ev) => document.addEventListener(ev, onActivity));
    return () => events.forEach((ev) => document.removeEventListener(ev, onActivity));
  }, [active, idleLimit]);

  return { secondsLeft, warning, renew };
}
