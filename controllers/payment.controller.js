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

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });

        db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                db.rollback();
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
            }

            if (user.length === 0 || user[0].balance < totalAmount) {
                db.rollback();
                return res.status(400).json({ success: false, message: 'Số dư không đủ để thực hiện giao dịch.' });
            }

            db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [totalAmount, userId], (err) => {
                if (err) {
                    db.rollback();
                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                }

                db.query('INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)', [userId, totalAmount, paymentMethod], (err, orderResult) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                    }

                    const orderId = orderResult.insertId;
                    let productsProcessed = 0;

                    for (const product of products) {
                        db.query('SELECT quantity, creator_id FROM products WHERE id = ?', [product.id], (err, productData) => {
                            if (err || productData.length === 0) {
                                db.rollback();
                                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                            }

                            const creatorId = productData[0].creator_id;
                            if (productData[0].quantity < product.quantity) {
                                db.rollback();
                                return res.status(400).json({ success: false, message: `Số lượng sản phẩm ${product.name} không đủ.` });
                            }

                            db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [product.quantity, product.id], (err) => {
                                if (err) {
                                    db.rollback();
                                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                                }

                                db.query('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                                [orderId, product.id, product.quantity, product.price], (err) => {
                                    if (err) {
                                        db.rollback();
                                        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                                    }

                                    const message = `Sản phẩm ${product.name} đã được đặt mua.`;
                                    db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [creatorId, message], (err) => {
                                        if (err) {
                                            db.rollback();
                                            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                                        }

                                        productsProcessed++;
                                        if (productsProcessed === products.length) {
                                            db.commit((err) => {
                                                if (err) {
                                                    db.rollback();
                                                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
                                                }
                                                req.session.user.balance -= totalAmount; 
                                                res.json({ success: true, message: 'Thanh toán thành công' });
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    });
};