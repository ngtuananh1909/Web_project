
  var form = document.getElementById('product-form');
  form.onsubmit = function() {
    var descriptionInput = document.getElementById('description');
    descriptionInput.value = quill.root.innerHTML;
  };

  function toggleSaleValue() {
    var saleCheckbox = document.getElementById('sale');
    var saleValueContainer = document.getElementById('sale-value-container');
    if (saleCheckbox.checked) {
      saleValueContainer.style.display = 'block';
    } else {
      saleValueContainer.style.display = 'none';
    }
  }
  // Cập nhật thông tin preview
  function updatePreview() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const saleCheckbox = document.getElementById('sale');
    const saleValue = document.getElementById('saleval').value;

    
    // Hiển thị giá trị sale nếu checkbox được chọn
    const salePreview = document.getElementById('preview-sale');
    if (saleCheckbox.checked && saleValue) {
      salePreview.style.display = 'block';
      salePreview.textContent = 'Sale Value: ' + saleValue + '%';
    } else {
      salePreview.style.display = 'none';
    }
  }

  // Hàm bật/tắt trường sale
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

  // Lắng nghe sự kiện thay đổi
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
