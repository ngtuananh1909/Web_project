$(document).ready(function () {
    $('.viewProductBtn').click(function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết

        const productId = $(this).data('product-id');
        const score = $(this).data('product-score'); // Điểm số đánh giá

        // Gửi yêu cầu thêm đánh giá
        $.post('/add-rating', { product_id: productId, score: score }, function (response) {
            if (response.success) {
                // Nếu thêm đánh giá thành công, chuyển đến trang chi tiết sản phẩm
                window.location.href = `/product/${productId}`;
            } else {
                alert('Có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại.');
            }
        });
    });
});
