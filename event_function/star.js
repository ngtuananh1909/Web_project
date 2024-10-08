const stars = document.querySelectorAll('.stars input[type="radio"]');
    const commentDiv = document.getElementById('comment');

    const comments = {
        1: 'Tệ',
        2: 'Gần tệ',
        3: 'Trung bình',
        4: 'Tốt',
        5: 'Rất tốt'
    };

    stars.forEach(star => {
        star.addEventListener('change', () => {
            // Bỏ qua các sao đã chọn trước đó
            stars.forEach(s => {
                s.nextElementSibling.style.color = 'lightgray'; // Reset màu cho tất cả sao
            });

            // Thay đổi màu cho sao được chọn
            for (let i = 0; i < star.value; i++) {
                stars[i].nextElementSibling.style.color = 'gold'; // Màu vàng cho các sao đã chọn
            }

            // Cập nhật bình luận dựa trên số sao đã chọn
            commentDiv.textContent = comments[star.value];
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const stars = document.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('filled'); // Tô màu vàng cho các sao được chọn
                    } else {
                        s.classList.remove('filled'); // Các sao còn lại không được tô màu
                    }
                });
            });
        });
    });
    
    