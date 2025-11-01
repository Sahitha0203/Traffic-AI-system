from collections import deque, Counter
from datetime import datetime
import cv2
from ultralytics import YOLO

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

    def run_detection_loop(self):
        model = YOLO(self.model_path)
        cap = cv2.VideoCapture(self.video_source)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        frames_per_interval = int(self.interval_sec * fps)

        while True:
            interval_counts = []
            for _ in range(frames_per_interval):
                ret, frame = cap.read()
                if not ret:
                    break
                results = model.predict(frame, verbose=False)
                count = 0
                for box in results[0].boxes:
                    label = results[0].names[int(box.cls[0])]
                    prob = float(box.conf[0])
                    if label in self.vehicle_classes and prob >= self.conf_threshold:
                        count += 1
                interval_counts.append(count)

            if not interval_counts:
                break

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

            most_common = Counter(self.status_history).most_common(1)[0][0]
            self.current_congestion = most_common

            if len(self.avg_count_history) >= 3:
                recent = list(self.avg_count_history)[-3:]
                if recent[-1] > recent[-2] > recent[-3]:
                    self.current_trend = "INCREASING"
                elif recent[-1] < recent[-2] < recent[-3]:
                    self.current_trend = "DECREASING"
                else:
                    self.current_trend = "STABLE"
            else:
                self.current_trend = "STABLE"

            self.last_update_time = datetime.utcnow().isoformat()
        cap.release()

    def get_latest_status(self):
        return {
            "congestion": self.current_congestion,
            "trend": self.current_trend,
            "timestamp": self.last_update_time,
            "avg_count": self.current_avg_count,
            "window_history": list(self.status_history)
        }

