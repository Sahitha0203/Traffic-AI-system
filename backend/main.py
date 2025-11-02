# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
from model import CongestionMonitor # Assumes model.py is in the same directory


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # This correctly allows your frontend to fetch
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ CRITICAL: Double-check these paths on your system!
congestion_monitor = CongestionMonitor(
    model_path="yolov8n.pt",
    video_source=r"D:\Traffic AI system website\backend\myfirstproject\1721294-hd_1920_1080_25fps.mp4",
    conf_threshold=0.5,
    interval_sec=5,
    smooth_window=6
)


async def detection_loop():
    while True:
        # The detect_once function in model.py now has error handling
        congestion_monitor.detect_once()
        await asyncio.sleep(5) # Sleep for 5 seconds


@app.on_event("startup")
async def startup_event():
    # This creates the background task that continuously calls detect_once
    asyncio.create_task(detection_loop())


@app.get("/status")
def get_status():
    # This API endpoint is what the frontend calls
    return JSONResponse(content=congestion_monitor.get_latest_status())





