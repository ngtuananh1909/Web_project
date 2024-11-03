import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

export async function loadAndPreprocessImage(imagePath) {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);
    return tf.browser.fromPixels(canvas);
}
