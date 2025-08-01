const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');

// Cấu hình multer cho file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'pickleball_secret',
  resave: false,
  saveUninitialized: true
}));

// Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next(); // Cho phép truy cập nếu đã đăng nhập
  } else {
    res.redirect('/login'); // Chuyển hướng về trang login nếu chưa đăng nhập
  }
};

// Middleware kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'BTC') {
    next(); // Cho phép truy cập nếu là admin
  } else {
    res.status(403).send('Không có quyền truy cập'); // Từ chối truy cập nếu không phải admin
  }
};

// Kết nối MySQL - Sử dụng biến môi trường cho Render
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'pickleball',
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
});

// Test kết nối
db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

// Truyền kết nối DB cho routes
app.set('db', db);

// Route trang chủ
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Các route cần đăng nhập
app.get('/home', requireAuth, (req, res) => {
  res.render('home', { user: req.session.user });
});

app.get('/form', requireAuth, (req, res) => {
  res.render('form', { user: req.session.user });
});

app.get('/sidebar', requireAuth, (req, res) => {
  res.render('sidebar', { user: req.session.user });
});

app.get('/dstd_user', requireAuth, (req, res) => {
  res.render('dstd_user', { user: req.session.user });
});

// API route để lấy dữ liệu danh sách thi đấu
app.get('/api/tournament-data', requireAuth, (req, res) => {
  const category = req.query.category;
  const userId = req.session.user.id; // Lấy user_id từ session
  
  let query = `
    SELECT 
      r.registration_id,
      r.envent_id,
      r.leader_name,
      r.leader_phone,
      p.id as player_id,
      p.category,
      p.full_name,
      p.nick_name,
      p.phone_number,
      p.gender,
      p.date_of_birth,
      p.avatar_path
    FROM registration r
    LEFT JOIN players p ON r.registration_id = p.registration_id
    WHERE r.user_id = ?
  `;
  
  let params = [userId];
  
  if (category && category !== 'all') {
    query += ` AND p.category = ?`;
    params.push(category);
  }
  
  query += ` ORDER BY r.registration_id, p.id`;
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Lỗi query database:', err);
      return res.status(500).json({ success: false, message: 'Lỗi database' });
    }
    
    // Nhóm dữ liệu theo registration
    const groupedData = {};
    results.forEach(row => {
      if (!groupedData[row.registration_id]) {
        groupedData[row.registration_id] = {
          registration_id: row.registration_id,
          event_id: row.envent_id,
          leader_name: row.leader_name,
          leader_phone: row.leader_phone,
          players: []
        };
      }
      
      if (row.player_id) {
        groupedData[row.registration_id].players.push({
          id: row.player_id,
          category: row.category,
          full_name: row.full_name,
          nick_name: row.nick_name,
          phone_number: row.phone_number,
          gender: row.gender,
          date_of_birth: row.date_of_birth,
          avatar_path: row.avatar_path
        });
      }
    });
    
    res.json({ success: true, data: Object.values(groupedData) });
  });
});

app.get('/dstd_admin', requireAuth, requireAdmin, (req, res) => {
  res.render('dstd_admin', { user: req.session.user });
});

// API route để lấy dữ liệu danh sách thi đấu cho admin
app.get('/api/admin-tournament-data', requireAuth, requireAdmin, (req, res) => {
  const category = req.query.category;
  
  let query = `
    SELECT 
      r.registration_id,
      r.envent_id,
      r.leader_name,
      r.leader_phone,
      r.user_id,
      u.username as user_username,
      p.id as player_id,
      p.category,
      p.full_name,
      p.nick_name,
      p.phone_number,
      p.gender,
      p.date_of_birth,
      p.avatar_path
    FROM registration r
    LEFT JOIN user u ON r.user_id = u.id
    LEFT JOIN players p ON r.registration_id = p.registration_id
  `;
  
  let params = [];
  
  if (category && category !== 'all') {
    query += ` WHERE p.category = ?`;
    params.push(category);
  }
  
  query += ` ORDER BY r.registration_id, p.id`;
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Lỗi query database:', err);
      return res.status(500).json({ success: false, message: 'Lỗi database' });
    }
    
    // Nhóm dữ liệu theo registration
    const groupedData = {};
    results.forEach(row => {
      if (!groupedData[row.registration_id]) {
        groupedData[row.registration_id] = {
          registration_id: row.registration_id,
          event_id: row.envent_id,
          leader_name: row.leader_name,
          leader_phone: row.leader_phone,
          user_id: row.user_id,
          user_username: row.user_username,
          players: []
        };
      }
      
      if (row.player_id) {
        groupedData[row.registration_id].players.push({
          id: row.player_id,
          category: row.category,
          full_name: row.full_name,
          nick_name: row.nick_name,
          phone_number: row.phone_number,
          gender: row.gender,
          date_of_birth: row.date_of_birth,
          avatar_path: row.avatar_path
        });
      }
    });
    
    res.json({ success: true, data: Object.values(groupedData) });
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API test route working' });
});

// API route để thêm VĐV mới
app.post('/api/add-player', requireAuth, upload.array('avatar[]'), (req, res) => {
  console.log('API /api/add-player called');
  console.log('Request body:', req.body);
  console.log('Files:', req.files);
  
  const { fullname, phone, category, full_name, nick_name, phone_number, gender, date_of_birth } = req.body;
  const files = req.files;

  // Validation
  const errors = [];
  
  if (!fullname || fullname.trim().length < 2) {
    errors.push('Họ và tên đội trưởng phải có ít nhất 2 ký tự');
  }
  
  if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
    errors.push('Số điện thoại đội trưởng phải có 10-11 chữ số');
  }
  
  if (!category) {
    errors.push('Vui lòng chọn category');
  }

  // Validate athletes
  if (!full_name || !Array.isArray(full_name) || full_name.length === 0) {
    errors.push('Phải có ít nhất 1 vận động viên');
  } else {
    full_name.forEach((name, index) => {
      if (!name || name.trim().length < 2) {
        errors.push(`Vận động viên ${index + 1}: Họ và tên phải có ít nhất 2 ký tự`);
      }
    });
  }

  if (!phone_number || !Array.isArray(phone_number) || phone_number.length === 0) {
    errors.push('Phải có ít nhất 1 vận động viên');
  } else {
    phone_number.forEach((phone, index) => {
      if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
        errors.push(`Vận động viên ${index + 1}: Số điện thoại phải có 10-11 chữ số`);
      }
    });
  }

  // Validate images
  if (!files || files.length === 0) {
    errors.push('Phải có ít nhất 1 hình ảnh vận động viên');
  } else {
    files.forEach((file, index) => {
      if (!file.mimetype.startsWith('image/')) {
        errors.push(`Vận động viên ${index + 1}: File phải là hình ảnh`);
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Vận động viên ${index + 1}: File quá lớn (tối đa 5MB)`);
      }
    });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Lỗi validation', errors });
  }

  // Create new registration
  const userId = req.session.user.id; // Lấy user_id từ session
  db.query(
    `INSERT INTO registration (envent_id, leader_name, leader_phone, user_id) VALUES (?, ?, ?, ?)`,
    [1, fullname, phone, userId],
    (err, result) => {
      if (err) {
        console.error('Lỗi tạo registration:', err);
        return res.status(500).json({ success: false, message: 'Lỗi database: ' + err.message });
      }
      
      const registration_id = result.insertId;
      
      // Insert players
      const playerPromises = full_name.map((name, index) => {
        return new Promise((resolve, reject) => {
          const nick = nick_name && nick_name[index] ? nick_name[index] : null;
          const phoneNum = phone_number[index];
          const genderVal = gender && gender[index] ? gender[index] : null;
          const birthdate = date_of_birth && date_of_birth[index] ? date_of_birth[index] : null;
          const avatarPath = files[index] ? files[index].filename : null;
          
          db.query(
            `INSERT INTO players (registration_id, category, full_name, nick_name, phone_number, gender, date_of_birth, avatar_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [registration_id, category, name, nick, phoneNum, genderVal, birthdate, avatarPath],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      });
      
      Promise.all(playerPromises)
        .then(() => {
          res.json({ success: true, message: 'Thêm VĐV thành công', registration_id });
        })
        .catch(err => {
          console.error('Lỗi thêm VĐV:', err);
          res.status(500).json({ success: false, message: 'Lỗi database: ' + err.message });
        });
    }
  );
});

// API route để cập nhật VĐV
app.post('/api/update-player', requireAuth, upload.array('avatar[]'), (req, res) => {
  console.log('API /api/update-player called');
  console.log('Request body:', req.body);
  console.log('Files:', req.files);
  console.log('Session user:', req.session.user);
  
  const { fullname, phone, category, full_name, nick_name, phone_number, gender, date_of_birth, teamId } = req.body;
  const files = req.files;

  // Validation
  const errors = [];
  
  if (!fullname || fullname.trim().length < 2) {
    errors.push('Họ và tên đội trưởng phải có ít nhất 2 ký tự');
  }
  
  if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
    errors.push('Số điện thoại đội trưởng phải có 10-11 chữ số');
  }
  
  if (!category) {
    errors.push('Vui lòng chọn category');
  }

  if (!teamId) {
    errors.push('Thiếu thông tin team ID');
  }

  // Validate athletes
  if (!full_name || !Array.isArray(full_name) || full_name.length === 0) {
    errors.push('Phải có ít nhất 1 vận động viên');
  } else {
    full_name.forEach((name, index) => {
      if (!name || name.trim().length < 2) {
        errors.push(`Vận động viên ${index + 1}: Họ và tên phải có ít nhất 2 ký tự`);
      }
    });
  }

  if (!phone_number || !Array.isArray(phone_number) || phone_number.length === 0) {
    errors.push('Phải có ít nhất 1 vận động viên');
  } else {
    phone_number.forEach((phone, index) => {
      if (!phone || !/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
        errors.push(`Vận động viên ${index + 1}: Số điện thoại phải có 10-11 chữ số`);
      }
    });
  }

  // Validate images (optional for update)
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      if (!file.mimetype.startsWith('image/')) {
        errors.push(`Vận động viên ${index + 1}: File phải là hình ảnh`);
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Vận động viên ${index + 1}: File quá lớn (tối đa 5MB)`);
      }
    });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Lỗi validation', errors });
  }

  // Update registration - allow admin to update any registration
  const userId = req.session.user.id;
  const isAdmin = req.session.user.role === 'BTC';
  
  let updateQuery, updateParams;
  if (isAdmin) {
    updateQuery = `UPDATE registration SET leader_name = ?, leader_phone = ? WHERE registration_id = ?`;
    updateParams = [fullname, phone, teamId];
  } else {
    updateQuery = `UPDATE registration SET leader_name = ?, leader_phone = ? WHERE registration_id = ? AND user_id = ?`;
    updateParams = [fullname, phone, teamId, userId];
  }
  
  db.query(updateQuery, updateParams,
    (err, result) => {
      if (err) {
        console.error('Lỗi cập nhật registration:', err);
        return res.status(500).json({ success: false, message: 'Lỗi database: ' + err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin để cập nhật' });
      }
      
      // Delete existing players for this registration
      db.query(
        `DELETE FROM players WHERE registration_id = ?`,
        [teamId],
        (err, result) => {
          if (err) {
            console.error('Lỗi xóa players cũ:', err);
            return res.status(500).json({ success: false, message: 'Lỗi database: ' + err.message });
          }
          
          // Insert updated players
          const playerPromises = full_name.map((name, index) => {
            return new Promise((resolve, reject) => {
              const nick = nick_name && nick_name[index] ? nick_name[index] : null;
              const phoneNum = phone_number[index];
              const genderVal = gender && gender[index] ? gender[index] : null;
              const birthdate = date_of_birth && date_of_birth[index] ? date_of_birth[index] : null;
              const avatarPath = files && files[index] ? files[index].filename : null;
              
              db.query(
                `INSERT INTO players (registration_id, category, full_name, nick_name, phone_number, gender, date_of_birth, avatar_path)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [teamId, category, name, nick, phoneNum, genderVal, birthdate, avatarPath],
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                }
              );
            });
          });
          
          Promise.all(playerPromises)
            .then(() => {
              res.json({ success: true, message: 'Cập nhật VĐV thành công', registration_id: teamId });
            })
            .catch(err => {
              console.error('Lỗi cập nhật VĐV:', err);
              res.status(500).json({ success: false, message: 'Lỗi database: ' + err.message });
            });
        }
      );
    }
  );
});

// Route đăng xuất
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
    res.redirect('/login');
  });
});

const authRoutes = require('./routes/auth')(db);
app.use('/', authRoutes);

// Tournament routes
const tournamentRoutes = require('./routes/tournament');
app.use('/tournament', tournamentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
});

// Cấu hình port cho Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});