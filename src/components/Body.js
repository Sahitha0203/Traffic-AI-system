import bgVideo from "../4372788-uhd_3840_2024_24fps.mp4";
const Body = () => (
  <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
    {/* Video Background */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
    >
      <source src={bgVideo} type="video/mp4" />
    </video>
    {/* Overlay for readability */}
    <div className="relative z-10 flex flex-col items-start justify-center h-full px-12 bg-black/40">
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
