const db = require('../connect/database');
const { IdGenerator } = require('../event_function/function');

exports.PaymentOptions = async (req, res) => {
    const UserId = req.params.id;

    if (!UserId) {
        return res.redirect('/login');
    }

    try {
        const [userResult] = await db.promise().query('SELECT * FROM users WHERE id = ?', [UserId]);

        if (userResult.length === 0) {
            return res.redirect('/login');
        }

        const selectedProducts = JSON.parse(req.body.selectedProducts || '[]');
        console.log(selectedProducts);

        const totalAmount = selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);

        return res.render('options', { user: userResult[0], products: selectedProducts, totalAmount });
    } catch (err) {
        console.error('Database error:', err);
        return res.redirect('/login');
    }
}


exports.ConfirmPayment = (req, res) => {
    const { userId, paymentMethod, products, totalAmount } = req.body;

    db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Có lỗi xảy ra:', err.message);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
        }

        if (user.length === 0 || user[0].balance < totalAmount) {
            return res.status(400).json({ success: false, message: 'Số dư không đủ để thực hiện giao dịch.' });
        }

        db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [totalAmount, userId], (err) => {
            if (err) {
                console.error('Có lỗi xảy ra:', err.message);
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
            }

            let productsProcessed = 0;

            for (const product of products) {
                db.query('SELECT quantity FROM products WHERE name = ?', [product.name], (err, productData) => {
                    if (err) {
                        console.error('Có lỗi xảy ra:', err.message);
                        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                    }

                    if (productData.length === 0) {
                        return res.status(400).json({ success: false, message: `Sản phẩm ${product.name} không tồn tại.` });
                    }

                    if (productData[0].quantity < product.quantity) {
                        return res.status(400).json({ success: false, message: `Số lượng sản phẩm ${product.name} không đủ.` });
                    }

                    db.query('UPDATE products SET quantity = quantity - ? WHERE name = ?', [product.quantity, product.name], (err) => {
                        if (err) {
                            console.error('Có lỗi xảy ra:', err.message);
                            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                        }

                        productsProcessed++;

                        if (productsProcessed === products.length) {
                            res.json({ success: true });
                        }
                    });
                });
            }

            if (products.length === 0) {
                res.json({ success: true });
            }
        });
    });
};