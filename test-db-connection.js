require('dotenv').config();
const mysql = require('mysql2');

// Cấu hình kết nối database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'pickleball',
  charset: 'utf8mb4'
};

console.log('Testing database connection...');
console.log('Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Tạo kết nối
const connection = mysql.createConnection(dbConfig);

// Test kết nối
connection.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    console.error('Vui lòng kiểm tra:');
    console.error('1. Thông tin kết nối trong file .env');
    console.error('2. Database đã được tạo trên Railway');
    console.error('3. Network access và firewall');
    process.exit(1);
  } else {
    console.log('✅ Kết nối database thành công!');
    
    // Test query đơn giản
    connection.query('SELECT 1 as test', (err, results) => {
      if (err) {
        console.error('❌ Lỗi query test:', err.message);
      } else {
        console.log('✅ Query test thành công:', results[0]);
      }
      
      // Kiểm tra các bảng trong database
      connection.query('SHOW TABLES', (err, tables) => {
        if (err) {
          console.error('❌ Lỗi khi lấy danh sách bảng:', err.message);
        } else {
          console.log('📋 Các bảng trong database:');
          tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
          });
        }
        
        connection.end();
        console.log('🔚 Đã đóng kết nối database');
      });
    });
  }
}); 