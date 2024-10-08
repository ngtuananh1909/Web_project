document.getElementById("register").addEventListener("click", function() {
    window.location.href = "/register";
  });

  // Xử lý chuyển đổi giữa form đăng ký và đăng nhập
  const signUpButton = document.getElementById('register');
  const signInButton = document.getElementById('login');
  const container = document.getElementById('container');

  // Thêm sự kiện chuyển đổi khi nhấn nút "Sign Up"
  signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
  });

  // Thêm sự kiện chuyển đổi khi nhấn nút "Sign In"
  signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
  });

  // Xử lý khi nhấn nút "Sign Up"
  document.querySelector('.sign-up form button').addEventListener('click', (e) => {
      e.preventDefault();
      // Lấy thông tin từ input
      const name = document.querySelector('.sign-up input[placeholder="Name"]').value;
      const email = document.querySelector('.sign-up input[placeholder="Email"]').value;
      const password = document.querySelector('.sign-up input[placeholder="Password"]').value;

      if (name && email && password) {
          alert('Account created successfully!\nName: ' + name + '\nEmail: ' + email);
      } else {
          alert('Please fill in all fields to sign up.');
      }
  });

  // Xử lý khi nhấn nút "Sign In"
  document.querySelector('.sign-in form button').addEventListener('click', (e) => {
      e.preventDefault();
      // Lấy thông tin từ input
      const email = document.querySelector('.sign-in input[placeholder="Email"]').value;
      const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

      if (email && password) {
          alert('Logged in successfully!\nEmail: ' + email);
      }
      if (!email || !password) {
          alert('You password or name not true, try again');
      }
      else {
          alert('Please fill in all fields to sign in.');
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

  // Xử lý khi nhấn nút "Sign In"
  document.querySelector('.sign-in form button').addEventListener('click', (e) => {
      e.preventDefault();
      // Lấy thông tin từ input
      const email = document.querySelector('.sign-in input[placeholder="Email"]').value;
      const password = document.querySelector('.sign-in input[placeholder="Password"]').value;
      const errorMessage = document.getElementById('error-message');

      // Kiểm tra điều kiện đăng nhập
      if (email === "example@example.com" && password === "password123") { // Thay thế bằng điều kiện thật
          alert('Logged in successfully!\nEmail: ' + email);
          errorMessage.style.display = "none"; // Ẩn thông báo lỗi
      } else {
          errorMessage.textContent = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
          errorMessage.style.display = "block"; // Hiển thị thông báo lỗi
      }
  });

      function showCustomAlert(message) {
          var alertBox = document.getElementById('custom-alert');
          var alertMessage = document.getElementById('alert-message');
          var okButton = document.getElementById('alert-ok-btn');
          var blurBackground = document.getElementById('blur-background');

          alertMessage.innerText = message;
          alertBox.style.display = 'block';
          blurBackground.style.display = 'block';

          okButton.onclick = function() {
              alertBox.style.display = 'none';
              blurBackground.style.display = 'none';
          };
      }

      showCustomAlert("Đây là thông báo của bạn!");