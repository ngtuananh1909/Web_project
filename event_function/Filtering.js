const db = require('../connect/database');

function getRecommendations(userId, limit = 5, callback) {
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
            return db.query(randomProductsQuery, [limit], (err, results) => {
                callback(err, results || []);
            });
        }

        // If user has previous products, get recommendations based on categories
        const categoryRecommendationsQuery = `
            SELECT * FROM products 
            WHERE category IN (?) 
            AND id NOT IN (
                SELECT product_id FROM user_cart WHERE user_id = ?
            )
            LIMIT ?
        `;

        const categories = userProducts.map(p => p.category);
        
        db.query(categoryRecommendationsQuery, [categories, userId, limit], (err, results) => {
            if (err) {
                console.error('Category Recommendation Error:', err);
                return callback(null, []);
            }
            callback(null, results);
        });
    });
}

function getCollaborativeRecommendations(userId, limit = 5, callback) {
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

        // If no similar users found, fall back to basic recommendations
        if (similarUsers.length === 0) {
            return getRecommendations(userId, limit, callback);
        }

        // Get products bought by similar users that the current user hasn't bought
        const collaborativeRecommendationQuery = `
            SELECT DISTINCT p.* 
            FROM products p
            JOIN user_cart uc ON p.id = uc.product_id
            WHERE uc.user_id IN (?)
            AND p.id NOT IN (
                SELECT product_id FROM user_cart WHERE user_id = ?
            )
            LIMIT ?
        `;

        const similarUserIds = similarUsers.map(u => u.user_id);
        
        db.query(collaborativeRecommendationQuery, [similarUserIds, userId, limit], (err, results) => {
            if (err) {
                console.error('Collaborative Recommendation Query Error:', err);
                return getRecommendations(userId, limit, callback);
            }
            
            // If no collaborative recommendations, fall back to basic recommendations
            if (results.length === 0) {
                return getRecommendations(userId, limit, callback);
            }
            
            callback(null, results);
        });
    });
}

// Exports remain the same
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