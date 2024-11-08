const { connection } = require('../connect/database');

exports.getRecommendations = async () => {
    const recommendationsQuery = `
        SELECT 
            p.product_id,
            p.product_name,
            IFNULL(AVG(r.rating), 0) AS avg_rating,
            COUNT(r.rating) AS rating_count,
            (IFNULL(AVG(r.rating), 0) * 0.7 + COUNT(r.rating) * 0.3) AS score
        FROM 
            products p
        LEFT JOIN 
            ratings r ON p.product_id = r.product_id
        GROUP BY 
            p.product_id
        ORDER BY 
            score DESC
        LIMIT 100;
    `;

    try {
        const recommendations = await connection(recommendationsQuery);
        return recommendations;
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        return [];
    }
};