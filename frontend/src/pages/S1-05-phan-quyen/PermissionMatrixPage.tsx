import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { ADMIN_ROLE, MODULES, ROLES, type Permission } from '../../data/permissions';
import { AppShell } from '../S1-06-layout-menu/AppShell';
import './permissions.css';

const OPTIONS: Permission[] = ['F', 'W', 'W*', 'R', 'R*', '–'];
const cls = (p: Permission) => 'p' + (p === '–' ? 'N' : p[0]);
const initial = () => MODULES.map((m) => [...m.perms]);

// S1-05. Khai báo quyền của từng vai trò trên từng module.
// Đây chỉ là giao diện: quyền thật phải được kiểm ở máy chủ, mặc định là từ chối.
export function PermissionMatrixPage() {
  const toast = useToast();
  const [saved, setSaved] = useState<Permission[][]>(initial);
  const [current, setCurrent] = useState<Permission[][]>(initial);
  const dirty = JSON.stringify(saved) !== JSON.stringify(current);

  function change(row: number, col: number, value: Permission) {
    setCurrent((prev) => prev.map((r, j) => (j === row ? r.map((v, i) => (i === col ? value : v)) : r)));
  }

  return (
    <AppShell roleIndex={ADMIN_ROLE} user="Trần Quốc Bảo" active="Người dùng & nhật ký" crumb="Người dùng & nhật ký  /  Phân quyền">
      <div className="h">
        <div>
          <h2>Ma trận phân quyền</h2>
        </div>
        <button className="btn" disabled={!dirty} onClick={() => setCurrent(saved.map((r) => [...r]))}>
          Huỷ thay đổi
        </button>
        <button
          className="btn primary"
          disabled={!dirty}
          onClick={() => {
            // Khi tích hợp: PUT /admin/permissions
            setSaved(current.map((r) => [...r]));
            toast('Đã lưu phân quyền', 'Thay đổi có hiệu lực ở thao tác kế tiếp của người dùng.');
          }}
        >
          Lưu phân quyền
        </button>
      </div>
      <p className="pm-legend">
        <span>
          <span className="pill pF">F</span> Toàn quyền
        </span>
        <span>
          <span className="pill pW">W</span> Ghi trong phạm vi được giao
        </span>
        <span>
          <span className="pill pR">R</span> Chỉ xem
        </span>
        <span>
          <span className="pill pN">–</span> Không truy cập
        </span>
      </p>
      <div className="panel scroll">
        <table className="pm-table">
          <thead>
            <tr>
              <th>Module</th>
              {ROLES.map((r) => (
                <th key={r}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m, j) => (
              <tr key={m.name}>
                <td>
                  <span>
                    <Icon name={m.icon} />
                    {m.name}
                  </span>
                </td>
                {current[j].map((v, i) => (
                  <td key={i}>
                    <select
                      className={cls(v)}
                      value={v}
                      aria-label={`${m.name}, ${ROLES[i]}`}
                      onChange={(e) => change(j, i, e.target.value as Permission)}
                    >
                      {OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </td>
                ))}
                <td>
                  <span className="pill pF" title="Không đổi được">
                    F <Icon name="lock" size={12} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint" style={{ marginTop: 12, fontSize: 13 }}>
        * Chỉ trên dữ liệu của chính mình hoặc của lớp mình phụ trách. Mọi chức năng đều kiểm quyền ở tầng server, mặc định là từ
        chối. Cột Quản trị hệ thống bị khoá ở toàn quyền.
      </p>
    </AppShell>
  );
}
