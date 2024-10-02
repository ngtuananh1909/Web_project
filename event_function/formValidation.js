function validateForm(event) {
    const queryInput = document.querySelector('input[name="query"]');
    if (!queryInput.value.trim()) {
        event.preventDefault(); // Ngăn chặn gửi biểu mẫu
        alert("Vui lòng nhập một từ khóa tìm kiếm."); // Hiển thị thông báo
    }
}
