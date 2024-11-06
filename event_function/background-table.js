const defaultBackgroundUrl = '/img/defaut-background.jpg'; // URL nền mặc định

// Hàm thay đổi nền khi người dùng chọn ảnh mới
document.getElementById("background-input").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const aspectRatio = img.width / img.height;
                const tableElement = document.querySelector(".table");

                // Nếu ảnh có tỷ lệ gần 9:16, điều chỉnh lại theo tỷ lệ 16:9
                if (aspectRatio < 1) { // Tỷ lệ dọc, tức là 9:16
                    tableElement.style.backgroundSize = "auto 100%";
                } else { // Tỷ lệ ngang, tức là gần 16:9
                    tableElement.style.backgroundSize = "cover";
                }

                // Đặt ảnh nền
                tableElement.style.backgroundImage = `url(${e.target.result})`;
                tableElement.style.backgroundPosition = "center"; // Căn giữa để cắt phần thừa

                // Phân tích độ sáng của hình nền để điều chỉnh màu chữ
                adjustTextColor(img, tableElement);
            };
        };
        reader.readAsDataURL(file);
    }
});

// Hàm phân tích độ sáng của ảnh và điều chỉnh màu chữ
function adjustTextColor(img, element) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Tạo một canvas với kích thước nhỏ hơn để tiết kiệm tài nguyên
    canvas.width = 1;
    canvas.height = 1;

    // Vẽ ảnh lên canvas
    ctx.drawImage(img, 0, 0, 1, 1);

    // Lấy dữ liệu pixel (r, g, b) của ảnh
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    // Tính toán độ sáng của ảnh (theo công thức luminance)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

    // Nếu độ sáng cao, dùng màu chữ tối; nếu độ sáng thấp, dùng màu chữ sáng
    if (brightness > 128) {
        element.style.color = "#000000"; // Màu chữ tối
    } else {
        element.style.color = "#FFFFFF"; // Màu chữ sáng
    }
}

// Hàm reset nền và màu chữ về mặc định
function resetBackground() {
    const tableElement = document.querySelector(".table");
    tableElement.style.backgroundImage = `url(${defaultBackgroundUrl})`;
    tableElement.style.backgroundSize = "cover"; // Đặt về mặc định là cover
    tableElement.style.backgroundPosition = "center"; // Đặt lại căn giữa
    tableElement.style.color = "#000000"; // Màu chữ mặc định (có thể thay đổi tùy ý)
}
