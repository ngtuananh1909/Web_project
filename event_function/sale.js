var quill = new Quill('#editor', {
    theme: 'snow'
  });
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