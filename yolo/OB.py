from ultralytics import YOLO

def detect_objects(image_path):
    model = YOLO("yolov10x.pt")  # Sử dụng YOLOv10x
    results = model(image_path)   # Phát hiện đối tượng trong ảnh
    return results.pandas().xyxy[0].to_dict(orient="records")  # Trả về kết quả
