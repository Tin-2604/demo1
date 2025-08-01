# Hướng dẫn kết nối với Railway Database

## Bước 1: Cài đặt dependencies
```bash
npm install
```

## Bước 2: Cấu hình biến môi trường

### Tạo file .env
Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
# Database Configuration for Railway
DB_HOST=your_railway_host
DB_USER=your_railway_username
DB_PASSWORD=your_railway_password
DB_NAME=your_railway_database_name
DB_PORT=3306

# Session Secret
SESSION_SECRET=pickleball_secret_key_2024

# Server Port
PORT=3000
```

### Lấy thông tin kết nối từ Railway

1. Đăng nhập vào Railway Dashboard
2. Chọn project chứa database MySQL
3. Vào tab "Variables" 
4. Copy các giá trị sau:
   - `DB_HOST`: Host của database
   - `DB_USER`: Username
   - `DB_PASSWORD`: Password
   - `DB_NAME`: Tên database
   - `DB_PORT`: Port (thường là 3306)

## Bước 3: Import database schema

Nếu bạn chưa có database schema, sử dụng file `Dump20250731.sql` để import:

```bash
mysql -h your_railway_host -u your_railway_username -p your_railway_database_name < Dump20250731.sql
```

Hoặc sử dụng MySQL Workbench để import file SQL.

## Bước 4: Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Bước 5: Kiểm tra kết nối

Truy cập `http://localhost:3000` để kiểm tra ứng dụng.

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra thông tin kết nối trong file `.env`
- Đảm bảo database đã được tạo trên Railway
- Kiểm tra firewall và network access

### Lỗi import database
- Đảm bảo file SQL có encoding UTF-8
- Kiểm tra quyền truy cập database
- Thử import từng phần nếu file quá lớn

## Lưu ý bảo mật

- Không commit file `.env` vào git
- Sử dụng session secret mạnh
- Cập nhật password database thường xuyên 