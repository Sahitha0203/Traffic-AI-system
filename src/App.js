import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Heading from "./components/Heading";
import Body from "./components/Body";
import About from "./components/About";
import Dashboard from "./components/Dashboard"; // Make sure Dashboard is imported

const App = () => (
  <div className="min-h-screen bg-white text-black p-8">
    <Heading />
    <Routes>
      <Route path="/home" element={<Body />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
