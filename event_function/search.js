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

  // Khi nhấn vào icon search
  searchIcon.addEventListener('click', function () {
    searchContainer.classList.add('search-active');
  });

  // Khi nhấn vào nút cancel
  cancelIcon.addEventListener('click', function () {
    searchContainer.classList.remove('search-active');
  });