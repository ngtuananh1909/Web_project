const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'bcqikpl7dizq2bjdi6qr-mysql.services.clever-cloud.com',
  user: 'uyuy0qownewarix6',
  port: 3306,
  password: 'IorFT7GmzSmMUQJbNKWr', 
  database: 'bcqikpl7dizq2bjdi6qr'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;

