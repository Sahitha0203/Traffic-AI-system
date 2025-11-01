from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import threading
from model import CongestionMonitor


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

congestion_monitor = CongestionMonitor(
    model_path="yolov8n.pt",
    video_source=r"D:\Traffic AI system website\backend\myfirstproject\1721294-hd_1920_1080_25fps.mp4",
    conf_threshold=0.5,
    interval_sec=5,
    smooth_window=6
)

@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=congestion_monitor.run_detection_loop, daemon=True)
    t.start()

@app.get("/status")
def get_status():
    return JSONResponse(content=congestion_monitor.get_latest_status())

@app.get("/signal_timings")
def get_signal_timings():
    timings = congestion_monitor.calculate_signal_timings()
    return JSONResponse(content=timings)



