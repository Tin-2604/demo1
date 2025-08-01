const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Hiển thị form đăng ký
  router.get('/register', (req, res) => {
    res.render('register', { error: null });
  });

  // Xử lý đăng ký (không OTP)
  router.post('/register', (req, res) => {
    console.log('Received data:', req.body); // Debug log
    const { phone_number, username, password, confirm_password } = req.body;
    if (!phone_number || !username || !password) {
      console.log('Missing data:', { phone_number, username, password }); // Debug log
      return res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    
    // Kiểm tra mật khẩu nhập lại (thêm bảo mật ở backend)
    if (password !== confirm_password) {
      return res.json({ success: false, message: 'Mật khẩu nhập lại không khớp!' });
    }
    db.query(
      'SELECT * FROM user WHERE phone_number = ?',
      [phone_number],
      (err, results) => {
        if (err) return res.json({ success: false, message: 'Lỗi hệ thống!' });
        if (results.length > 0) {
          return res.json({ success: false, message: 'Số điện thoại đã tồn tại!' });
        }
        db.query(
          'INSERT INTO user (phone_number, username, password) VALUES (?, ?, ?)',
          [phone_number, username, password],
          (err2) => {
            if (err2) return res.json({ success: false, message: 'Lỗi khi lưu dữ liệu!' });
            res.json({ success: true, message: 'Đăng ký thành công! Bạn có thể đăng nhập.' });
          }
        );
      }
    );
  });

  // Hiển thị form đăng nhập
  router.get('/login', (req, res) => {
    res.render('login', { error: null });
  });

  // Xử lý đăng nhập
  router.post('/login', (req, res) => {
    try {
      console.log('Login data:', req.body); // Debug log
      const { phone_number, password } = req.body;
      
      if (!phone_number || !password) {
        return res.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
      }
      
      db.query(
        'SELECT * FROM user WHERE phone_number = ? AND password = ?',
        [phone_number, password],
        (err, results) => {
          if (err) {
            console.log('Database error:', err); // Debug log
            return res.json({ success: false, message: 'Lỗi hệ thống!' });
          }
          
          if (results.length === 0) {
            return res.json({ success: false, message: 'Sai số điện thoại hoặc mật khẩu!' });
          }
          
          // Lưu thông tin user vào session
          req.session.user = {
            id: results[0].id,
            username: results[0].username,
            phone_number: results[0].phone_number,
            role: results[0].role || 'user'
          };
          
          console.log('Login successful for user:', results[0].username);
          res.json({ success: true, message: 'Đăng nhập thành công!' });
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      res.json({ success: false, message: 'Có lỗi xảy ra!' });
    }
  });

  return router;
}; 