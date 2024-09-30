const bcrypt = require('bcryptjs');
const db = require('../connect/database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { IdGenerator } = require('../event_function/function');
const {calculateUserSimilarity, getTopRecommendedProducts, findSimilarProducts} = require('../event_function/Filtering')
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

exports.home = (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;

    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.render('home', { user: req.session.user, products: [] });
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

        if (userId) {
            db.query('SELECT * FROM ratings WHERE user_id = ?', [userId], async (err, userRatings) => {
                if (err) {
                    console.error('Error fetching user ratings:', err);
                    return res.render('home', { user: req.session.user, products: formattedProducts, recommendations: [] });
                }
        
                db.query('SELECT * FROM ratings', async (err, allRatings) => {
                    if (err) {
                        console.error('Error fetching all ratings:', err);
                        return res.render('home', { user: req.session.user, products: formattedProducts, recommendations: [] });
                    }
        
                    const userSimilarities = calculateUserSimilarity(userRatings, allRatings);
                    const collaborativeRecommendations = getTopRecommendedProducts(userId, userSimilarities, allRatings);
        
                    const favoriteProductIds = userRatings.map(r => r.product_id);
                    const contentRecommendations = await findSimilarProducts(favoriteProductIds);
        
                    const allRecommendations = [...collaborativeRecommendations, ...contentRecommendations];
        
                    const uniqueRecommendations = Array.from(new Set(allRecommendations.map(a => a.productId)))
                        .map(id => allRecommendations.find(a => a.productId === id));
        
                    res.render('home', {
                        user: req.session.user,
                        products: formattedProducts,
                        recommendations: uniqueRecommendations
                    });
                });
            });
        } else {
            res.render('home', { user: req.session.user, products: formattedProducts, recommendations: [] });
        }
        
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.redirect('back');
        }
        return res.redirect('back');
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

    db.query(`
        SELECT p.* 
        FROM user_cart uc 
        JOIN products p ON uc.product_id = p.id 
        WHERE uc.user_id = ?`, [userId], (err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).json({ error: 'Server error' });
            }
            res.render('cart', { user: req.session.user, products: result });
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
    const { name, email, password, password_confirm } = req.body;
    try {
        db.query('SELECT email from users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('register', { message: 'Server error' });
            }
            if (results.length > 0) {
                return res.render('register', { message: 'This Email is already in use' });
            }
            if (password !== password_confirm) {
                return res.render('register', { message: 'Passwords do not match' });
            }

            const hashpassword = await bcrypt.hash(password, 10);
            const UserId = await IdGenerator();

            db.query('INSERT INTO users SET ?', { id: UserId, name, email, password: hashpassword, balance: 0, reputation: 0 }, (err) => {
                if (err) {
                    console.log(error);
                    return res.render('register', { message: 'Server error' });
                }
                if (req.session) {
                    req.session.user = {
                        id: UserId,
                        name,
                        email,
                        password: hashpassword,
                    };
                    res.redirect('/');
                } else {
                    console.log('Session is not initialized.');
                    res.render('login', { message: 'Session error' });
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.render('register', { message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.log(err);
                return res.render('login', { message: 'Server error' });
            }
            if (results.length === 0) {
                return res.render('login', { message: 'Email or password is incorrect' });
            }
            try {
                const isMatch = await bcrypt.compare(password, results[0].password);
                if (!isMatch) {
                    return res.render('login', { message: 'Email or password is incorrect' });
                }
                if (req.session) {
                    req.session.user = {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email,
                        avatar: results[0].avatar,
                        balance: results[0].balance,
                        reputation: results[0].reputation,
                        story: results[0].story,
                        phone: results[0].phone,
                        friends: results[0].friends
                    };
                    return res.redirect('/');
                } else {
                    console.log('Session is not initialized.');
                    return res.render('login', { message: 'Session error' });
                }
            } catch (error) {
                console.log(error);
                return res.render('login', { message: 'Server error' });
            }
        });
    } catch (err) {
        console.log(err);
        return res.render('login', { message: 'Server error' });
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

        const updateUser = () => {
            let updateQuery = 'UPDATE users SET';
            const queryParams = [];
            let avatarPath = '';

            if (name && name !== req.session.user.name) {
                updateQuery += ' name = ?,';
                queryParams.push(name);
            }

            if (avatar) {
                avatarPath = `uploads/${userId}${path.extname(avatar.name)}`;
                updateQuery += ' avatar = ?,';
                queryParams.push(avatarPath);

                avatar.mv(path.join(__dirname, '..', avatarPath), (err) => {
                    if (err) {
                        console.log('Error moving avatar file:', err);
                        return res.status(500).send('Error saving file');
                    }
                });
            }

            if (queryParams.length === 0) {
                return res.render('setting', { user: req.session.user, message: 'No changes detected' });
            }

            updateQuery = updateQuery.slice(0, -1); 
            updateQuery += ' WHERE id = ?';
            queryParams.push(userId);

            db.query(updateQuery, queryParams, async (error) => {
                if (error) {
                    console.log('Error updating settings:', error);
                    return res.render('setting', { user: req.session.user, message: 'Error updating settings' });
                }

                req.session.user.name = name || req.session.user.name;
                req.session.user.avatar = avatarPath || req.session.user.avatar;

                if (oldAvatarPath) {
                    console.log('Old Avatar Path:', oldAvatarPath); 
                    try {
                        const fullPath = path.join(__dirname, '..', oldAvatarPath.toString());
                        console.log('Full Path:', fullPath); 
                        await fs.unlink(fullPath);
                    } catch (unlinkErr) {
                        console.log('Error deleting old avatar:', unlinkErr);
                    }
                }

                res.render('setting', { user: req.session.user, message: 'Settings updated successfully' });
            });
        };

        if (email && email !== req.session.user.email) {
            db.query('SELECT email FROM users WHERE email = ? AND id != ?', [email, userId], (error, results) => {
                if (error) {
                    console.log('Error checking email:', error);
                    return res.render('setting', { user: req.session.user, message: 'Error checking email' });
                }

                if (results.length > 0) {
                    return res.render('setting', { user: req.session.user, message: 'Email already exists. Please choose a different one.' });
                }
                updateUser();
            });
        } else {
            updateUser();
        }
    } catch (err) {
        console.log('Server error:', err);
        res.render('setting', { user: req.session.user, message: 'Server error' });
    }
};


exports.AddToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        // Kiểm tra xem người dùng đã đăng nhập chưa
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

exports.Payment = async(req, res) => {
    const totalAmount = req.body.total;

    client.createTransaction({
    currency1: 'USD',
    currency2: 'BTC', 
    amount: totalAmount,
    buyer_email: req.user.email,
  }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Thanh toán thất bại');
    }

    res.redirect(result.checkout_url);
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
        db.query('SELECT * FROM products WHERE name LIKE ? OR description LIKE ?', [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
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



