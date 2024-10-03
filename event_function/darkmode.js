document.getElementById('chat-header').onclick = function() {
  const chatBody = document.getElementById('chat-body');
  const chatHeader = document.getElementById('chat-header');

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
