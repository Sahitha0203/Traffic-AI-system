// Dashboard.js

import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = "http://127.0.0.1:8000/status"; // Your FastAPI URL

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          // If the server is up but returns an HTTP error (e.g., 500)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        console.log("Full API Response:", json);

        const statusData = {
          congestion: json.congestion || "N/A",
          trend: json.trend || "N/A",
          avg_count: json.avg_count !== undefined ? json.avg_count : "N/A",
          timestamp: json.timestamp || "N/A",
          window_history: json.window_history || [],
        };

        setStatus(statusData);
        setError(null); // Clear any previous errors
      } catch (err) {
        // This catches network errors (e.g., "Fetch failed") and HTTP errors
        const errorMessage =
          "Fetching error: " +
          err.message +
          ". Check if your FastAPI server is running.";
        setError(errorMessage);
        console.error(errorMessage);
      }
    };

    // 1. Fetch immediately on component mount
    fetchStatus();

    // 2. Set up polling to update the data every 5 seconds (5000ms)
    const intervalId = setInterval(fetchStatus, 5000);

    // 3. Cleanup: Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // --- Rendering Logic ---

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid red",
          color: "red",
          backgroundColor: "#fee",
        }}
      >
        <h2>🚨 Connection Error</h2>
        <p>
          Could not fetch data from the backend. Please ensure the FastAPI
          server is running at{" "}
          <a href={API_URL} target="_blank" rel="noopener noreferrer">
            {API_URL}
          </a>
          .
        </p>
        <p>Details: {error}</p>
      </div>
    );
  }

  if (!status || status.congestion === "LOADING")
    return <div>Loading initial status...</div>;

  // Dynamic styling for visual feedback
  const getCongestionColor = (level) => {
    switch (level) {
      case "HIGH":
        return "darkred";
      case "MODERATE":
        return "orange";
      case "LOW":
        return "green";
      case "ERROR":
      case "ERROR_RUNTIME":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Traffic Congestion Dashboard 🚦</h1>
      <hr />

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: `2px solid ${getCongestionColor(status.congestion)}`,
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Current Status</h2>
        <p>
          <strong>Congestion Level: </strong>
          <span
            style={{
              color: getCongestionColor(status.congestion),
              fontWeight: "bold",
            }}
          >
            {status.congestion}
          </span>
        </p>
        <p>
          <strong>Traffic Trend: </strong>
          <span
            style={{
              color:
                status.trend === "INCREASING"
                  ? "red"
                  : status.trend === "DECREASING"
                  ? "green"
                  : "darkblue",
            }}
          >
            {status.trend}
          </span>
        </p>
        <p>
          <strong>Average Vehicle Count:</strong> {status.avg_count}
        </p>
        <p style={{ fontSize: "0.8em", color: "gray" }}>
          Last Updated (UTC): {status.timestamp}
        </p>
      </div>

      <h3>History ({status.window_history.length} most recent intervals)</h3>
      <p>
        {status.window_history.map((s, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              padding: "5px 10px",
              marginRight: "5px",
              borderRadius: "4px",
              backgroundColor:
                getCongestionColor(s) === "darkred"
                  ? "#ffdddd"
                  : getCongestionColor(s) === "orange"
                  ? "#ffeecc"
                  : "#ddffdd",
              color: getCongestionColor(s),
            }}
          >
            {s}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Dashboard;
