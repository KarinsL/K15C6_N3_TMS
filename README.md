# HỆ THỐNG QUẢN LÝ ĐÀO TẠO (TRAINING MANAGEMENT SYSTEM - TMS)

## 📌 1. Giới thiệu Dự án
Hệ thống Quản lý Đào tạo (TMS) là giải pháp quản lý nội bộ tập trung trên nền web nhằm hỗ trợ đội vận hành (Quản lý đào tạo, Giảng viên, Tư vấn tuyển sinh, Kế toán) theo dõi trọn vòng đời học viên từ giai đoạn Lead đến khi Tốt nghiệp trên một nguồn dữ liệu duy nhất.

## 🎯 2. Tầm nhìn & Mục tiêu
- **Tầm nhìn:** Thay thế việc vận hành thủ công trên Google Sheets, Zalo, Google Calendar bằng hệ thống thời gian thực, chủ động cảnh báo rủi ro (vắng học, nợ bài, công nợ học phí).
- **Mục tiêu 8 tuần:** 
  - Vận hành 1 lớp pilot chạy đủ chu trình (Ghi danh → Xếp lịch → Điểm danh → Chấm bài → Bảng điểm).
  - Điểm danh ≤ 60 giây/buổi; Chấm bài ≤ 3 phút/bài.
  - Công nợ học phí khớp 100% với kế toán.

## 👥 3. Các Vai trò Nghiệp vụ (8 Roles)
1. Guest (Khách)
2. Student (Học viên)
3. Instructor (Giảng viên)
4. TA (Trợ giảng)
5. Training Manager (Quản lý đào tạo)
6. Admissions (Tư vấn tuyển sinh)
7. Accountant (Kế toán)
8. Admin (Quản trị hệ thống)

## 🛠 4. Công nghệ Sử dụng (Tech Stack)
- **Frontend:** React + TypeScript
- **Backend:** NestJS 11 (Node.js 22, TypeScript), TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT (Access Token + Refresh Token)
- **CI/CD & Tools:** GitHub, Jira, Docker, Slack

## 🚀 Chạy dự án

### Cấu trúc thư mục
```
.
├── backend/            # NestJS API
│   └── src/database/migrations/   # TypeORM migrations
├── frontend/           # React + TypeScript (Vite)
├── docker-compose.yml  # PostgreSQL + backend + frontend
└── .github/workflows/  # CI build & test
```

### Chạy toàn bộ bằng Docker
```bash
cp .env.example .env
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/v1/health

### Chạy từng phần khi dev
```bash
# 1. Database
docker compose up -d db

# 2. Backend (cần Node 22), chạy ở http://localhost:8080
cd backend && npm install && npm run start:dev

# 3. Frontend (cần Node 22), mở http://localhost:5173
cd frontend && npm install && npm run dev
```
Vite tự chuyển các request `/api` sang backend ở cổng 8080. Backend tự chạy migration khi khởi động.

### Migration database
```bash
cd backend
npm run migration:generate -- src/database/migrations/TenMigration   # sinh từ entity
npm run migration:run                                                # áp dụng
npm run migration:revert                                             # hoàn tác migration cuối
```

### Kiểm tra trước khi tạo PR
```bash
cd backend && npm run lint:check && npm run build && npm test && npm run test:e2e
cd frontend && npm run lint && npm run build
```

## 🌳 5. Quy tắc Git Flow & Quy chuẩn Cộng tác
- `main`: Nhánh sản phẩm ổn định (Production).
- `develop`: Nhánh tích hợp code chính của các thành viên.
- `feature/<ID-Story>-<ten-tinh-nang>`: Nhánh làm tính năng cá nhân (Ví dụ: `feature/S1-01-login-api`).
- **Quy tắc Commit:** `feat(S1-01): implement login API` hoặc `fix(S1-02): resolve session timeout`.
- **Pull Request (PR):** Phải có ít nhất 1 thành viên review và phê duyệt trước khi merge vào `develop`.

## 👨‍💻 6. Thành viên Nhóm
- PO: Dư Thanh Hoàng
- Leader / Scrum Master: Nguyễn Phạm Phương Lan (kiêm Developer)
- Developers: Nguyễn Duy Kiên, Nguyễn Trung Kiên, Nguyễn Hữu Lợi, Nông Hùng Nguyên, Nguyễn Minh Ngọc, Nguyễn Thanh Ngọc, Vũ Trọng Nghĩa, Nguyễn Tất Phi
