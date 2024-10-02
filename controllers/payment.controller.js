const db = require('../connect/database');

exports.PaymentOptions = (req, res) => {
    const UserId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [UserId], (err, result) => {
        if (err) {
            return res.redirect('/login');
        } else {
            return res.render('options', { user: result[0] });
        }
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
            return res.status(500).send('Lỗi khi lấy thông tin sản phẩm.');
        }

        db.query('SELECT MAX(`index`) as maxIndex FROM PayData WHERE userid = ?', [UserId], (err, result) => {
            if (err) {
                return res.status(500).send('Lỗi khi tính toán index.');
            }

            let currentIndex = result[0].maxIndex ? result[0].maxIndex + 1 : 1;

            products.forEach((product) => {
                const totalPrice = product.price * discount; 

                db.query(
                    `INSERT INTO PayData (userid, productid, quantity, discount, price, \`index\`) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [UserId, product.id, product.quantity, discount, totalPrice, currentIndex],
                    (err, result) => {
                        if (err) {
                            console.error('Lỗi khi lưu sản phẩm vào PayData:', err);
                        }
                    }
                );

                currentIndex++; 
            });

            return res.redirect(`/payment/option/t/${UserId}`);
        });
    });
};
