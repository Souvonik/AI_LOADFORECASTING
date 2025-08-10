import React, { useState, useEffect } from "react";
import Landing from "./Landing";
import WorldMapInterface from "./WorldMapInterface";
import { csv } from "d3-fetch";

const Home: React.FC = () => {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await csv("/combined_forecasts.csv");
        setForecastData(data as any[]);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchData();
  }, []);

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
          forecastData={forecastData}
        />
      )}
    </div>
  );
};

export default Home;
