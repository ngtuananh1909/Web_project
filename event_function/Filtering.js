const db = require('../connect/database');

async function getRecommendations() {
    try {
        const results = await db.query(`
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
                p.price,
                p.image,
                COALESCE(
                    (IFNULL(AVG(r.rating), 0) * 0.7 + COUNT(r.rating) * 0.3), 
                    0
                ) AS score,
                COUNT(r.rating) AS rating_count,
                IFNULL(AVG(r.rating), 0) AS avg_rating
            FROM 
                products p
            LEFT JOIN 
                ratings r ON p.id = r.product_id
            GROUP BY 
                p.id,
                p.name,
                p.price,
                p.image
            ORDER BY 
                score DESC
            LIMIT 100
        `);
        return results;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return []; 
    }
}

module.exports = { getRecommendations };