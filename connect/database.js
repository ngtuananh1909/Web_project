const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Thực hiện truy vấn từ pool
pool.query('SELECT * FROM your_table_name', (error, results) => {
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  console.log('Results:', results);
});

// Xuất pool
module.exports = pool;
