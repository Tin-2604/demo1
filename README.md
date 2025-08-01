# Monolithic Demo - Pickleball Tournament Management

Ứng dụng quản lý giải đấu Pickleball được xây dựng với Node.js, Express, EJS và MySQL.

## Tính năng

- Đăng ký và đăng nhập người dùng
- Quản lý thông tin vận động viên
- Upload ảnh đại diện
- Phân quyền admin/user
- Giao diện responsive

## Cài đặt local

1. Clone repository:
```bash
git clone <repository-url>
cd monolithic-demo
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình database MySQL:
- Tạo database `pickleball`
- Import file `Dump20250731.sql`
- Cập nhật thông tin kết nối trong `app.js`

4. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Deploy lên Render

### Bước 1: Chuẩn bị code
- Đảm bảo tất cả code đã được commit lên Git repository
- Kiểm tra file `package.json` có script `start`

### Bước 2: Tạo tài khoản Render
1. Truy cập [render.com](https://render.com)
2. Đăng ký tài khoản miễn phí
3. Kết nối với GitHub/GitLab repository

### Bước 3: Tạo Web Service
1. Click "New +" → "Web Service"
2. Connect repository
3. Cấu hình:
   - **Name**: `pickleball-demo`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Bước 4: Cấu hình Environment Variables
Thêm các biến môi trường:
- `DB_HOST`: Host database
- `DB_USER`: Username database  
- `DB_PASSWORD`: Password database
- `DB_NAME`: Tên database
- `SESSION_SECRET`: Secret key cho session

### Bước 5: Deploy
Click "Create Web Service" và chờ deploy hoàn tất.

## Cấu trúc dự án

```
monolithic-demo/
├── app.js              # File chính
├── package.json        # Dependencies
├── models/             # Database models
├── routes/             # API routes
├── views/              # EJS templates
├── public/             # Static files
│   ├── css/           # Stylesheets
│   ├── images/        # Images
│   └── uploads/       # Uploaded files
└── Dump20250731.sql   # Database dump
```

## Lưu ý

- Bản miễn phí Render có giới hạn 750 giờ/tháng
- Database cần được host riêng (có thể dùng PlanetScale, Railway, hoặc Render PostgreSQL)
- File uploads sẽ bị mất khi restart service (cần dùng cloud storage cho production) 