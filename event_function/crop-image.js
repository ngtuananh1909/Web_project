// Preview Image và Crop
function previewImage(event) {
    const preview = document.getElementById('preview-image');
    const cropperImage = document.getElementById('cropper-image');
    const cropperContainer = document.getElementById('cropper-container');
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            cropperImage.src = e.target.result;
            cropperContainer.style.display = 'block';  // Hiển thị phần crop ảnh
        };
        reader.readAsDataURL(file);
    }
}

// Crop Image
document.getElementById('crop-button').addEventListener('click', function() {
    const cropperImage = document.getElementById('cropper-image');
    // Thực hiện crop ảnh ở đây
    // Sau khi crop, bạn có thể thay đổi src của 'preview-image' thành ảnh đã crop
});

// Hiển thị Sale Value
function toggleSaleValue() {
    const saleCheckbox = document.getElementById('sale');
    const saleValueContainer = document.getElementById('sale-value-container');
    const previewSale = document.getElementById('preview-sale');

    if (saleCheckbox.checked) {
        saleValueContainer.style.display = 'block';
        previewSale.style.display = 'block';
    } else {
        saleValueContainer.style.display = 'none';
        previewSale.style.display = 'none';
    }
}
