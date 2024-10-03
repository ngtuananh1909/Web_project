const db = require('../connect/database');
const { ProductIDGenerator } = require('../event_function/function');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

exports.CreateProduct = async (req, res) => {
    if (!req.session.user) {
        return res.render('add_product', {
            message: 'You have to login/register to Create Product',
            redirect: true
        });
    }

    if (!req.files || !req.files.image) {
        return res.status(400).send('Please upload an image');
    }

    const imageFile = req.files.image;
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(imageFile.mimetype);
    const extname = allowedFileTypes.test(path.extname(imageFile.name).toLowerCase());

    if (!mimetype || !extname) {
        return res.status(400).send('Only images are allowed');
    }

    const { name, description, price, quantity, sale, saleval } = req.body;
    if (!name || !description || !price || !quantity) {
        return res.status(400).send('All fields are required');
    }

    const salebool = sale ? 1 : 0;
    const creator = req.session.user.name;
    const userID = req.session.user.id;
    const createdAt = new Date();

    try {
        const productId = await ProductIDGenerator();
        
        const productDir = path.join(__dirname, '../uploads/products');
        
        if (!fs.existsSync(productDir)) {
            fs.mkdirSync(productDir, { recursive: true });
        }
        const imageName = `${productId}_${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(productDir, imageName);

        await mutex.runExclusive(() => {
            return new Promise((resolve, reject) => {
                imageFile.mv(uploadPath, (err) => {
                    if (err) {
                        console.error('Error uploading image:', err);
                        return reject(new Error('Error uploading image'));
                    }
                    resolve();
                });
            });
        });

        const newProduct = {
            id: productId,
            name,
            description,
            price,
            quantity,
            image: [imageName],
            creator,
            creator_id: userID,
            sale: salebool,
            saleval,
            sold: 0,
            created_at: createdAt
        };

        const sql = 'INSERT INTO products SET ?';
        db.query(sql, newProduct, (err) => {
            if (err) {
                console.error('Error creating product:', err);
                return res.status(500).send('Error creating product');
            }
            res.redirect('back');
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

exports.DisplayProductDetails = (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';

    db.query(sql, productId, (err, rows) => {
        if (err) {
            console.error('Error fetching product details:', err);
            return res.render('home', {
                message: 'Error fetching product details'
            });
        }
        if (rows.length === 0) {
            return res.render('home', {
                message: 'Product not found'
            });
        }

        const product = rows[0];
        const listSql = 'SELECT * FROM products WHERE id != ?';
        db.query(listSql, productId, (errs, resp) => {
            if (errs) {
                console.error('Error fetching product list:', errs);
                return res.render('home', {
                    message: 'Error fetching product list'
                });
            }

            res.render('product-details', { user: req.session.user, product, products: resp });
        });
    });
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
