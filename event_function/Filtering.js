// Đảm bảo đã import query từ module database
const { query } = require('../connect/database');

// Hàm tính toán sự tương đồng giữa người dùng (User-User Similarity)
const calculateUserSimilarity = (userRatings, allRatings) => {
    const users = [...new Set(allRatings.map(rating => rating.user_id))];
    const ratingsMatrix = [];

    // Tạo ma trận ratings
    users.forEach(user => {
        const userRatingsArray = new Array(allRatings.length).fill(0); 
        allRatings.forEach(row => {
            if (row.user_id === user) {
                const productIndex = allRatings.findIndex(r => r.product_id === row.product_id);
                userRatingsArray[productIndex] = row.rating;
            }
        });
        ratingsMatrix.push(userRatingsArray);
    });

    const similarityMatrix = [];
    for (let i = 0; i < users.length; i++) {
        similarityMatrix[i] = [];
        for (let j = 0; j < users.length; j++) {
            // Tính cosine similarity giữa người dùng i và j
            const dotProduct = ratingsMatrix[i].reduce((acc, val, index) => acc + val * ratingsMatrix[j][index], 0);
            const magnitudeA = Math.sqrt(ratingsMatrix[i].reduce((acc, val) => acc + Math.pow(val, 2), 0));
            const magnitudeB = Math.sqrt(ratingsMatrix[j].reduce((acc, val) => acc + Math.pow(val, 2), 0));

            similarityMatrix[i][j] = dotProduct / (magnitudeA * magnitudeB);
        }
    }

    return similarityMatrix;
};

// Hàm lấy các sản phẩm gợi ý dựa trên sự tương đồng của người dùng
const getTopRecommendedProducts = (userId, userSimilarities, allRatings) => {
    const userIndex = allRatings.findIndex(rating => rating.user_id === userId);
    const similarUsers = userSimilarities[userIndex];

    const products = [...new Set(allRatings.map(rating => rating.product_id))];
    const productScores = {};

    // Dự đoán điểm đánh giá cho các sản phẩm chưa được đánh giá
    products.forEach((productId, index) => {
        if (!allRatings.some(rating => rating.user_id === userId && rating.product_id === productId)) {
            let score = 0;
            similarUsers.forEach((similarity, idx) => {
                if (similarity > 0) {
                    const similarUserRatings = allRatings.filter(rating => rating.user_id === allRatings[idx].user_id && rating.product_id === productId);
                    if (similarUserRatings.length > 0) {
                        score += similarity * similarUserRatings[0].rating;
                    }
                }
            });
            productScores[productId] = score;
        }
    });

    // Sắp xếp sản phẩm theo điểm gợi ý giảm dần
    return Object.entries(productScores).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
};

// Hàm tìm sản phẩm tương tự dựa trên các sản phẩm người dùng đã đánh giá
const findSimilarProducts = (productIds) => {
    // Ví dụ, đây có thể là một hàm tìm kiếm trong cơ sở dữ liệu hoặc các thuật toán dựa trên đặc tính của sản phẩm
    return productIds; // Tạm thời trả về chính các sản phẩm đã đánh giá
};

module.exports = { calculateUserSimilarity, getTopRecommendedProducts, findSimilarProducts };
