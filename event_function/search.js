function validateForm(event) {
    const queryInput = document.querySelector('input[name="query"]');
    if (!queryInput.value.trim()) {
        event.preventDefault(); 
        alert("Vui lòng nhập một từ khóa tìm kiếm."); 
    }
}
const searchIcon = document.getElementById('searchIcon');
  const cancelIcon = document.getElementById('cancelIcon');
  const searchContainer = document.getElementById('searchContainer');

  searchIcon.addEventListener('click', function () {
    searchContainer.classList.add('search-active');
  });

  cancelIcon.addEventListener('click', function () {
    searchContainer.classList.remove('search-active');
  });
  const searchButton = document.querySelector('.search-button');
const searchInputWrapper = document.querySelector('#searchContainer');

searchButton.addEventListener('click', (e) => {
  e.preventDefault(); // Ngăn chặn việc gửi form khi chỉ bấm vào icon
  searchInputWrapper.classList.toggle('search-active'); // Thêm/xóa lớp để mở rộng input
});
