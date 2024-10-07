const mysql = require('mysql2');

const connection = mysql.createConnection({
<<<<<<< HEAD
  host: 'bcqikpl7dizq2bjdi6qr-mysql.services.clever-cloud.com',
  user: 'uyuy0qownewarix6',
  port: 3306,
  password: 'IorFT7GmzSmMUQJbNKWr', 
  database: 'bcqikpl7dizq2bjdi6qr'
=======
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DBNAME
>>>>>>> a522ae32de22769815de40e042b508fb110ed209
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;

