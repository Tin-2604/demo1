# Pickleball Tournament Management System

Hệ thống quản lý giải đấu Pickleball với kết nối database Railway.

## 🚀 Tính năng

- Đăng ký và quản lý vận động viên
- Phân quyền người dùng (User/Admin)
- Upload và quản lý hình ảnh
- Giao diện responsive
- Kết nối database MySQL trên Railway

## 🛠️ Cài đặt

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd demo1
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình database
File `.env` đã được cấu hình sẵn với thông tin Railway:
```env
DB_HOST=tramway.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=rPeBrVHNVzUNCmXjnPWckHoiQWwvJtrr
DB_NAME=railway
DB_PORT=37355
SESSION_SECRET=pickleball_secret_key_2024
PORT=3000
```

### Bước 4: Test kết nối database
```bash
npm run test-db
```

### Bước 5: Chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

Database đã được cấu hình với các bảng:
- `user` - Thông tin người dùng
- `event` - Thông tin sự kiện
- `registration` - Đăng ký tham gia
- `players` - Thông tin vận động viên

## 🔧 Scripts

- `npm start` - Chạy ứng dụng production
- `npm run dev` - Chạy ứng dụng development với nodemon
- `npm run test-db` - Test kết nối database

## 🌐 Truy cập

- **Local**: http://localhost:3000
- **Database**: Railway MySQL (tramway.proxy.rlwy.net:37355)

## 🔐 Bảo mật

- Session secret được cấu hình trong biến môi trường
- Password database được bảo vệ
- File `.env` không được commit vào git

## 📝 Lưu ý

- Đảm bảo thư mục `public/uploads/` có quyền ghi
- Database đã được import schema từ file `Dump20250731.sql`
- Ứng dụng hỗ trợ UTF-8 cho tiếng Việt 