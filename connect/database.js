const mysql = require('mysql2');

const pool = mysql.createPool({
  host: localhost,
  port: 3001,
  password: '',
  database: product_db,
  waitForConnections: true,
  connectionLimit: 5, // Thay đổi tùy theo nhu cầu của bạn
  queueLimit: 0
});

module.exports = pool;
