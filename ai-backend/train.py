from ultralytics import YOLO

model = YOLO("yolov8n-seg.pt")

model.train(
    data="data.yaml",
    epochs=50,
    imgsz=640,
    batch=4,
    device="cpu",
    workers=0,
    patience=15,
    augment=True,
    mosaic=0.3,
    mixup=0.1,
    degrees=5,
    scale=0.3,
    translate=0.1,
    name="pothole-final"
)

print("Training Finished")