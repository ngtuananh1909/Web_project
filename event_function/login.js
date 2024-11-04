// Xử lý chuyển đổi giữa form đăng ký và đăng nhập
const signUpButton = document.getElementById('register');
const signInButton = document.getElementById('login');
const container = document.getElementById('container');

// Chuyển đổi giữa các form
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Hàm hiển thị thông báo
function showMessage(message, isError = false) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = isError ? "block" : "none"; // Hiển thị nếu có lỗi
}

// Xử lý khi nhấn nút "Sign Up"
document.querySelector('.sign-up form button').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.querySelector('.sign-up input[placeholder="Name"]').value;
    const email = document.querySelector('.sign-up input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-up input[placeholder="Password"]').value;

    if (name && email && password) {
        // Gửi thông tin đến server để đăng ký
        alert(`Account created successfully!\nName: ${name}\nEmail: ${email}`);
        // Gọi API hoặc xử lý đăng ký tại đây
    } else {
        showMessage('Please fill in all fields to sign up.', true);
    }
});

// Xử lý khi nhấn nút "Sign In"
document.querySelector('.sign-in form button').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.querySelector('.sign-in input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

    if (email && password) {
        // Gửi thông tin đến server để xác thực
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
            alert(`Logged in successfully!\nEmail: ${email}`);
            // Chuyển hướng hoặc xử lý sau khi đăng nhập thành công
        } else {
            showMessage(result.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.', true);
        }
    } else {
        showMessage('Please fill in all fields to sign in.', true);
    }
});

// Mã thông báo di chuyển "Welcome to E-shop"
const marqueeContainer = document.querySelector('.marquee-container div');
let offset = -700;
setInterval(() => {
    offset += 2;
    if (offset > window.innerWidth) {
        offset = -700;
    }
    marqueeContainer.style.marginLeft = `${offset}px`;
}, 50);

// Hàm đóng popup khi người dùng nhấn OK
function closePopup() {
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.style.display = 'none';
    }
}
