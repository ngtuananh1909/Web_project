import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function labelImage(imagePath) {
    try {
        const img = await loadImage(imagePath);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 30, 200, 200); // Khoanh vùng cho Dog
        ctx.strokeRect(300, 100, 100, 100); // Khoanh vùng cho Ball

        const buffer = canvas.toBuffer('image/png');
        
        fs.writeFileSync('./detect/d_image.png', buffer); // Lưu ảnh đã khoanh vùng
        console.log('Image has been saved.');
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

labelImage('img/quanminhnigga.png'); 
