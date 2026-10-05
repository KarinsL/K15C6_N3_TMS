# TMS Frontend · Sprint 1

Giao diện React + TypeScript cho 10 story của Sprint 1. Dữ liệu đang là dữ liệu giả chạy trên trình duyệt, chưa nối backend.

## Chạy dự án

```bash
npm install
npm run dev      # mở http://localhost:5173/s1 để xem mục lục story
npm run build    # kiểm tra kiểu TypeScript rồi đóng gói
```

## Mỗi story một thư mục

| Story | Thư mục trong `src/pages` | Đường dẫn | Tệp chính |
|---|---|---|---|
| S1-01 | `S1-01-dang-nhap` | `/dang-nhap` | `LoginPage.tsx`, `mockAuth.ts`, `login.css` |
| S1-02 | `S1-02-phien-dang-nhap` | `/phien` | `useIdleSession.ts`, `SessionWarningDialog.tsx`, `SessionDemoPage.tsx` |
| S1-03 | `S1-03-quen-mat-khau` | `/quen-mat-khau` | `ForgotPasswordPage.tsx` |
| S1-04 | `S1-04-doi-mat-khau` | `/doi-mat-khau` | `ChangePasswordPage.tsx` |
| S1-05 | `S1-05-phan-quyen` | `/quan-tri/phan-quyen` | `PermissionMatrixPage.tsx` |
| S1-06 | `S1-06-layout-menu` | `/` | `AppShell.tsx`, `HomePage.tsx` |
| S1-07 | `S1-07-trang-loi` | `/loi/403`, `/loi/404`, `/loi/500` | `ErrorPage.tsx` |
| S1-08 | `S1-08-tai-khoan` | `/quan-tri/tai-khoan` | `UserListPage.tsx`, `UserFormDrawer.tsx`, `mockUsers.ts` |
| S1-09 | `S1-09-gan-vai-tro` | `/quan-tri/tai-khoan?mo=sua` | `RoleChips.tsx` |
| S1-10 | `S1-10-khoa-tai-khoan` | `/quan-tri/tai-khoan?mo=khoa` | `LockAccountDialog.tsx` |

S1-09 và S1-10 là thành phần con của trang S1-08 nên không có trang riêng.

## Thư mục dùng chung

- `src/components`: `Icon`, `PasswordField`, `PasswordRules`, `CardPage`, `Toast`
- `src/data/permissions.ts`: 7 vai trò có đăng nhập, 12 module và ma trận quyền ban đầu
- `src/styles`: `base.css` (màu, nút, ô nhập), `card.css` (trang dạng thẻ), `app.css` (layout ứng dụng)

## Chỗ cần thay khi nối backend

Tìm chữ "Khi tích hợp" trong mã nguồn. Các điểm chính:

- `S1-01-dang-nhap/mockAuth.ts`: thay `login()` bằng API đăng nhập trả JWT (access token + refresh token); việc đếm lần sai và khoá tạm làm ở máy chủ.
- `S1-02-phien-dang-nhap/useIdleSession.ts`: gọi API làm mới token khi gia hạn; thời hạn phiên lấy từ máy chủ. Bản thử dùng 60 giây, đổi nhanh bằng `/phien?idle=20&warn=10`.
- `S1-03`, `S1-04`: token đặt lại mật khẩu và việc kiểm tra mật khẩu hiện tại đang giả lập trong trang.
- `S1-05`: lưu ma trận quyền bằng API; quyền thật phải kiểm ở máy chủ.
- `S1-08-tai-khoan/mockUsers.ts`: 300 tài khoản giả; thay bằng API có tìm kiếm, lọc, phân trang.
- `AppShell`: vai trò và tên người dùng đang truyền cứng, cần lấy từ thông tin đăng nhập.

Mật khẩu mẫu ở S1-01 và S1-04: `Tms@2026`.
