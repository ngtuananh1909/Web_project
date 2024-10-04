const db = require('../connect/database')

exports.PaymentOptions = (req, res) => {
    const UserId = req.session.user.id;

    if (!UserId) {
        return res.redirect('/login');
    }

    db.query('SELECT * FROM users WHERE id = ?', [UserId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.redirect('/login');
        }

        if (result.length === 0) {
            return res.redirect('/login'); 
        }

        return res.render('options', { user: result[0] });
    });
};

exports.Checkout = (req, res) => {
    const { selectedProducts, discountCode } = req.body; 
    let discount = 1.0; 

    if (discountCode) {
        discountCode = 0.9;
        // db.query('SELECT * FROM coupons WHERE code = ?', [discountCode], (err, coupon) => {
        //     if (err || !coupon.length) {
        //         return res.status(400).send('Mã giảm giá không hợp lệ.');
        //     }
        //     discount = coupon[0].discount_value;
        // });
    }

    db.query('SELECT * FROM products WHERE id IN (?)', [selectedProducts], (err, products) => {
        if (err) {
            return res.status(500).send('Lỗi khi lấy thông tin sản phẩm.');
        }

        db.query('SELECT MAX(`index`) as maxIndex FROM paydata WHERE userid = ?', [UserId], (err, result) => {
            if (err) {
                return res.status(500).send('Lỗi khi tính toán index.');
            }

            let currentIndex = result[0].maxIndex ? result[0].maxIndex + 1 : 1;

            db.beginTransaction((err) => {
                if (err) {
                    return res.status(500).send('Lỗi khi bắt đầu transaction.');
                }

                products.forEach((product) => {
                    const totalPrice = product.price * discount; 

                    db.query(
                        `INSERT INTO paydata (userid, productid, quantity, discount, price, \`index\`) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [UserId, product.id, product.quantity, discount, totalPrice, currentIndex],
                        (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).send('Lỗi khi lưu sản phẩm vào PayData.');
                                });
                            }
                        }
                    );

                    currentIndex++; 
                });

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Lỗi khi commit transaction.');
                        });
                    }
                    return res.redirect(`/payment/option/t/${UserId}`);
                });
            });
        });
    });
};
