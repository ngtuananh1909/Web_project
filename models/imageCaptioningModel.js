import * as tf from '@tensorflow/tfjs';
import { loadAndPreprocessImage } from './utils/imageUtils.js';
import * as fs from 'fs';

// Tải tập dữ liệu
async function loadDataset() {
    const data = fs.readFileSync('./data/dataset.json');
    return JSON.parse(data);
}

// Tạo mô hình AI
async function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu', inputShape: [224, 224, 3] }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' })); // Số lớp tương ứng với nhãn của bạn
    
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    return model;
}

// Huấn luyện mô hình
async function trainModel() {
    const dataset = await loadDataset();
    const model = await createModel();
    
    const images = [];
    const labels = []; // Tạo nhãn cho các đối tượng

    for (const data of dataset) {
        const imgTensor = await loadAndPreprocessImage(`./images/${data.image}`);
        images.push(imgTensor);

        // Thêm mã để tạo nhãn từ bounding box
        const label = data.objects.map(obj => ({
            label: obj.label,
            boundingBox: obj.boundingBox
        }));
        labels.push(label);
    }

    const imageTensor = tf.stack(images);
    // Bạn cần chuyển labels sang định dạng phù hợp với mô hình

    await model.fit(imageTensor, labels, { epochs: 50 });
    await model.save('localstorage://my-model'); // Lưu mô hình
}

trainModel();
