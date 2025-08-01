const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Cấu hình lưu file
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

// Validation functions
function validateName(name) {
  if (!name || name.trim().length < 2) {
    return 'Họ và tên phải có ít nhất 2 ký tự';
  }
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) {
    return 'Họ và tên chỉ được chứa chữ cái';
  }
  return null;
}

function validatePhone(phone) {
  if (!phone) {
    return 'Số điện thoại là bắt buộc';
  }
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Số điện thoại phải có 10-11 chữ số';
  }
  return null;
}

function validateDateOfBirth(date, category) {
  if (!date) {
    if (category === '5.5-tren-45' || category === '5.5-duoi-45') {
      return 'Ngày sinh là bắt buộc cho nội dung này';
    }
    return null;
  }

  const selectedDate = new Date(date);
  const today = new Date();
  
  // Không cho phép chọn ngày hiện tại hoặc tương lai
  if (selectedDate >= today) {
    return 'Ngày sinh phải là ngày trong quá khứ';
  }

  if (category === '5.5-tren-45') {
    const cutoffDate = new Date('1979-01-01');
    if (selectedDate >= cutoffDate) {
      return 'Phải sinh trước năm 1979 để đăng ký nội dung 5.5 trên 45 tuổi';
    }
  }

  if (category === '5.5-duoi-45') {
    const cutoffDate = new Date('1979-01-01');
    if (selectedDate < cutoffDate) {
      return 'Phải sinh từ năm 1979 trở lại để đăng ký nội dung 5.5 dưới 45 tuổi';
    }
  }

  return null;
}

function validateGender(gender, category) {
  if (category === 'doi-nu-4.5' && gender !== 'nu') {
    return 'Giới tính phải là Nữ cho nội dung đôi nữ 4.5';
  }
  return null;
}

function validateImage(file) {
  if (!file || file.size === 0) {
    return 'Hình ảnh là bắt buộc';
  }
  
  // Validate file type
  if (!file.mimetype.startsWith('image/')) {
    return 'Vui lòng chọn file hình ảnh';
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'File quá lớn. Vui lòng chọn file nhỏ hơn 5MB';
  }
  
  return null;
}

// Mapping category từ form sang event_id
function getEventId(category) {
  const categoryMap = {
    '7.5-tu-do': 1,
    '6.5-tu-do': 2,
    '5.5-tren-45': 3,
    '5.5-duoi-45': 4,
    '4.5-tu-do': 5,
    'doi-nu-4.5': 6
  };
  return categoryMap[category] || 1;
}

// Mapping gender từ form sang database enum
function mapGender(gender) {
  if (!gender) return null;
  
  if (gender === 'nam') return 'Nam';
  if (gender === 'nu') return 'Nu';
  
  console.log('Gender mapping failed:', { input: gender });
  return null;
}

// Route xử lý đăng ký giải đấu
router.post('/register', upload.array('avatar[]'), (req, res) => {
  const db = req.app.get('db');
  
  console.log('Full request body:', req.body);
  console.log('Files:', req.files);

  const { fullname, phone, category } = req.body;
  
  // Server-side validation
  const errors = [];

  // Validate team leader
  const fullnameError = validateName(fullname);
  if (fullnameError) {
    errors.push('Thông tin đội trưởng: ' + fullnameError);
  }

  const phoneError = validatePhone(phone);
  if (phoneError) {
    errors.push('Thông tin đội trưởng: ' + phoneError);
  }

  // Validate category selection
  if (!category) {
    errors.push('Vui lòng chọn nội dung giải đấu');
  }

  const event_id = getEventId(category);

  // Lấy dữ liệu vận động viên
  let full_names = req.body['full_name'] || [];
  let nick_names = req.body['nick_name'] || [];
  let phone_numbers = req.body['phone_number'] || [];
  let birthdates = req.body['date_of_birth'] || [];
  const files = req.files;

  // Đảm bảo dữ liệu là mảng
  if (!Array.isArray(full_names)) {
    full_names = full_names ? [full_names] : [];
  }
  if (!Array.isArray(nick_names)) {
    nick_names = nick_names ? [nick_names] : [];
  }
  if (!Array.isArray(phone_numbers)) {
    phone_numbers = phone_numbers ? [phone_numbers] : [];
  }
  if (!Array.isArray(birthdates)) {
    birthdates = birthdates ? [birthdates] : [];
  }

  // Xử lý gender data
  const genders = req.body['gender'] || [];

  const n = full_names.length;

  // Validate minimum athletes
  if (n < 1) {
    errors.push('Phải có ít nhất 1 vận động viên');
  }

  // Validate each athlete
  for (let i = 0; i < n; i++) {
    const athleteNumber = i + 1;
    
    // Validate athlete name
    const athleteNameError = validateName(full_names[i]);
    if (athleteNameError) {
      errors.push(`Vận động viên ${athleteNumber}: ${athleteNameError}`);
    }

    // Validate athlete phone
    const athletePhoneError = validatePhone(phone_numbers[i]);
    if (athletePhoneError) {
      errors.push(`Vận động viên ${athleteNumber}: ${athletePhoneError}`);
    }

    // Validate date of birth
    const birthdateError = validateDateOfBirth(birthdates[i], category);
    if (birthdateError) {
      errors.push(`Vận động viên ${athleteNumber}: ${birthdateError}`);
    }

    // Validate gender
    if (category === 'doi-nu-4.5') {
      const genderError = validateGender(genders[i], category);
      if (genderError) {
        errors.push(`Vận động viên ${athleteNumber}: ${genderError}`);
      }
    }

    // Validate image
    const imageError = validateImage(files[i]);
    if (imageError) {
      errors.push(`Vận động viên ${athleteNumber}: ${imageError}`);
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    // Always return JSON for AJAX requests
    if (req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers['content-type']?.includes('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Lỗi đăng ký',
        errors: errors
      });
    } else {
      return res.status(400).send(errors.join('\n'));
    }
  }

  console.log('Debug info:', {
    full_names,
    phone_numbers,
    genders,
    birthdates,
    files: files ? files.length : 0,
    n,
    event_id
  });

  // Tạo registration record
  const userId = req.session.user.id; // Lấy user_id từ session
  db.query(
    `INSERT INTO registration (leader_name, leader_phone, envent_id, user_id) 
     VALUES (?, ?, ?, ?)`,
    [fullname, phone, event_id, userId],
    (err, result) => {
              if (err) {
          console.error('Lỗi tạo registration:', err);
          if (req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers['content-type']?.includes('multipart/form-data')) {
            return res.status(500).json({
              success: false,
              message: 'Lỗi tạo đăng ký: ' + err.message
            });
          } else {
            return res.status(500).send('Lỗi tạo đăng ký: ' + err.message);
          }
        }

      const registration_id = result.insertId;
      console.log('Registration ID:', registration_id);

      // Lưu từng vận động viên
      let error = null;
      let done = 0;
      for (let i = 0; i < n; i++) {
        db.query(
          `INSERT INTO players (registration_id, category, full_name, nick_name, phone_number, gender, date_of_birth, avatar_path)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            registration_id,
            category,
            full_names[i],
            nick_names[i] || null,
            phone_numbers[i],
            mapGender(genders[i]),
            birthdates[i] || null,
            files[i].filename
          ],
          (err) => {
            done++;
            if (err) {
              console.error('Gender debug:', {
                original: genders[i],
                mapped: mapGender(genders[i]),
                error: err.message
              });
              error = 'Lỗi lưu DB: ' + err.message;
            }
            if (done === n) {
              if (error) {
                if (req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers['content-type']?.includes('multipart/form-data')) {
                  return res.status(500).json({
                    success: false,
                    message: error
                  });
                } else {
                  return res.status(500).send(error);
                }
              }
              // Check if it's an AJAX request
              if (req.xhr || req.headers.accept.indexOf('json') > -1 || req.headers['content-type']?.includes('multipart/form-data')) {
                return res.json({
                  success: true,
                  message: 'Đăng ký thành công'
                });
              } else {
                return res.redirect('/form?success=1');
              }
            }
          }
        );
      }
    }
  );
});

module.exports = router;
