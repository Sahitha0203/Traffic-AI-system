const About = () => {
  return (
    <div>
      {/* 🎯 IMPORTANT: pt-24 ensures the content starts below the fixed header */}
      <div className="pt-24 pb-16 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Title and Tagline */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Our Core Project Focus
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            The Traffic Congestion Detection System leverages cutting-edge AI
            for real-time traffic intelligence.
          </p>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="flashcard-base border-t-4 border-blue-600 hover:shadow-lg">
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                🚦 Real-time Traffic Analysis
              </h3>
              <p className="text-gray-700">
                Utilizes AI (YOLOv8) to analyze video feeds and instantly detect
                vehicle counts and congestion levels.
              </p>
            </div>

            <div className="flashcard-base border-t-4 border-indigo-600 hover:shadow-lg">
              <h3 className="text-xl font-bold text-indigo-600 mb-3">
                🗺️ Centralized Dashboard
              </h3>
              <p className="text-gray-700">
                Displays all camera statuses on a live, geotagged map, providing
                a clear overview of the entire traffic network.
              </p>
            </div>

            <div className="flashcard-base border-t-4 border-green-600 hover:shadow-lg">
              <h3 className="text-xl font-bold text-green-600 mb-3">
                ☁️ Modern & Scalable Tech
              </h3>
              <p className="text-gray-700">
                Built with a scalable FastAPI backend, a responsive React
                frontend, and hosted on reliable AWS cloud services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
