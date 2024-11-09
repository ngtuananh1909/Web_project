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

        // Lấy số dư tài khoản người dùng
        db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
            if (err || user.length === 0) {
                db.rollback();
                return res.status(500).json({ success: false, message: 'Người dùng không tồn tại hoặc lỗi xảy ra.' });
            }

            if (user[0].balance < totalAmount) {
                db.rollback();
                return res.status(400).json({ success: false, message: 'Số dư không đủ để thực hiện giao dịch.' });
            }

            // Trừ số dư người dùng
            db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [totalAmount, userId], (err) => {
                if (err) {
                    db.rollback();
                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật số dư.' });
                }

                // Tạo đơn hàng
                db.query('INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)', [userId, totalAmount, paymentMethod], (err, orderResult) => {
                    if (err) {
                        console.log(err);
                        db.rollback();
                        return res.status(500).json({ success: false, message: 'Không thể tạo đơn hàng.' });
                    }

                    const orderId = orderResult.insertId;
                    let productsProcessed = 0;

                    for (const product of products) {
                        const { id: productId, quantity, price } = product;

                        // Kiểm tra số lượng sản phẩm
                        db.query('SELECT quantity, creator_id FROM products WHERE id = ?', [productId], (err, productData) => {
                            if (err || productData.length === 0 || productData[0].quantity < quantity) {
                                db.rollback();
                                return res.status(400).json({ success: false, message: `Sản phẩm không tồn tại hoặc số lượng không đủ.` });
                            }

                            // Trừ số lượng sản phẩm
                            db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [quantity, productId], (err) => {
                                if (err) {
                                    db.rollback();
                                    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sản phẩm.' });
                                }

                                // Thêm sản phẩm vào order_items
                                db.query('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                                    [orderId, productId, quantity, price || 0], (err) => {
                                        if (err) {
                                            db.rollback();
                                            return res.status(500).json({ success: false, message: 'Không thể thêm sản phẩm vào đơn hàng.' });
                                        }

                                        // Gửi thông báo
                                        const creatorId = productData[0].creator_id;
                                        const message = `Sản phẩm ${product.name} đã được mua.`;
                                        db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [creatorId, message], (err) => {
                                            if (err) {
                                                db.rollback();
                                                return res.status(500).json({ success: false, message: 'Không thể tạo thông báo.' });
                                            }

                                            productsProcessed++;
                                            if (productsProcessed === products.length) {
                                                // Xác nhận giao dịch
                                                db.commit((err) => {
                                                    if (err) {
                                                        db.rollback();
                                                        return res.status(500).json({ success: false, message: 'Lỗi khi xác nhận giao dịch.' });
                                                    }
                                                    // Cập nhật số dư session
                                                    req.session.user.balance -= totalAmount;
                                                    res.json({ success: true, message: 'Thanh toán thành công.' });
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
