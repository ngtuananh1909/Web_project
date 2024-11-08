const mysql = require('mysql2');

// Create a connection function instead of a pool
const createConnection = () => {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_DBNAME
    });
};

module.exports = {
    createConnection,
    query: (sql, params) => {
        return new Promise((resolve, reject) => {
            const connection = createConnection();
            connection.query(sql, params, (error, results) => {
                connection.end((endErr) => {
                    if (endErr) {
                        console.error('Error closing connection:', endErr);
                    }
                    
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                });
            });
        });
    }
};