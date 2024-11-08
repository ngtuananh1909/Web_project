// event_function/Filtering.js

const db = require('../connect/database');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// Content-based filtering function
async function getRecommendations(userId, limit = 5) {
    try {
        // Step 1: Get user's previously purchased or viewed products
        const userProductsQuery = `
            SELECT DISTINCT p.category 
            FROM products p
            JOIN user_cart uc ON p.id = uc.product_id
            WHERE uc.user_id = ?
        `;
        const userProducts = await query(userProductsQuery, [userId]);

        // If no previous products, return random products
        if (userProducts.length === 0) {
            const randomProductsQuery = `
                SELECT * FROM products 
                ORDER BY RAND() 
                LIMIT ?
            `;
            return await query(randomProductsQuery, [limit]);
        }

        // Step 2: Extract categories
        const categories = userProducts.map(p => p.category);

        // Step 3: Find similar products based on categories
        const recommendationQuery = `
            SELECT * FROM products 
            WHERE category IN (?) 
            AND id NOT IN (
                SELECT product_id 
                FROM user_cart 
                WHERE user_id = ?
            )
            ORDER BY RAND()
            LIMIT ?
        `;
        
        const recommendations = await query(recommendationQuery, [
            categories, 
            userId, 
            limit
        ]);

        // If not enough recommendations, fill with random products
        if (recommendations.length < limit) {
            const additionalProductsQuery = `
                SELECT * FROM products 
                WHERE id NOT IN (?)
                ORDER BY RAND()
                LIMIT ?
            `;
            const additionalProducts = await query(additionalProductsQuery, [
                recommendations.map(p => p.id),
                limit - recommendations.length
            ]);

            recommendations.push(...additionalProducts);
        }

        return recommendations;
    } catch (error) {
        console.error('Recommendation Error:', error);
        // Fallback to random products if recommendation fails
        const randomProductsQuery = `
            SELECT * FROM products 
            ORDER BY RAND() 
            LIMIT ?
        `;
        return await query(randomProductsQuery, [limit]);
    }
}

// Collaborative filtering (basic version)
async function getCollaborativeRecommendations(userId, limit = 5) {
    try {
        // Find users with similar purchasing history
        const similarUsersQuery = `
            SELECT DISTINCT uc2.user_id
            FROM user_cart uc1
            JOIN user_cart uc2 ON uc1.product_id = uc2.product_id
            WHERE uc1.user_id = ? AND uc2.user_id != ?
            LIMIT 5
        `;
        const similarUsers = await query(similarUsersQuery, [userId, userId]);

        if (similarUsers.length === 0) {
            return getRecommendations(userId, limit);
        }

        // Get products bought by similar users that current user hasn't bought
        const collaborativeRecommendationsQuery = `
            SELECT DISTINCT p.*
            FROM products p
            JOIN user_cart uc ON p.id = uc.product_id
            WHERE uc.user_id IN (?)
            AND p.id NOT IN (
                SELECT product_id 
                FROM user_cart 
                WHERE user_id = ?
            )
            ORDER BY RAND()
            LIMIT ?
        `;
        
        const recommendations = await query(collaborativeRecommendationsQuery, [
            similarUsers.map(u => u.user_id),
            userId,
            limit
        ]);

        // If not enough recommendations, combine with content-based
        if (recommendations.length < limit) {
            const contentBasedRecs = await getRecommendations(userId, limit - recommendations.length);
            recommendations.push(...contentBasedRecs);
        }

        return recommendations;
    } catch (error) {
        console.error('Collaborative Recommendation Error:', error);
        return getRecommendations(userId, limit);
    }
}

module.exports = {
    getRecommendations,
    getCollaborativeRecommendations
};