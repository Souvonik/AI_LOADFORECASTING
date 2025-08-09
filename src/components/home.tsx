import React, { useState, useEffect } from "react";
import Landing from "./Landing";
import WorldMapInterface from "./WorldMapInterface";

const Home: React.FC = () => {
  const [showMap, setShowMap] = useState<boolean>(false);

  const handleTryNowClick = () => {
    setShowMap(true);
  };

  const handlePredictionResult = (data: any) => {
    console.log("Prediction data received in Home:", data);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {!showMap && <Landing onTryNowClick={handleTryNowClick} />}
      {showMap && (
        <WorldMapInterface
          isVisible={true}
          onPredictionResult={handlePredictionResult}
        />
      )}
    </div>
  );
};

export default Home;
