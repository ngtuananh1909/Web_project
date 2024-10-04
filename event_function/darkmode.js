      document.addEventListener("DOMContentLoaded", function () {
      const toggleDarkMode = document.getElementById("toggle-dark-mode");
      const modeLabel = document.getElementById("mode-label");

<<<<<<< HEAD
  chatHeader.style.display = 'none'; // Ẩn nút Chat
  chatBody.style.display = 'block'; // Hiện ô chat

  setTimeout(() => {
      chatBody.classList.add('active'); // Hiện ô chat với hiệu ứng phóng to
  }, 10); // Đảm bảo transition diễn ra
}

// Đóng ô chat
document.getElementById('close-chat').onclick = function() {
  const chatBody = document.getElementById('chat-body');
  const chatHeader = document.getElementById('chat-header');

  chatBody.classList.remove('active'); // Thu nhỏ ô chat
  setTimeout(() => {
      chatBody.style.display = 'none'; // Ẩn ô chat
      chatHeader.style.display = 'block'; // Hiện lại nút Chat
  }, 300); // Thời gian thu nhỏ
}
=======
      // Kiểm tra chế độ hiện tại từ localStorage (nếu có)
      if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleDarkMode.checked = true;
        modeLabel.textContent = "Chế Độ Dark ";
      }

      // Xử lý sự kiện khi chuyển đổi chế độ
      toggleDarkMode.addEventListener("change", function () {
        if (toggleDarkMode.checked) {
          document.body.classList.add("dark-mode");
          modeLabel.textContent = "Chế Độ Dark ";
          localStorage.setItem("darkMode", "enabled"); // Lưu trạng thái
        } else {
          document.body.classList.remove("dark-mode");
          modeLabel.textContent = "Chế Độ Sáng";
          localStorage.setItem("darkMode", "disabled"); // Lưu trạng thái
        }
      });
    });
>>>>>>> beta
