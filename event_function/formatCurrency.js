function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); 
}
let selectedProducts = []

function calculateTotal() {
    var total = 0;
    const quantities = document.querySelectorAll('.quantity');
    selectedProducts = []; 

    document.querySelectorAll('input.product-checkbox').forEach((checkbox, index) => {
        if (checkbox.checked) {
            const quantityInput = quantities[index];
            if (quantityInput) {
                const price = parseFloat(quantityInput.getAttribute('data-price')) || 0;
                const qty = parseInt(quantityInput.value) || 0;

                // Cập nhật selectedProducts với thông tin mong muốn
                selectedProducts.push({
                    id: quantityInput.getAttribute('id'),  // product.id
                    quantity: qty,
                    name: quantityInput.getAttribute('data-name'), // Cần thêm data-name cho input
                    image: quantityInput.getAttribute('data-image'), // Cần thêm data-image cho input
                    price: price
                });

                total += qty * price;
            }
        }
    });

    document.getElementById('totalAmount').textContent = formatCurrency(total) + " VNĐ";
    document.getElementById('selectedProducts').value = JSON.stringify(selectedProducts);
    return selectedProducts; 
}

// Đảm bảo gọi calculateTotal khi checkbox thay đổi
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
    console.log(selectedProducts);
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
function validateCheckout(event, userId) {
    event.preventDefault();
    const selectedProducts = JSON.parse(document.getElementById('selectedProducts').value);

    const hasSelectedProducts = selectedProducts.some(product => product.quantity > 0);

    if (hasSelectedProducts) {
        // Tạo một form tạm thời để gửi dữ liệu
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/payment/option/t/${userId}`;
        form.style.display = 'none';

        // Thêm selectedProducts vào form
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selectedProducts';
        input.value = JSON.stringify(selectedProducts);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit(); // Gửi form
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo!',
            text: 'Vui lòng chọn sản phẩm với số lượng lớn hơn 0.',
            confirmButtonText: 'OK'
        });
    }
}