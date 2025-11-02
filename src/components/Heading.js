import { LOGO_URL } from "../../utils/constant";
import { useState } from "react";
import { Link } from "react-router-dom";

const Heading = () => {
  let [btnName, setBtnName] = useState("Login");
  return (
    <div className="fixed top-0 left-0 w-full flex items-center bg-white px-4 py-2 shadow-lg">
      <div className="w-20 p-2 m-2">
        <img src={LOGO_URL} alt="Logo" />
      </div>
      <div className="nav-items ml-auto">
        <ul className="flex p-0 m-0 text-black items-center gap-2">
          <li className="p-2">
            <Link to="/home">Home</Link>
          </li>
          <li className="p-2">
            <Link to="/about">About</Link>
          </li>
          <li className="p-2">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="p-2">
            <Link to="/map-view">Map view</Link>
          </li>
          <li className="p-2">
            <Link to="/upload">Upload</Link>
          </li>
          <li className="p-2">
            <button
              className="login"
              onClick={() => {
                setBtnName("Logout");
              }}
            >
              {btnName}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Heading;
