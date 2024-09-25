const bcrypt = require('bcryptjs');
const db = require('../connect/database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { IdGenerator } = require('../event_function/function');
const {calculateUserSimilarity, getTopRecommendedProducts, findSimilarProducts} = require('../event_function/Filtering')
const { promisify } = require('util');
const {findChatById} = require('../event_function/chat')
const util = require('util');
const query = util.promisify(db.query).bind(db);
const unlinkAsync = promisify(fs.unlink);

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
    if (!req.session.user) {
        return res.render('login', {
            message: 'You have to login/register to view your message',
            redirect: true
        });
    }

    const { text, chatId } = req.body;

    if (!text || !chatId) {
        return res.status(400).json({ success: false, error: 'Text and Chat ID are required' });
    }

    const sql = 'INSERT INTO messages (chat_id, sender_id, text) VALUES (?, ?, ?)';
    db.query(sql, [chatId, req.session.user.id, text], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        
        const newMessage = {
            id: result.insertId,
            chatId: chatId,
            senderId: req.session.user.id,
            text: text,
            timestamp: new Date() 
        };
    
        res.json({ success: true, message: newMessage });
    });
}

