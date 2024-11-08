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
        reader.readAsDataURL(imageInput.files[0]);
    }
}

// Lắng nghe sự kiện thay đổi cho các trường
document.getElementById('name').addEventListener('input', updatePreview);
document.getElementById('price').addEventListener('input', updatePreview);
document.getElementById('quantity').addEventListener('input', updatePreview);
document.getElementById('saleval').addEventListener('input', updatePreview);
document.getElementById('sale').addEventListener('change', updatePreview);
document.getElementById('image').addEventListener('change', updatePreview);

// Sự kiện cho Quill editor
quill.on('text-change', function() {
    updatePreview(); // Cập nhật preview mỗi khi nội dung thay đổi
});

// Khởi tạo preview ban đầu
document.addEventListener('DOMContentLoaded', function() {
    updatePreview(); // Cập nhật preview khi trang được tải
});

// Xử lý form submit
document.getElementById('product-form').onsubmit = function() {
    // Lưu nội dung của Quill vào trường ẩn
    const description = quill.root.innerHTML;
    document.getElementById('description').value = description;
};

// Hàm toggle sale value
function toggleSaleValue() {
    const saleValueContainer = document.getElementById('sale-value-container');
    const saleCheckbox = document.getElementById('sale');
    
    if (saleCheckbox.checked) {
        saleValueContainer.style.display = 'block';
    } else {
        saleValueContainer.style.display = 'none';
    }
    
    updatePreview();
}

// Giới hạn giá trị sale
document.getElementById('saleval').addEventListener('input', function () {
    let value = parseInt(this.value);
    if (value > 99) {
        this.value = 99;
    } else if (value < 1) {
        this.value = 1;
    }
    updatePreview();
});