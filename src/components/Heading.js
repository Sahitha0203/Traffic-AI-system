import { LOGO_URL } from "../../utils/constant";
import { useState } from "react";
const Heading = () => {
  let [btnName, setBtnName] = useState("Login");
  return (
    <div className="fixed top-0 left-0 w-full flex items-center space-between bg-white-100 px-4 py-2 shadow-lg">
      <div className="w-20 p-2 m-2">
        <img src={LOGO_URL} />
      </div>
      <div className="nav-items">
        <ul className="flex p-5 m-3 text-black">
          <li className="p-2">Home</li>
          <li className="p-2">About</li>
          <li className="p-2">Dashboard</li>
          <li className="p-2">Map view</li>
          <li className="p-2">Upload</li>
          <button
            className="login"
            onClick={() => {
              setBtnName("Logout");
            }}
          >
            {btnName}
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Heading;
