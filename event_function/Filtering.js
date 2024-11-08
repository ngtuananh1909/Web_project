const db = require('../connect/database');

exports.getRecommendations = async () => {
    const recommendationsQuery = `
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            IFNULL(AVG(r.rating), 0) * 0.7 + COUNT(r.rating) * 0.3 AS score,
            COUNT(r.rating) AS rating_count,
            IFNULL(AVG(r.rating), 0) AS avg_rating
        FROM 
            products p
        LEFT JOIN 
            ratings r ON p.id = r.product_id
        GROUP BY 
            p.id
        ORDER BY 
            score DESC
        LIMIT 100;
    `;

    try {
        const [recommendations] = await db.query(recommendationsQuery);
        return recommendations;
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        return [];
    }
};
