function IdGenerator() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; ++i) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

function ProductIDGenerator() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 50; ++i) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

module.exports = { IdGenerator, ProductIDGenerator };
