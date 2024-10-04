document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử input và các phần tử xem trước
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const imageInput = document.getElementById("image");
    const saleInput = document.getElementById("sale");
    const saleValueInput = document.getElementById("saleval");

    const previewName = document.getElementById("preview-name");
    const previewPrice = document.getElementById("preview-price");
    const previewQuantity = document.getElementById("preview-quantity");
    const previewImage = document.getElementById("preview-image");
    const previewSale = document.getElementById("preview-sale");

    // Cập nhật xem trước tên sản phẩm
    nameInput.addEventListener("input", function () {
      previewName.textContent = nameInput.value || "Product Name";
    });

    // Cập nhật xem trước giá sản phẩm
    priceInput.addEventListener("input", function () {
      previewPrice.textContent = "Price: " + (priceInput.value ? priceInput.value + " VND" : "0 VND");
    });

    // Cập nhật xem trước số lượng sản phẩm
    quantityInput.addEventListener("input", function () {
      previewQuantity.textContent = "Quantity: " + (quantityInput.value ? quantityInput.value : "0");
    });

    // Cập nhật xem trước mô tả
    document.getElementById("description").addEventListener("input", function() {
      var description = document.getElementById("description").value;
      document.getElementById("preview-description").innerText = description;
    });

    // Cập nhật xem trước giá trị giảm giá
    saleValueInput.addEventListener("input", function () {
      previewSale.textContent = "Sale Value: " + (formatCurrency(saleValueInput.value) ? formatCurrency(saleValueInput.value) + "%" : "0%");
    });

    // Cập nhật ảnh xem trước
    imageInput.addEventListener("change", function () {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Hiện/ẩn giá trị giảm giá trong xem trước
    saleInput.addEventListener("change", function () {
      previewSale.style.display = saleInput.checked ? "block" : "none";
      if (saleInput.checked) {
        previewSale.textContent = "Sale Value: " + (saleValueInput.value ? saleValueInput.value + "%" : "0%");
      } else {
        previewSale.textContent = ""; // Ẩn giá trị giảm giá nếu không được chọn
      }
    });
  });
  // Cập nhật xem trước mô tả
  document.getElementById("editor").addEventListener("input", function () {
    var description = quill.root.innerHTML; // Lấy nội dung từ editor
    document.getElementById("preview-description").innerHTML = description; // Cập nhật mô tả xem trước
  });