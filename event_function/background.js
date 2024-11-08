document.getElementById('background-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            localStorage.setItem('backgroundImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Khôi phục ảnh nền từ localStorage khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
    }
});

function resetBackground() {
    document.body.style.backgroundImage = 'none';
    localStorage.removeItem('backgroundImage');
}
window.onload = function () {
    const imgElement = document.createElement('img');
    imgElement.src = 'path/to/your/image.jpg'; // Đường dẫn đến ảnh của bạn

    imgElement.onload = function () {
        const width = imgElement.width;
        const height = imgElement.height;

        const aspectRatio = width / height; // Tính tỷ lệ

        const body = document.body;
        const backgroundImage = document.createElement('div');
        backgroundImage.classList.add('background-image');

        // Kiểm tra tỷ lệ ảnh
        if (aspectRatio > 1.77) { // 16:9 ~ 1.77
            backgroundImage.style.backgroundImage = `url('${imgElement.src}')`;
        } else {
            backgroundImage.style.backgroundImage = `url('${imgElement.src}')`;
            backgroundImage.classList.add('repeat'); // Thêm lớp để lặp lại
        }

        body.appendChild(backgroundImage);
    };
};window.onload = function () {
    const imgElement = document.createElement('img');
    imgElement.src = 'path/to/your/image.jpg'; // Đường dẫn đến ảnh của bạn

    imgElement.onload = function () {
        const width = imgElement.width;
        const height = imgElement.height;

        const aspectRatio = width / height; // Tính tỷ lệ

        const body = document.body;
        const backgroundImage = document.createElement('div');
        backgroundImage.classList.add('background-image');

        // Kiểm tra tỷ lệ ảnh
        if (aspectRatio > 1.77) { // 16:9 ~ 1.77
            backgroundImage.style.backgroundImage = `url('${imgElement.src}')`;
        } else {
            backgroundImage.style.backgroundImage = `url('${imgElement.src}')`;
            backgroundImage.classList.add('repeat'); // Thêm lớp để lặp lại
        }

        body.appendChild(backgroundImage);
    };
};