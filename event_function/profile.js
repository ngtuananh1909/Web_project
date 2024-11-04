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
editModal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    var field = button.getAttribute('data-bs-field');
    var closestRow = button.closest('.row');
    var textMutedElement = closestRow ? closestRow.querySelector('.alpha') : null; // Sử dụng class phù hợp
    var value = textMutedElement ? textMutedElement.innerText : ''; // Gán giá trị rỗng nếu không tìm thấy

    var modalTitle = editModal.querySelector('.modal-title');
    var modalInput = editModal.querySelector('#editField');
    var fieldNameInput = editModal.querySelector('#fieldName');

    modalTitle.textContent = 'Edit ' + field.charAt(0).toUpperCase() + field.slice(1);
    modalInput.value = value;
    fieldNameInput.value = field;
});

  function saveChanges() {
  var field = document.getElementById('fieldName').value;
  var value = document.getElementById('editField').value;
  console.log('Field:', field); // In ra để kiểm tra
  console.log('Value:', value); // In ra để kiểm tra
  if (!field || !value) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
  }

  fetch('/update-user-field', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field: field, value: value })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Cập nhật giá trị hiển thị trên giao diện
          const displayField = document.querySelector(`[data-field="${field}"]`);
          if (displayField) {
              displayField.innerText = value; // Cập nhật giá trị hiển thị
          }
          // Đóng modal
          var modal = bootstrap.Modal.getInstance(editModal);
          modal.hide();
      } else {
          console.error('Error saving changes:', data.message);
          alert('Đã xảy ra lỗi khi lưu thay đổi.');
      }
  })
  .catch(error => {
      console.error('Fetch error:', error);
      alert('Đã xảy ra lỗi khi gửi yêu cầu.');
  });
}
  function showTab(tabId) {
      document.getElementById('myProduct').classList.add('hidden');
      document.getElementById('boughtProduct').classList.add('hidden');
      
      document.getElementById(tabId).classList.remove('hidden');
  }