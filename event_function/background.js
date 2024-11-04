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

                // Nếu ảnh có tỷ lệ gần 9:16, điều chỉnh lại theo tỷ lệ 16:9
                if (aspectRatio < 1) { // Tỷ lệ dọc, tức là 9:16
                    document.body.style.backgroundSize = "auto 100%";
                } else { // Tỷ lệ ngang, tức là gần 16:9
                    document.body.style.backgroundSize = "cover";
                }

                // Đặt ảnh nền
                document.body.style.backgroundImage = `url(${e.target.result})`;
                document.body.style.backgroundPosition = "center"; // Căn giữa để cắt phần thừa
            };
        };
        reader.readAsDataURL(file);
    }
});

// Hàm reset nền về ảnh mặc định
function resetBackground() {
    document.body.style.backgroundImage = `url(${defaultBackgroundUrl})`;
    document.body.style.backgroundSize = "cover"; // Đặt về mặc định là cover
    document.body.style.backgroundPosition = "center"; // Đặt lại căn giữa
}
