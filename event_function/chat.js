const db = require('../connect/database')

const findChatById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chats WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Trả về cuộc trò chuyện đầu tiên (nếu có)
        });
    });
};

module.exports = {findChatById}