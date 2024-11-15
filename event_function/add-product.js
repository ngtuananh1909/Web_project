$(document).on('click', '.addToCartBtn', function() {
    const productId = $(this).data('product-id');
    $('#addToCartModal').modal('show');

    $('.confirmAddToCartBtn').off('click').on('click', function() {
        $.ajax({
            url: '/cart/add', 
            method: 'POST',
            data: { productId: productId },
            success: function(response) {
                alert('Sản phẩm đã được thêm vào giỏ hàng!');
                $('#addToCartModal').modal('hide');
            },
            error: function() {
                alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        });
    });
  });