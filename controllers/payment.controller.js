const db = require('../connect/database')

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

exports.Checkout = async (req, res) => {
    const UserId = req.session.user.id;
    const { selectedProducts, discountCode } = req.body;
    let discount = 1.0; // Mặc định không giảm giá

    try {
        // Kiểm tra mã giảm giá
        if (discountCode) {
            const [coupon] = await db.promise().query('SELECT * FROM coupons WHERE code = ?', [discountCode]);
            if (!coupon.length) {
                return res.status(400).send('Mã giảm giá không hợp lệ.');
            }
            const currentDate = new Date();
            if (coupon[0].expiry_date < currentDate) {
                return res.status(400).send('Mã giảm giá đã hết hạn.');
            }
            discount = coupon[0].discount_value / 100;
        }

        const [products] = await db.promise().query('SELECT * FROM products WHERE id IN (?)', [Object.keys(selectedProducts)]);
        if (!products.length) {
            return res.status(404).send('Không tìm thấy sản phẩm nào.');
        }

        const [result] = await db.promise().query('SELECT MAX(`index`) as maxIndex FROM paydata WHERE userid = ?', [UserId]);
        let currentIndex = result[0].maxIndex ? result[0].maxIndex + 1 : 1;

        await db.promise().beginTransaction(); 

        const queries = products.map((product) => {
            const quantity = selectedProducts[product.id];
            if (!quantity || quantity <= 0) {
                throw new Error('Số lượng sản phẩm không hợp lệ.');
            }

            const totalPrice = product.price * quantity * discount; 
            return db.promise().query(
                `INSERT INTO paydata (userid, productid, quantity, discount, price, \`index\`) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [UserId, product.id, quantity, discount, totalPrice, currentIndex++]
            );
        });

        await Promise.all(queries); 
        await db.promise().commit(); 
        return res.redirect(`/payment/option/t/${UserId}`);
    } catch (err) {
        await db.promise().rollback(); 
        console.error(err); 
        return res.status(500).send('Lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.');
    }
};
