import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { ROLES, menuFor } from '../../data/permissions';

type Props = {
  /** Vị trí vai trò trong ROLES. Khi tích hợp, lấy từ thông tin người dùng trong JWT. */
  roleIndex: number;
  user: string;
  /** Tên mục menu đang mở. */
  active: string;
  crumb?: string;
  onLogout?: () => void;
  children: ReactNode;
};

// S1-06. Layout chung: sidebar theo quyền, thanh trên hiện tên và vai trò, menu ngăn trượt khi màn hình hẹp.
export function AppShell({ roleIndex, user, active, crumb, onLogout, children }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const role = ROLES[roleIndex];

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <div className={'app' + (open ? ' open' : '')}>
      <aside className="side" onClick={(e) => e.stopPropagation()}>
        <div className="logo">
          <span>
            <Icon name="cap" />
          </span>
          TMS.
        </div>
        <div className="me">
          <div className="ava" />
          <div>
            <b>{user}</b>
            <span>{role}</span>
          </div>
        </div>
        <nav className="nav" aria-label="Menu chính">
          {menuFor(roleIndex).map((m) =>
            m.to ? (
              <Link key={m.name} to={m.to} className={m.name === active ? 'on' : undefined} onClick={() => setOpen(false)}>
                <Icon name={m.icon} />
                {m.name}
              </Link>
            ) : (
              // Màn hình của module này chưa làm (thuộc các sprint sau).
              <a
                key={m.name}
                href="#"
                className={m.name === active ? 'on' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
              >
                <Icon name={m.icon} />
                {m.name}
              </a>
            ),
          )}
        </nav>
        <button className="out" onClick={onLogout ?? (() => navigate('/dang-nhap'))}>
          <Icon name="out" />
          Đăng xuất
        </button>
      </aside>
      <div className="main">
        <header className="top">
          <button
            className="burger"
            aria-label="Mở menu"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            <Icon name="menu" />
          </button>
          <div className="crumb">{crumb ?? active}</div>
          <Icon name="bell" />
          <div className="who">
            <b>{user}</b>
            <span>{role}</span>
          </div>
          <div className="ava" />
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
