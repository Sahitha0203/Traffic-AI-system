# model.py

from collections import deque, Counter
from datetime import datetime
import cv2
from ultralytics import YOLO
import logging # 👈 Added for better debugging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class CongestionMonitor:
    def __init__(self, model_path, video_source, conf_threshold=0.5, interval_sec=5, smooth_window=6):
        self.model_path = model_path
        self.video_source = video_source
        self.conf_threshold = conf_threshold
        self.interval_sec = interval_sec
        self.smooth_window = smooth_window

        self.vehicle_classes = ["car", "truck", "bus", "motorcycle"]
        self.high_thres = 10
        self.moderate_thres = 5

        self.status_history = deque(maxlen=smooth_window)
        self.avg_count_history = deque(maxlen=smooth_window)

        self.current_congestion = "LOADING"
        self.current_trend = "STABLE"
        self.current_avg_count = 0
        self.last_update_time = datetime.utcnow().isoformat()
        
        # --- Initialization with Error Handling ---
        try:
            self.model = YOLO(self.model_path)
            self.cap = cv2.VideoCapture(self.video_source)
            if not self.cap.isOpened():
                raise IOError(f"Could not open video source: {self.video_source}")
            
            fps = self.cap.get(cv2.CAP_PROP_FPS) or 30
            self.frames_per_interval = max(1, int(self.interval_sec * fps))
            logging.info(f"Monitor initialized. FPS: {fps}, Frames/Interval: {self.frames_per_interval}")

        except Exception as e:
            logging.error(f"Error during CongestionMonitor initialization: {e}")
            # Set status to ERROR so the frontend can display it
            self.current_congestion = "ERROR"
            # It's better to raise the error here, but for a stable API, log and continue
            # The API will serve 'ERROR' status until fixed.
    
    def detect_once(self):
        """
        Run YOLO only for 1 interval; do not loop forever.
        FastAPI or async event will call this repeatedly.
        """
        if self.current_congestion == "ERROR":
            logging.warning("Skipping detection due to previous initialization error.")
            return

        interval_counts = []
        try:
            for _ in range(self.frames_per_interval):
                ret, frame = self.cap.read()
                
                if not ret:
                    # If video ended or failed to read → restart
                    logging.info("Video end reached or frame read failed. Restarting video capture.")
                    self.cap.release()
                    self.cap = cv2.VideoCapture(self.video_source)
                    
                    if not self.cap.isOpened():
                         raise IOError("Failed to reopen video source.")
                    
                    ret, frame = self.cap.read()
                    if not ret: continue # Skip this interval if restart frame fails

                # --- Detection Logic ---
                results = self.model(frame, verbose=False)
                count = 0
                for box in results[0].boxes:
                    label = results[0].names[int(box.cls[0])]
                    prob = float(box.conf[0])
                    if label in self.vehicle_classes and prob >= self.conf_threshold:
                        count += 1
                interval_counts.append(count)
            
            if not interval_counts:
                logging.warning("No frames were processed in this interval.")
                return

            # --- Status Calculation Logic ---
            avg_count = round(sum(interval_counts) / len(interval_counts))
            self.current_avg_count = avg_count

            if avg_count >= self.high_thres:
                interval_status = "HIGH"
            elif avg_count >= self.moderate_thres:
                interval_status = "MODERATE"
            else:
                interval_status = "LOW"

            self.status_history.append(interval_status)
            self.avg_count_history.append(avg_count)

            # Pick most common status
            most_common = Counter(self.status_history).most_common(1)[0][0]
            self.current_congestion = most_common

            # Trend calculation
            if len(self.avg_count_history) >= 3:
                a, b, c = list(self.avg_count_history)[-3:]
                if a < b < c:
                    self.current_trend = "INCREASING"
                elif a > b > c:
                    self.current_trend = "DECREASING"
                else:
                    self.current_trend = "STABLE"
            else:
                self.current_trend = "STABLE"

            self.last_update_time = datetime.utcnow().isoformat()
            logging.info(f"Detection complete. Congestion: {self.current_congestion}, Avg Count: {self.current_avg_count}")
        
        except Exception as e:
            # Catch all exceptions during the loop
            logging.error(f"Error during detection_once: {e}")
            self.current_congestion = "ERROR_RUNTIME"
            self.last_update_time = datetime.utcnow().isoformat()


    def get_latest_status(self):
        return {
            "congestion": self.current_congestion,
            "trend": self.current_trend,
            "timestamp": self.last_update_time,
            "avg_count": self.current_avg_count,
            "window_history": list(self.status_history)
        }
