const db = require('../connect/database');

const findChatById = (chatId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM chats WHERE id = ?', [chatId], (err, results) => {
            if (err) {
                console.error(`Error fetching chat with ID ${chatId}:`, err);
                return reject(err);
            }
            if (results.length === 0) {
                return resolve(null); // Không tìm thấy cuộc trò chuyện
            }
            resolve(results[0]); // Trả về cuộc trò chuyện đầu tiên tìm thấy
        });
    });
};

module.exports = { findChatById };
