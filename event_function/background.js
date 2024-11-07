document.getElementById('background-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('background', file);

        fetch('/upload-background', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cập nhật background ngay lập tức
                document.body.style.backgroundImage = `url('${data.backgroundPath}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';

                // Lưu đường dẫn background vào localStorage
                localStorage.setItem('userBackground', data.backgroundPath);
            }
        })
        .catch(error => {
            console.error('Error uploading background:', error);
        });
    }
});

// Hàm reset background về mặc định
function resetBackground() {
    document.body.style.backgroundImage = 'none';
    localStorage.removeItem('userBackground');
    
    // Gọi API để xóa background đã lưu
    fetch('/reset-background', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Background reset successfully');
        }
    });
}

// Kiểm tra và áp dụng background khi trang load
document.addEventListener('DOMContentLoaded', () => {
    const savedBackground = localStorage.getItem('userBackground');
    if (savedBackground) {
        document.body.style.backgroundImage = `url('${savedBackground}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
    }
});