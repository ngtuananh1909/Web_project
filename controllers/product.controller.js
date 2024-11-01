const db = require('../connect/database');
const { ProductIDGenerator } = require('../event_function/function');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const openai = require('openai');
const sharp = require('sharp');
const { Mutex } = require('async-mutex');
const mutex = new Mutex();

openai.apiKey = process.env.OPENAI_API_KEY; 
async function loadModel() {
    const yolo = await import('tfjs-yolo-tiny'); 
    const model = await yolo.downloadModel();
    return model;
}

let yoloModel;
loadModel().then(model => {
    yoloModel = model;
    console.log("Model loaded successfully");
}).catch(err => {
    console.error("Error loading YOLO model:", err);
});

async function detectObjectsYOLO(imagePath) {
    const sharpImage = await sharp(imagePath).resize(416, 416).toBuffer();
    const boxes = await yoloModel(sharpImage);
    const keywords = boxes.map(box => box.className);
    return keywords;
}

exports.CreateProduct = async (req, res) => {
    const { name, description, price, quantity, creator, sale, saleval } = req.body;
    const userID = req.session.user.id;
    const imageFile = req.files.image;
    const productId = ProductIDGenerator(); 
    const uploadPath = path.join(__dirname, '../public/uploads', `${productId}_${Date.now()}_${imageFile.name}`);
    
    try {
        await mutex.runExclusive(async () => {
            await new Promise((resolve, reject) => {
                imageFile.mv(uploadPath, err => {
                    if (err) reject(new Error('Error uploading image'));
                    resolve();
                });
            });
        });

        const keywords = await detectObjectsYOLO(uploadPath);
        const descriptionAiResponse = await openai.Completion.create({
            model: "text-davinci-003",
            prompt: `Viết mô tả sản phẩm dựa trên hình ảnh với từ khóa: ${keywords.join(', ')}.`,
            max_tokens: 150,
        });

        const newProduct = {
            id: productId,
            name,
            description,
            description_ai: descriptionAiResponse.choices[0].text.trim(),
            price,
            quantity,
            image: imageFile.name,
            creator,
            creator_id: userID,
            sale: sale === "true",
            saleval: parseFloat(saleval),
            sold: 0,
            created_at: new Date(),
        };

        const sql = 'INSERT INTO products SET ?';
        db.query(sql, newProduct, err => {
            if (err) return res.status(500).send('Error creating product');
            res.redirect(req.get("Referrer") || "/");
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
};
exports.AddProductDisplay = (req, res) => {
    const message = req.query.message || null;
    res.render('add_product', { user: req.session.user, message });
};

exports.DisplayProductDetails = async (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    const ratingsSql = 'SELECT * FROM reviews WHERE product_id = ?';

    try {
        const [productRows] = await db.promise().query(sql, [productId]);

        if (productRows.length === 0) {
            return res.render('home', {
                message: 'Product not found'
            });
        }

        const product = productRows[0];

        const [ratings] = await db.promise().query(ratingsSql, [productId]);

        const listSql = 'SELECT * FROM products WHERE id != ?';
        const [otherProducts] = await db.promise().query(listSql, [productId]);

        const user = req.session.user || null; 

        res.render('product-details', { 
            user, 
            product, 
            ratings,
            products: otherProducts 
        });
    } catch (err) {
        console.error('Error fetching product details:', err);
        return res.render('home', {
            message: 'Error fetching product details'
        });
    }
};



exports.PasswordVerify = async (req, res) => {
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        const userId = req.session.user.id;

        db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const hashedPassword = results[0].password;
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
                return res.json({ success: true, message: 'Password verified' });
            } else {
                return res.json({ success: false, message: 'Incorrect password' });
            }
        });
    } catch (error) {
        console.error('Error verifying password:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.SubmitReview = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để đánh giá sản phẩm.' });
    }

    const productId = req.body.productId;
    const userId = req.session.user.id;

    const rating = req.body.rating;
    const comment = req.body.comment;

    const sql = 'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [productId, userId, rating, comment], (err, result) => {
        if (err) {
            console.error('Error submitting review:', err);
            res.redirect(`/product/${productId}`);
        }

        res.redirect(`/product/${productId}`);
    });
};

