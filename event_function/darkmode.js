document.addEventListener("DOMContentLoaded", function () {
  const toggleDarkMode = document.getElementById("toggle-dark-mode");
  const modeLabel = document.getElementById("mode-label");

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