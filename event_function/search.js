function validateForm(event) {
    const queryInput = document.querySelector('input[name="query"]');
    if (!queryInput.value.trim()) {
        event.preventDefault(); 
        alert("Vui lòng nhập một từ khóa tìm kiếm."); 
    }
}