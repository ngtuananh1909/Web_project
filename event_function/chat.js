const socket = io(); // Kết nối tới Socket.io

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

    document.getElementById('message-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = this.value;
            const friendName = document.getElementById('chat-header').innerText;

            // Gửi tin nhắn tới server
            socket.emit('message', { to: friendName, message: message });
            this.value = ''; // Xóa ô nhập
        }
    });

    // Nhận tin nhắn từ server
    socket.on('message', function(data) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<div>${data.message}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống dưới
    });