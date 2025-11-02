import { BG_URL } from "../../utils/constant";

const Body = () => (
  <div className="relative w-full min-h-screen">
    {/* Background image with rounded corners */}
    <div
      className="absolute top-0 left-0 w-full h-full bg-cover bg-center rounded-3xl -z-10"
      style={{ backgroundImage: `url(${BG_URL})` }}
    />
    {/* Overlay for readability */}
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-3xl -z-10" />
    {/* Hero content */}
    <div className="relative z-10 flex flex-col justify-center items-start min-h-screen px-12 pt-32">
      <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
        AI-Powered Traffic Congestion Detection
      </h1>
      <p className="text-lg text-white/90 mb-6 max-w-xl">
        Analyze and visualize traffic flow in real-time using intelligent video
        processing models. Our system helps modern cities reduce congestion and
        improve mobility.
      </p>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
      >
        View Dashboard
      </button>
    </div>
  </div>
);

export default Body;
