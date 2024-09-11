// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { id_product } = req.body;
        const dir = `uploads/${id_product}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;