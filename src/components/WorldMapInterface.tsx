import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DataSidebar from "./DataSidebar";
//import TimeControls from "./TimeControls";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AICopilot from "./AICopilot";

// Fix default marker icon issues in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


interface WorldMapInterfaceProps {
  isVisible?: boolean;
  onClose?: () => void;
  selectedDate: string;
  onPredictionResult: (data: any) => void;
}

const WorldMapInterface: React.FC<WorldMapInterfaceProps> = ({
  isVisible = true,
  onClose = () => console.log("Close map interface"),
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>("globe");
  const globeRef = useRef<HTMLDivElement>(null);

  // New state for selected date (default value; later integrate with TimeControls)
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-15");

  const [statesGeoJson, setStatesGeoJson] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCityData, setSelectedCityData] = useState<any>(null);

  useEffect(() => {
    // Fetch GeoJSON for all Indian states
    fetch("/Indian_States.geojson")
      .then((res) => res.json())
      .then((data) => setStatesGeoJson(data))
      .catch((error) => console.error("Error loading Indian States GeoJSON:", error));

    // Fetch Indian cities data
    fetch("/Indian_Cities.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error loading Indian Cities data:", error));
  }, []);

  // Modified: Now makes a backend call when a marker is clicked
  const handleRegionSelect = (city: any) => {
    setIsLoading(true);
    setSelectedRegion(city.city);

    // Generate synthetic data
    const syntheticData = {
      demandLoad: Math.floor(Math.random() * 50) + 50, // 50-100
      energyPrice: Math.random() * 0.1 + 0.1, // 0.10-0.20
    };

    setSelectedCityData(syntheticData);

    setTimeout(() => setIsLoading(false), 500);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTimeChange = (time: Date) => {
    console.log("Time changed:", time);
    // Optionally update selectedDate if TimeControls changes it
  };

  const handleSpeedChange = (speed: number) => {
    console.log("Animation speed changed:", speed);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for child elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed inset-0 bg-white dark:bg-gray-950 ${isFullscreen ? "z-50" : "z-40"}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="h-full flex flex-col">
        {/* Header with controls */}
        <motion.div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center" variants={itemVariants}>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Back to Landing
            </Button>
            <h1 className="text-xl font-bold">Energy Load Forecasting Map</h1>
            <select
              className="ml-4 p-2 border rounded-md bg-white dark:bg-gray-800"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All">All States</option>
              {[...new Set(cities.map(city => city.state))].sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setActiveView(activeView === "globe" ? "map" : "globe")}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle view mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map visualization */}
          <motion.div className="flex-1 relative" variants={itemVariants}>
            <Tabs value={activeView} onValueChange={setActiveView} className="h-full">
              <TabsList className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <TabsTrigger value="globe">3D Globe</TabsTrigger>
                <TabsTrigger value="map">Flat Map</TabsTrigger>
              </TabsList>

              <TabsContent value="globe" className="h-full">
                <div
                  ref={globeRef}
                  className="w-full h-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* Replace with actual 3D globe visualization */}
                  <div className="relative w-[500px] h-[500px] rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden">
                    <div className="absolute top-[20%] left-[15%] w-[20%] h-[30%] bg-green-300 dark:bg-green-700 opacity-80"></div>
                    <div className="absolute top-[25%] left-[40%] w-[25%] h-[20%] bg-green-300 dark:bg-green-700 opacity-80"></div>
                    <div className="absolute top-[55%] left-[30%] w-[15%] h-[20%] bg-green-300 dark:bg-green-700 opacity-80"></div>
                    <div className="absolute top-[60%] left-[70%] w-[15%] h-[15%] bg-green-300 dark:bg-green-700 opacity-80"></div>

                    {/* Example: Displaying district markers on the 3D globe */}
                    {/* City markers will be rendered on the flat map for better accuracy */}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="map" className="h-full">
                <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {/* Flat map visualization with GeoJSON layer */}
                  <MapContainer center={[22.3511148, 78.6677428]} zoom={5} style={{ width: "100%", height: "100%" }}>
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {statesGeoJson && (
                      <GeoJSON
                        data={statesGeoJson}
                        style={() => ({
                          color: "#3388ff",
                          weight: 2,
                          fillOpacity: 0.1,
                        })}
                      />
                    )}
                    {cities && cities.length > 0 && cities
                      .filter(city => selectedState === "All" || city.state === selectedState)
                      .map((city) => {
                        if (city.latitude && city.longitude) {
                          return (
                            <Marker
                              key={city.city}
                              position={[city.latitude, city.longitude]}
                              eventHandlers={{
                                click: () => handleRegionSelect(city),
                              }}
                            >
                              <Popup>{city.city}</Popup>
                            </Marker>
                          );
                        }
                        return null;
                      })}
                  </MapContainer>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Data sidebar */}
          <motion.div className="w-[350px] border-l border-gray-200 dark:border-gray-800" variants={itemVariants}>
            <DataSidebar
              regionName={selectedRegion}
              isLoading={isLoading}
              onRefresh={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              onExport={() => console.log("Exporting data for", selectedRegion)}
              onFilterChange={(filter) => console.log("Filter changed:", filter)}
              demandLoad={selectedCityData?.demandLoad}
              energyPrice={selectedCityData?.energyPrice}
            />
          </motion.div>
        </div>

        
      </div>
      <AICopilot />
    </motion.div>
  );
};

export default WorldMapInterface;
