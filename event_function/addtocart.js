$(document).on('click', '.addToCartBtn', function() {
    const productId = $(this).data('product-id');
    $('#addToCartModal').data('product-id', productId).modal('show');
});


$('.confirmAddToCartBtn').on('click', function() {
    const productId = $('#addToCartModal').data('product-id');
    $.ajax({
        type: 'POST',
        url: '/auth/add-to-cart',
        data: { productId: productId },
        success: function(response) {
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
            $('#addToCartModal').modal('hide');
        },
        error: function() {
            alert('Đã có lỗi xảy ra, vui lòng thử lại!');
        }
    });
});