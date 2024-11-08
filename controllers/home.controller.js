const bcrypt = require('bcryptjs');
const db = require('../connect/database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { IdGenerator } = require('../event_function/function');
const { getRecommendations } = require('../event_function/Filtering'); 
const { promisify } = require('util');
const util = require('util');
const query = util.promisify(db.query).bind(db);

const unlinkAsync = promisify(fs.unlink);

exports.loginDisplay = (req, res) => {
    res.render('login');
};

exports.registerDisplay = (req, res) => {
    res.render('register');
};

exports.home = async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;
    
    try {
        const productsQuery = 'SELECT * FROM products';
        const notificationsQuery = userId ? 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC' : null;
        
        const [products, notifications, recommendations] = await Promise.all([
            query(productsQuery),
            userId ? query(notificationsQuery, [userId]) : Promise.resolve([]),
        ]);

        const formattedProducts = products.map(product => ({
            ...product,
            formatted_date: new Date(product.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }));

        res.render('home', {
            user: req.session.user,
            products: formattedProducts,
            notifications 
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.render('home', { user: req.session.user, products: [], notifications: []});
    }
};


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.location(req.get("Referrer") || "/") 
        }   
        return res.location(req.get("Referrer") || "/") 
    });
};

exports.hot_product = (req, res) => {
    db.query('SELECT * FROM products ORDER BY sold DESC', (err, results) => {
        if(err){
            console.log('Error fetching products: ', err);
            return res.render('hotproduct', {user : req.session.user, products : []});
        }
        const formattedProducts = results.map(product => {
            return {
                ...product,
                formatted_date: new Date(product.created_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
            };
        });

        res.render('hotproduct', { user: req.session.user, products: formattedProducts });
    })
};

exports.sale_product = (req, res) => {
    db.query('SELECT * FROM products WHERE sale = ?', [1], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.render('saleproduct', { user: req.session.user, products: [] });
        }
        res.render('saleproduct', { user: req.session.user, products: results });
    });
};

exports.cartDisplay = (req, res) => {
    if (!req.session.user) {
        return res.render('login', {
            message: 'You have to login/register to view your cart',
            redirect: true
        });
    }

    const userId = req.session.user.id;
    const selectedProducts = [];

    db.query(`
        SELECT p.* 
        FROM user_cart uc 
        JOIN products p ON uc.product_id = p.id 
        WHERE uc.user_id = ?`, [userId], (err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json({ error: 'Server error' });
            }

            req.session.selectedProducts = result; 
            res.render('cart', { user: req.session.user, products: result, selectedProducts, discountCode: null });
        });
};


exports.SettingDisplay = (req, res) => {
    if (req.session.user) {
        res.render('setting', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
};

exports.register = async (req, res) => {
    const { name, email, password, password_confirm, avatar } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('register', { message: 'Email không hợp lệ' });
    }

    try {
        const results = await query('SELECT email FROM users WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.render('register', { message: 'Email này đã được sử dụng' });
        }

        if (password !== password_confirm) {
            return res.render('register', { message: 'Mật khẩu không khớp' });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const UserId = await IdGenerator();
        const avatarData = avatar ? Buffer.from(avatar, 'base64') : null;

        await query('INSERT INTO users SET ?', {
            id: UserId,
            name,
            email,
            password: hashpassword,
            avatar: avatarData,  
            balance: 1000000,
            reputation: 0,
            story: null, 
            phone: '',   
            friends: 0   
        });

        req.session.user = {
            id: UserId,
            name,
            email,
            avatar: avatarData 
        };

        res.redirect('/');
    } catch (err) {
        console.error('Error during registration:', err);
        res.render('register', { message: 'Lỗi máy chủ' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.render('login', { message: 'Email hoặc mật khẩu không chính xác' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Email hoặc mật khẩu không chính xác' });
        }

        if (req.session) {
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                balance: user.balance,
                reputation: user.reputation,
                story: user.story,
                phone: user.phone,
                friends: user.friends
            };
            return res.redirect('/');
        } else {
            console.error('Session is not initialized.');
            return res.render('login', { message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
        }
    } catch (err) {
        console.error('Server error:', err);
        return res.render('login', { message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};



exports.UserUpdate = async (req, res) => {
    if (!req.session.user) {
        return res.render('login', { message: 'Please log in to update settings' });
    }

    try {
        const avatar = req.files ? req.files.avatar : null;
        const { name, email } = req.body;
        const userId = req.session.user.id;
        const oldAvatarPath = req.session.user.avatar;
        const updateQuery = [];
        const queryParams = [];
        let avatarPath = '';

        if (name && name !== req.session.user.name) {
            updateQuery.push('name = ?');
            queryParams.push(name);
        }

        if (avatar && avatar.name !== path.basename(oldAvatarPath)) {
            avatarPath = `uploads/${userId}${path.extname(avatar.name)}`;
            updateQuery.push('avatar = ?');
            queryParams.push(avatarPath);

            await avatar.mv(path.join(__dirname, '..', avatarPath));
        }

        if (email && email !== req.session.user.email) {
            const [results] = await db.query('SELECT email FROM users WHERE email = ? AND id != ?', [email, userId]);

            if (results.length > 0) {
                return res.render('setting', { user: req.session.user, message: 'Email already exists. Please choose a different one.' });
            }
        }

        if (updateQuery.length === 0) {
            return res.render('setting', { user: req.session.user, message: 'No changes detected' });
        }

        const sqlQuery = `UPDATE users SET ${updateQuery.join(', ')} WHERE id = ?`;
        queryParams.push(userId);

        await db.query(sqlQuery, queryParams);

        req.session.user.name = name || req.session.user.name;
        req.session.user.avatar = avatarPath || req.session.user.avatar;

        if (oldAvatarPath) {
            const fullPath = path.join(__dirname, '..', oldAvatarPath);
            try {
                await fs.unlink(fullPath);
            } catch (unlinkErr) {
                console.log('Error deleting old avatar:', unlinkErr);
            }
        }

        res.render('setting', { user: req.session.user, message: 'Settings updated successfully' });
    } catch (err) {
        console.log('Server error:', err);
        res.render('setting', { user: req.session.user, message: 'Server error' });
    }
};



exports.AddToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!req.session.user) {
            return res.status(401).send('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        }

        const userId = req.session.user.id;

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const results = await query('SELECT * FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

        if (results.length > 0) {
            return res.status(400).send('Sản phẩm đã có trong giỏ hàng của bạn');
        }

        // Thêm sản phẩm vào giỏ hàng
        await query('INSERT INTO user_cart SET ?', { user_id: userId, product_id: productId });
        return res.status(200).send('Sản phẩm đã được thêm vào giỏ hàng');
        
    } catch (err) {
        console.log('Server error:', err);
        return res.status(500).send('Đã xảy ra lỗi server');
    }
};

exports.RemoveFromCart = (req, res) => {
    if (!req.session.user) {
        return res.render('login', {
            message: 'You have to login/register to view your cart',
            redirect: true
        });
    }

    const productId = req.params.id;
    const userId = req.session.user.id;

    db.query('SELECT * FROM user_cart WHERE product_id = ? AND user_id = ?', [productId, userId], (err, result) => {
        if (err) {
            console.error("Error retrieving product from cart: ", err);
            return res.status(500).json({ error: 'Server error while checking product in cart' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        db.query('DELETE FROM user_cart WHERE product_id = ? AND user_id = ?', [productId, userId], (err) => {
            if (err) {
                console.error("Error removing product from cart: ", err);
                return res.status(500).json({ error: 'Server error while removing product from cart' });
            }
            res.status(200).json({ message: 'Product removed from cart successfully' });
        });
    });
};

exports.ProfileDisplay = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.render('login', { message: 'Please log in to view your profile' });
    }

    const userID = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    db.query(sql, [userID], (err, rows) => {
        if (err) {
            console.error('Error fetching user details:', err);
            return res.render('home', { message: 'Error fetching user details' });
        }
        if (rows.length === 0) {
            return res.render('home', { message: 'User not found' });
        }

        const user = rows[0];
        db.query('SELECT * FROM products WHERE creator_id = ?', [userID], (errs, resps) => {
            if(errs){
                console.error('Error fetching user products:', err);
                return res.render('home', { message: 'Error fetching user details' });
            }
            res.render('profile', { user, products: resps});
        })
    });
};

exports.ScoreboardDisplay = (req, res) => {
    db.query('SELECT *, DATE_FORMAT(created_at, "%d-%m-%Y") AS formatted_date FROM products ORDER BY sold DESC', (err, result) => {
        if (err) {
            console.error('Error fetching products from the database:', err);
            return res.render('home', { message: "Failed to load leaderboard. Please try again later." });
        }
        result.forEach((product, index) => {
            product.index = index + 1;
        });
        res.render('scoreboard', { user:req.session.user ,products: result });
    });
};

exports.addRating = (req, res) => {
    const { product_id, score } = req.body;
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.json({ success: false, message: 'Bạn cần đăng nhập để đánh giá sản phẩm.' });
    }

    const sql = 'INSERT INTO ratings (user_id, product_id, score, created_at) VALUES (?, ?, ?, NOW())';
    db.query(sql, [userId, product_id, score], (err) => {
        if (err) {
            console.error('Error adding rating:', err);
            return res.json({ success: false, message: 'Có lỗi xảy ra khi thêm đánh giá.' });
        }

        res.json({ success: true });
    });
};

exports.MessageDisplay = async (req, res) => {
    if (!req.session.user) {
        return res.render('login', {
            message: 'You have to login/register to message',
            redirect: true
        });
    }
    const chatId = req.params.id;
    const user = req.session.user; 

    if (!user) {
        return res.redirect('/login');
    }

    try {
        const chat = await findChatById(chatId);
        if (!chat) {
            return res.render('message', { user, chat: null, message: 'Cuộc trò chuyện không tìm thấy' });
        }
        res.render('message', { user, chat });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.render('message', { user, chat: null, message: 'Lỗi khi lấy cuộc trò chuyện' });
    }
};
exports.SendMessage = (req, res) => {
    if (!req.session.user) {
        return res.render('login', {
            message: 'You have to login/register to send message',
            redirect: true
        });
    }
    const { text, chatId } = req.body;

    const sql = 'INSERT INTO messages (chat_id, sender_id, text) VALUES (?, ?, ?)';
    db.query(sql, [chatId, req.session.user.id, text], (err, result) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
}

exports.SearchProducts = async (req, res) => {
    const searchQuery = req.query.query;

    try {
        db.query('SELECT * FROM products WHERE name LIKE ? OR description LIKE ?', 
                 [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
            if (err) {
                console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err);
                return res.status(500).send('Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu');
            }

            if (results.length === 0) {
                return res.render('SearchResults', {products: [], query: searchQuery, user: req.session.user})
            }
            res.render('SearchResults', {products: results, query: searchQuery, user: req.session.user})
        });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error);
        res.status(500).send('Đã xảy ra lỗi khi tìm kiếm sản phẩm');
    }
};

exports.usersStats = (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}

exports.StatsDisplay = (req, res) => {
    if(user.session.id != 'rgB6QoFkYk') res.redirect('/');
    res.render('infor');
}

exports.UpdateFields = async (req, res) => {
    const userID = req.session.user.id; 
    const { field, value } = req.body;
    console.log(field + ' ' + value);
    
    if (!userID) {
        return res.status(401).json({ success: false, message: 'Người dùng không được xác thực.' });
    }
    
    try {
        await new Promise((resolve, reject) => {
            db.query('UPDATE users SET ?? = ? WHERE id = ?', [field, value, userID], (error, results) => {
                if (error) {
                    return reject(error); 
                }
                resolve(results); 
            });
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('Error updating user field:', err);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại.' });
    }
};

exports.getNotifications = (req, res) => {
    const userId = req.session.user.id; 

    db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, notifications) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' });
        }

        res.json({ success: true, notifications: notifications });
    });
};
