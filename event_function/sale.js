// Lấy phần tử form và lắng nghe sự kiện submit
var form = document.getElementById('product-form');
form.onsubmit = function() {
  // Lưu nội dung của trình soạn thảo Quill vào trường ẩn
  var descriptionInput = document.getElementById('description');
  descriptionInput.value = quill.root.innerHTML;
};

// Hàm cập nhật thông tin xem trước
function updatePreview() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const saleCheckbox = document.getElementById('sale');
  const saleValue = document.getElementById('saleval').value;

  // Cập nhật tên sản phẩm, giá cả, và số lượng trong phần xem trước
  document.getElementById('preview-name').textContent = name || 'Name';
  document.getElementById('preview-price').textContent = `Price: ${price || 0} VND`;
  document.getElementById('preview-quantity').textContent = `Quantity: ${quantity || 0}`;
  
  // Hiển thị giá trị sale nếu checkbox được chọn
  const salePreview = document.getElementById('preview-sale');
  if (saleCheckbox.checked && saleValue) {
    salePreview.style.display = 'block';
    salePreview.textContent = `Sale Value: ${saleValue}%`;
  } else {
    salePreview.style.display = 'none';
  }

  // Cập nhật mô tả trong phần xem trước
  document.getElementById('preview-description').textContent = document.getElementById('description-input').value || 'Description';
}

// Hàm bật/tắt trường sale và cập nhật xem trước
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

// Lắng nghe sự kiện thay đổi cho các trường
document.getElementById('name').addEventListener('input', updatePreview);
document.getElementById('price').addEventListener('input', updatePreview);
document.getElementById('quantity').addEventListener('input', updatePreview);
document.getElementById('saleval').addEventListener('input', updatePreview);
document.getElementById('sale').addEventListener('change', toggleSaleValue);

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
  updatePreview(); // Cập nhật ngay khi trang tải xong
});

// Hàm kiểm tra và giới hạn giá trị của saleval
document.getElementById('saleval').addEventListener('input', function () {
  let value = parseInt(this.value);
  if (value > 99) {
      this.value = 99;
  } else if (value < 1) {
      this.value = 1;
  }
  updatePreview(); // Cập nhật phần xem trước nếu cần
});
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
