function removeFromCart(productId) {
    fetch(`/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error); 
        } else {
            alert(data.message); 
            location.reload(); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}