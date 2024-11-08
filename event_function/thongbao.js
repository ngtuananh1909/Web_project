document.getElementById('notificationDropdown').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    const notificationMenu = document.getElementById('notificationMenu');
    // Chuyển đổi hiển thị của menu thông báo
    if (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') {
        notificationMenu.style.display = 'block'; // Hiện menu
    } else {
        notificationMenu.style.display = 'none'; // Ẩn menu
    }
});