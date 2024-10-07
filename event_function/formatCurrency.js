function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); 
}
function calculateTotal() {
    var total = 0;
    const quantities = document.querySelectorAll('.quantity');
    const selectedProducts = []; 

    document.querySelectorAll('input.product-checkbox').forEach((checkbox, index) => {
        if (checkbox.checked) {
            const quantityInput = quantities[index];
            if (quantityInput) {
                const price = parseFloat(quantityInput.getAttribute('data-price')) || 0;
                const qty = parseInt(quantityInput.value) || 0;
                total += qty * price;

                const productId = quantityInput.id.split('_')[1]; 
                selectedProducts.push({ productId, quantity: qty }); 
            }
        }
    });

    document.getElementById('totalAmount').textContent = formatCurrency(total) + " VNĐ";
    return selectedProducts; 
}

function addEventListeners() {
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('change', calculateTotal);
        input.addEventListener('input', calculateTotal);
    });

    document.querySelectorAll('input.product-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
}

// Gọi addEventListeners khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners(); // Gán sự kiện cho các input và checkbox
    calculateTotal(); // Tính toán tổng ban đầu
});
    document.querySelectorAll('.quantity').forEach(input => {
    input.addEventListener('input', function() {
        const maxQuantity = parseInt(this.getAttribute('max'));
        const enteredValue = parseInt(this.value);

        // Kiểm tra giá trị hợp lệ
        if (isNaN(enteredValue)) {
            this.value = '';
            return; // Dừng lại nếu không phải là số
        }

        // Nếu giá trị nhập vào lớn hơn giá trị tối đa
        if (enteredValue > maxQuantity) {
            this.value = maxQuantity; // Đặt lại giá trị
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo!',
                text: `Số lượng tối đa là ${maxQuantity}`,
                confirmButtonText: 'OK'
            });
        }
    });
});