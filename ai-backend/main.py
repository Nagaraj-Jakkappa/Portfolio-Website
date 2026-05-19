from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD MODEL
# =========================
# Make sure best.pt exists inside ai-backend folder
model = YOLO("best.pt")

# Confidence threshold
CONFIDENCE_THRESHOLD = 0.15


# =========================
# HOME ROUTE
# =========================
@app.get("/")
def home():
    return {
        "success": True,
        "message": "YOLOv8 Pothole Detection API Running"
    }


# =========================
# DETECTION ROUTE
# =========================
@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    try:
        # Read image
        image_bytes = await file.read()

        # Convert image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Run YOLO prediction
        results = model.predict(
            source=image,
            conf=CONFIDENCE_THRESHOLD,
            imgsz=640,
            save=False,
            verbose=False
        )

        result = results[0]

        print("\n========== YOLO RESULTS ==========")
        print(result)

        detections = []

        # Class names
        names = result.names

        # No detections
        if result.boxes is None or len(result.boxes) == 0:
            print("NO OBJECTS DETECTED")

            return {
                "success": True,
                "count": 0,
                "detections": [],
                "message": "No potholes detected"
            }

        # Process detections
        for box in result.boxes:

            confidence = float(box.conf[0])

            # Skip low confidence detections
            if confidence < CONFIDENCE_THRESHOLD:
                continue

            class_id = int(box.cls[0])

            coords = box.xyxy[0].tolist()

            detection = {
                "confidence": round(confidence * 100, 2),
                "class_id": class_id,
                "class_name": names[class_id],
                "x1": round(coords[0], 2),
                "y1": round(coords[1], 2),
                "x2": round(coords[2], 2),
                "y2": round(coords[3], 2)
            }

            detections.append(detection)

        print("FINAL DETECTIONS:", detections)

        # Final response
        return {
            "success": True,
            "count": len(detections),
            "detections": detections,
            "message": (
                "Pothole detected"
                if len(detections) > 0
                else "No potholes detected"
            )
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "success": False,
            "error": str(e)
        }