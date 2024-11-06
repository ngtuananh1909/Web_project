document.addEventListener('DOMContentLoaded', function() {
    const saleInput = document.getElementById('sale');
    const saleValueInput = document.getElementById('saleval');
    const saleValueContainer = document.getElementById('sale-value-container');

    // Hàm toggleSaleValue
    function toggleSaleValue() {
      const saleCheckbox = document.getElementById('sale');
      const saleValueContainer = document.getElementById('sale-value-container');
      const salevalInput = document.getElementById('saleval');
      
      if (saleCheckbox.checked) {
        saleValueContainer.style.display = 'block';
        salevalInput.required = true;
      } else {
        saleValueContainer.style.display = 'none';
        salevalInput.required = false;
        salevalInput.value = '';
      }
      updatePreview(); // Make sure this function exists in preview.js
    }

    document.getElementById('sale').addEventListener('change', toggleSaleValue);

    // Gán sự kiện cho sale checkbox
    saleInput.addEventListener('change', toggleSaleValue);

    // Gán sự kiện cho sale value input
    saleValueInput.addEventListener('input', function() {
        const saleCheckbox = document.getElementById('sale');
        if (this.value && saleCheckbox.checked) {
            updatePreview(); // Cập nhật preview khi có giá trị
        }
    });

    // Khởi tạo
    toggleSaleValue(); // Để đảm bảo trạng thái ban đầu đúng
});