const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'public', 'background');
        
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file duy nhất
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'background-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Chỉ cho phép ảnh
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Route upload background
app.post('/upload-background', upload.single('background'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Lưu đường dẫn tương đối để hiển thị
    const backgroundPath = `/background/${req.file.filename}`;

    // Lưu background vào session hoặc database của user (tùy theo logic authentication của bạn)
    if (req.user) {
        req.user.backgroundImage = backgroundPath;
        // Lưu vào database nếu cần
    }

    res.json({ 
        success: true, 
        backgroundPath: backgroundPath 
    });
});

// Route reset background
app.post('/reset-background', (req, res) => {
    if (req.user) {
        req.user.backgroundImage = null;
        // Cập nhật trong database nếu cần
    }

    res.json({ success: true });
});