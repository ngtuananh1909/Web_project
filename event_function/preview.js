document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("product-form");
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const imageInput = document.getElementById("image");
    const saleCheckbox = document.getElementById("sale");
    const saleHidden = document.getElementById("saleHidden");
    const saleValueInput = document.getElementById("saleval");
    const descriptionInput = document.getElementById("description");

    function updatePreview() {
        // Cập nhật preview name
        document.getElementById("preview-name").textContent = nameInput.value || "Product Name";
        
        // Cập nhật preview price
        document.getElementById("preview-price").textContent = 
            `Price: ${priceInput.value ? formatCurrency(priceInput.value) : "0"} VND`;
        
        // Cập nhật preview quantity
        document.getElementById("preview-quantity").textContent = 
            `Quantity: ${quantityInput.value || "0"}`;

        // Cập nhật preview sale
        const previewSale = document.getElementById("preview-sale");
        if (saleCheckbox.checked && saleValueInput.value) {
            previewSale.style.display = "block";
            previewSale.textContent = `Sale Value: ${saleValueInput.value}%`;
            saleHidden.value = "1";
        } else {
            previewSale.style.display = "none";
            saleHidden.value = "0";
        }

        // Cập nhật preview description
        document.getElementById("preview-description").textContent = 
            descriptionInput.value || "Description";
    }

    // Add event listeners
    nameInput.addEventListener("input", updatePreview);
    priceInput.addEventListener("input", updatePreview);
    quantityInput.addEventListener("input", updatePreview);
    descriptionInput.addEventListener("input", updatePreview);
    saleCheckbox.addEventListener("change", updatePreview);
    saleValueInput.addEventListener("input", updatePreview);

    // Preview image when selected
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("preview-image").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

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
});
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

ClassicEditor
    .create(document.querySelector('#editor'))
    .then(newEditor => {
        editor = newEditor;
        
        // Lắng nghe sự kiện thay đổi trong editor
        editor.model.document.on('change:data', () => {
            // Cập nhật nội dung cho input hidden
            document.querySelector('#description').value = editor.getData();
            
            // Cập nhật preview
            document.querySelector('#preview-description').innerHTML = editor.getData();
        });
    })
    .catch(error => {
        console.error(error);
    });