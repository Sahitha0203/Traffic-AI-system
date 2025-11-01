import React from "react";
import ReactDOM from "react-dom/client";
import Heading from "./components/Heading";
import Body from "./components/Body";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Your main application structure
const App = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <Heading />
      {/* React Router Outlet replacement using Routes */}
      <Routes>
        <Route path="/" element={<Body />} />
        {/* Add more routes here if needed */}
      </Routes>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
