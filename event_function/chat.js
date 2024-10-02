const socket = io(); // Kết nối tới Socket.io

// Chọn bạn bè và hiển thị ô chat
function selectFriend(friendName) {
    document.getElementById('chat-header').innerText = friendName;
    document.getElementById('chat-body').style.display = 'block';
    document.getElementById('messages').innerHTML = ''; // Xóa tin nhắn cũ

    // Tạo sự kiện nhận tin nhắn cho bạn bè được chọn
    socket.on(friendName, function(message) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<div>${message}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống dưới
    });
}

// Nhận tin nhắn từ server
socket.on('message', function(data) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div>${data.message}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống dưới
});

// Gửi tin nhắn khi nhấn Enter
document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const message = this.value;
        const friendName = document.getElementById('chat-header').innerText;

        // Gửi tin nhắn tới server
        socket.emit('message', { to: friendName, message: message });
        this.value = ''; // Xóa ô nhập
    }
});

// Hiện ô chat
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
