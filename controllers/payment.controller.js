const db = require('../connect/database')

exports.PaymentOptions = (req, res) => {
    const UserId = req.params.id

    db.query('SELECT * FROM users WHERE id = ?', [UserId], (err, result) => {
        if(err){
            return res.redirect('login');
        }
        else{
            return res.render('options')
        }
    });
}