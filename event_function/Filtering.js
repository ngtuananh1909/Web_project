const db = require('../connect/database');

function getRecommendations(userId, limit = 5, callback) {
    // Use callback pattern
    const userProductsQuery = `
        SELECT DISTINCT p.category 
        FROM products p
        JOIN user_cart uc ON p.id = uc.product_id
        WHERE uc.user_id = ?
    `;

    db.query(userProductsQuery, [userId], (err, userProducts) => {
        if (err) {
            console.error('Recommendation Error:', err);
            return callback(null, []);
        }

        // If no previous products, return random products
        if (userProducts.length === 0) {
            const randomProductsQuery = `
                SELECT * FROM products 
                ORDER BY RAND() 
                LIMIT ?
            `;
            return db.query(randomProductsQuery, [limit], callback);
        }

        // Continue with rest of the recommendation logic...
        // Make sure to use callback at the end
    });
}

function getCollaborativeRecommendations(userId, limit = 5, callback) {
    // Similar modification to use callback
    const similarUsersQuery = `
        SELECT DISTINCT uc2.user_id
        FROM user_cart uc1
        JOIN user_cart uc2 ON uc1.product_id = uc2.product_id
        WHERE uc1.user_id = ? AND uc2.user_id != ?
        LIMIT 5
    `;

    db.query(similarUsersQuery, [userId, userId], (err, similarUsers) => {
        if (err) {
            console.error('Collaborative Recommendation Error:', err);
            return getRecommendations(userId, limit, callback);
        }

        // Continue recommendation logic...
        // Ensure to use callback
    });
}

// Modify exports to support both Promise and callback patterns
module.exports = {
    getRecommendations: (userId, limit) => {
        return new Promise((resolve, reject) => {
            getRecommendations(userId, limit, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },
    getCollaborativeRecommendations: (userId, limit) => {
        return new Promise((resolve, reject) => {
            getCollaborativeRecommendations(userId, limit, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
};