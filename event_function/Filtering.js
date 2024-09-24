const db = require('../connect/database')

const calculateUserSimilarity = (userRatings, allRatings) => {
    const userVector = {};
    userRatings.forEach(rating => {
        userVector[rating.product_id] = rating.rating;
    });

    const similarities = {};

    allRatings.forEach(rating => {
        const otherUserId = rating.user_id;
        const otherUserVector = similarities[otherUserId] || {};
        otherUserVector[rating.product_id] = rating.rating;

        similarities[otherUserId] = otherUserVector;
    });

    const userSimilarities = {};
    for (const otherUserId in similarities) {
        const otherUserVector = similarities[otherUserId];
        const similarity = cosineSimilarity(userVector, otherUserVector);
        userSimilarities[otherUserId] = similarity;
    }

    return userSimilarities;
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = Object.keys(vecA).reduce((sum, key) => {
        return sum + (vecA[key] || 0) * (vecB[key] || 0);
    }, 0);

    const normA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (normA * normB);
};

const getTopRecommendedProducts = (userId, similarUsers, allRatings) => {
    const recommendedProducts = new Map();

    for (const otherUserId in similarUsers) {
        const similarity = similarUsers[otherUserId];
        if (similarity <= 0) continue;

        allRatings.forEach(rating => {
            if (rating.user_id === otherUserId) {
                if (!recommendedProducts.has(rating.product_id) && rating.rating >= 4) {
                    recommendedProducts.set(rating.product_id, {
                        productId: rating.product_id,
                        score: similarity * rating.rating
                    });
                }
            }
        });
    }

    return Array.from(recommendedProducts.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};

const findSimilarProducts = async (favoriteProducts) => {
    const attributesMap = {};
    favoriteProducts.forEach(product => {
        attributesMap[product.id] = product.attributes; 
    });

    const similarProducts = [];

    for (const productId in attributesMap) {
        const attributes = attributesMap[productId];

        try {
            const [products] = await db.query('SELECT * FROM products WHERE attributes IN (?) AND id != ?', [attributes, productId]);
            similarProducts.push(...products);
        } catch (err) {
            console.error('Error fetching similar products:', err);
        }
    }

    return similarProducts.length > 0 ? similarProducts : [];
};


module.exports = {calculateUserSimilarity, getTopRecommendedProducts, findSimilarProducts}