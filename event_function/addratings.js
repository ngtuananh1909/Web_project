$(document).ready(function() {
    $('.viewProductBtn').click(function(event) {
        event.preventDefault(); 

        const productId = $(this).data('product-id');
        const score = $(this).data('product-score'); 

        $.post('/add-rating', { product_id: productId, score: score }, function(response) {
            if (response.success) {
                window.location.href = `/product/${productId}`;
            } else {
                alert('Có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại.');
            }
        });
    });
});