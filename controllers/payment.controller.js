const db = require('../connect/database');
const {ProductIDGenerator} = require('../event_function/function')

exports.PaymentOptions = (req, res) => {
    const UserId = req.params.id;

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
    const UserId = req.params.id;
    const { selectedProducts, discountCode } = req.body;
    let discount = 1.0;

    if (discountCode) {
        discount = 0.9;
    }

    db.query('SELECT * FROM products WHERE id IN (?)', [selectedProducts], (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm.' });
        }

        db.query('SELECT MAX(`index`) as maxIndex FROM paydata WHERE userid = ?', [UserId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi tính toán index.' });
            }

            let currentIndex = result[0].maxIndex ? result[0].maxIndex + 1 : 1;

            db.beginTransaction((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi bắt đầu transaction.' });
                }

                products.forEach((product) => {
                    const totalPrice = product.price * discount;
                    const CartId = ProductIDGenerator();

                    db.query(
                        `INSERT INTO paydata (id, userid, productid, quantity, discount, price, \`index\`) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [CartId, UserId, product.id, product.quantity, discount, totalPrice, currentIndex],
                        (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: 'Lỗi khi lưu sản phẩm vào PayData.' });
                                });
                            }
                        }
                    );

                    currentIndex++;
                });

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Lỗi khi commit transaction.' });
                        });
                    }
                    return res.json({ success: true, userId: UserId });
                });
            });
        });
    });
};
