// URL nền mặc định
const defaultBackgroundUrl = '/img/defaut-background.jpg';

// Hàm tạo phần tử background
function createBackgroundElement(imageUrl, aspectRatio) {
    const backgroundImage = document.createElement('div');
    backgroundImage.classList.add('background-image');
    backgroundImage.style.backgroundImage = `url(${imageUrl})`;

    // Điều chỉnh hiển thị dựa trên tỷ lệ ảnh
    if (aspectRatio >= 16/9) { // Ảnh ngang (16:9 trở lên)
        backgroundImage.style.backgroundSize = 'cover';
        backgroundImage.style.backgroundPosition = 'center';
    } else { // Ảnh dọc (9:16)
        backgroundImage.style.backgroundSize = 'contain';
        backgroundImage.style.backgroundRepeat = 'repeat';
        backgroundImage.style.backgroundPosition = 'center';
    }

    return backgroundImage;
}

// Hàm phân tích độ sáng của ảnh và điều chỉnh màu chữ
function adjustTextColor(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Vẽ ảnh lên canvas với kích thước 1x1 pixel để lấy màu trung bình
    canvas.width = 1;
    canvas.height = 1;
    ctx.drawImage(img, 0, 0, 1, 1);

    // Lấy dữ liệu pixel (r, g, b) của ảnh
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

    // Tính toán độ sáng của ảnh
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

    // Lấy màu header trong chế độ dark mode
    const darkModeHeaderColor = '#333333'; // Màu header dark mode (từ CSS)

    // Điều chỉnh màu chữ và header
    if (brightness > 128) {
        // Ảnh sáng
        document.body.style.color = "#000000"; // Màu chữ tối
        document.querySelector('header').style.backgroundColor = 'rgba(255,255,255,0.8)';
    } else {
        // Ảnh tối
        document.body.style.color = "#FFFFFF"; // Màu chữ sáng
        document.querySelector('header').style.backgroundColor = darkModeHeaderColor;
    }

    // Thêm logic điều chỉnh màu cho các phần tử khác nếu cần
    const elementsToAdjust = document.querySelectorAll('.dark-mode-adjustable');
    elementsToAdjust.forEach(element => {
        if (brightness > 128) {
            element.classList.remove('dark-mode');
        } else {
            element.classList.add('dark-mode');
        }
    });
}
// Hàm để lấy màu ngược lại
function getInvertColor(hexcolor){
    // Loại bỏ dấu # nếu có
    hexcolor = hexcolor.replace("#", "");
    
    // Chuyển đổi hex sang RGB
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    
    // Tính toán độ sáng
    var brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Trả về màu đen hoặc trắng tùy thuộc độ sáng
    return brightness > 128 ? "#000000" : "#FFFFFF";
}

// Hàm cập nhật màu logo
function updateLogoColor() {
    const header = document.querySelector('.header-design');
    const logoText = document.getElementById('logo-text');
    
    // Lấy màu nền của header
    const headerBgColor = window.getComputedStyle(header).backgroundColor;
    
    // Chuyển đổi rgb sang hex
    const rgbToHex = (rgb) => {
        // Trích xuất các giá trị R, G, B từ chuỗi rgb
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        
        // Chuyển đổi sang hex
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const headerHexColor = rgbToHex(headerBgColor);
    
    // Lấy màu ngược lại
    const invertColor = getInvertColor(headerHexColor);
    
    // Áp dụng màu cho logo
    logoText.style.color = invertColor;
}

// Gọi hàm khi trang tải
document.addEventListener('DOMContentLoaded', updateLogoColor);

// Gọi hàm khi chuyển đổi chế độ tối/sáng
const darkModeToggle = document.getElementById('toggle-dark-mode');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', updateLogoColor);
}
// Hàm xử lý thay đổi ảnh nền
function handleBackgroundChange(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            // Tính tỷ lệ ảnh
            const aspectRatio = img.width / img.height;

            // Xóa background cũ nếu có
            const oldBackground = document.querySelector('.background-image');
            if (oldBackground) {
                oldBackground.remove();
            }

            // Tạo background mới
            const backgroundElement = createBackgroundElement(imageUrl, aspectRatio);
            document.body.appendChild(backgroundElement);

            // Điều chỉnh màu chữ
            adjustTextColor(img);

            // Lưu ảnh vào localStorage
            localStorage.setItem('backgroundImage', imageUrl);
            localStorage.setItem('backgroundAspectRatio', aspectRatio);

            resolve();
        };
        img.onerror = reject;
        img.src = imageUrl;
    });
}

// Sự kiện thay đổi ảnh nền khi người dùng chọn file
document.getElementById("background-input").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            handleBackgroundChange(e.target.result)
                .catch(error => {
                    console.error("Lỗi khi tải ảnh:", error);
                    alert("Không thể tải ảnh. Vui lòng thử lại.");
                });
        };
        reader.readAsDataURL(file);
    }
});

// Khôi phục ảnh nền từ localStorage khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    const savedBackground = localStorage.getItem('backgroundImage');
    const savedAspectRatio = localStorage.getItem('backgroundAspectRatio');

    if (savedBackground) {
        handleBackgroundChange(savedBackground)
            .catch(error => {
                console.error("Lỗi khi khôi phục ảnh nền:", error);
                // Nếu không thể khôi phục, sử dụng ảnh mặc định
                handleBackgroundChange(defaultBackgroundUrl);
            });
    }
});

// Hàm reset nền về ảnh mặc định
function resetBackground() {
    handleBackgroundChange(defaultBackgroundUrl)
        .then(() => {
            // Xóa thông tin đã lưu
            localStorage.removeItem('backgroundImage');
            localStorage.removeItem('backgroundAspectRatio');
        })
        .catch(error => {
            console.error("Lỗi khi reset ảnh nền:", error);
        });
}

// CSS cần thiết (có thể đặt trong file CSS riêng)
const style = document.createElement('style');
style.textContent = `
.background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-position: center;
}
`;
document.head.appendChild(style);