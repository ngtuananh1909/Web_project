document.getElementById('credit_card').addEventListener('click', function() {
    document.getElementById('creditCardDetails').classList.remove('d-none');
});

document.getElementById('cash').addEventListener('click', function() {
    document.getElementById('creditCardDetails').classList.add('d-none');
});
const div = document.getElementById('dynamic-text');
    const adjustFontSize = () => {
        const width = div.clientWidth;
        const newSize = Math.max(20, width / 10); // Điều chỉnh theo ý muốn
        div.style.fontSize = `${newSize}px`;
    };
    
    // Điều chỉnh kích thước khi tải trang
    window.onload = adjustFontSize;
    // Điều chỉnh kích thước khi thay đổi kích thước cửa sổ
    window.onresize = adjustFontSize;