// Khởi tạo Quill editor
var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
        ]
    }
});

// Hàm cập nhật preview
function updatePreview() {
    // Cập nhật tên sản phẩm
    const name = document.getElementById('name').value;
    document.getElementById('preview-name').textContent = name || 'Name';

    // Cập nhật giá
    const price = document.getElementById('price').value;
    document.getElementById('preview-price').textContent = `Price: ${price || 0} VND`;

    // Cập nhật số lượng
    const quantity = document.getElementById('quantity').value;
    document.getElementById('preview-quantity').textContent = `Quantity: ${quantity || 0}`;

    // Cập nhật mô tả từ Quill editor
    const description = quill.root.innerHTML;
    document.getElementById('description').value = description; // Lưu vào trường ẩn
    document.getElementById('preview-description').innerHTML = description || 'Description';

    // Cập nhật sale
    const saleCheckbox = document.getElementById('sale');
    const saleValue = document.getElementById('saleval').value;
    const salePreview = document.getElementById('preview-sale');

    if (saleCheckbox.checked && saleValue) {
        salePreview.style.display = 'block';
        salePreview.textContent = `Sale Value: ${saleValue}%`;
    } else {
        salePreview.style.display = 'none';
    }

    // Cập nhật hình ảnh preview
    const imageInput = document.getElementById('image');
    const previewImage = document.getElementById('preview-image');
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        }
    };

    // Form submission validation
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Ngăn form submit mặc định

        // Set giá trị mặc định cho sale
        if (saleCheckbox.checked) {
            if (!saleValueInput.value || saleValueInput.value.trim() === "") {
                saleValueInput.value = "0";
            }
        } else {
            // Nếu checkbox không được chọn, set giá trị là null hoặc 0
            saleValueInput.value = "0";
        }

        // Validate các trường bắt buộc khác
        if (!nameInput.value || !priceInput.value || !quantityInput.value || !imageInput.files[0] || !descriptionInput.value) {
            alert("Please fill in all required fields");
            return;
        }

        // Nếu mọi thứ ok, submit form
        form.submit();
    });

    // Initialize preview
    updatePreview();
};

document.addEventListener('DOMContentLoaded', function() {
    const descriptionInput = document.getElementById('description-input');
    const infoDescription = document.getElementById('info-description');

    descriptionInput.addEventListener('input', function() {
        infoDescription.textContent = this.value;
    });
});
// Helper function to format currency
function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
let editor;
