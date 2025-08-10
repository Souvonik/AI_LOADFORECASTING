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
  PanelLeftClose,
  PanelRightClose,
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
import { DatePicker } from "./ui/date-picker";
import { Globe } from "./magicui/globe";
import DecryptedText from "./DecryptedText";
import TextType from "./magicui/TextType";
import RotatingText from "./magicui/rotating-text";

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
  onPredictionResult: (data: any) => void;
}

const WorldMapInterface: React.FC<WorldMapInterfaceProps> = ({
  isVisible = true,
  onClose = () => console.log("Close map interface"),
  onPredictionResult,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>("globe");
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date("2025-04-15")
  );

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
  const handleRegionSelect = async (city: any) => {
    setIsLoading(true);
    setSelectedRegion(city.city);
    setIsSidebarCollapsed(false);

    if (!selectedDate) {
      console.error("No date selected");
      // Optionally, show a message to the user to select a date
      setIsLoading(false);
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district: city.city,
          date: formattedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      onPredictionResult(data); // Pass prediction to parent
      setSelectedCityData({
        demandLoad: data.load,
        energyPrice: data.price,
      });
    } catch (error) {
      console.error("Error fetching prediction:", error);
      // Handle error state in UI
    } finally {
      setIsLoading(false);
    }
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
        {hasInteracted && (
          <motion.div
            className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
            variants={itemVariants}
          >
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">YKO.AI</h1>
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
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button
                   variant="outline"
                   size="icon"
                   onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                 >
                   {isSidebarCollapsed ? (
                     <PanelLeftClose className="h-4 w-4" />
                   ) : (
                     <PanelRightClose className="h-4 w-4" />
                   )}
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>
                   {isSidebarCollapsed ? "Show sidebar" : "Collapse sidebar"}
                 </p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
          </div>
        </motion.div>
       )}

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map visualization */}
          <motion.div className="flex-1 relative" variants={itemVariants}>
            <Tabs value={activeView} onValueChange={setActiveView} className="h-full">

              <TabsContent value="globe" className="h-full">
                <div
                  className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background pb-40 pt-8 md:pb-60"
                >
                  <div className="w-1/3 flex flex-col items-start justify-center text-left pl-10">
                    <TextType
                      text="YKO.AI"
                      as="h1"
                      className="text-5xl md:text-7xl font-extrabold text-black"
                      typingSpeed={100}
                      loop={false}
                    />
                    <TextType
                      text="Turn sunlight into steady earnings with accurate solar revenue predictions. Stay informed with real-time power demand updates tailored to your location. Plan your energy future smarter with AI-powered insights."
                      as="p"
                      className="text-lg md:text-xl font-medium text-black mt-4"
                      typingSpeed={40}
                      initialDelay={1000}
                      loop={false}
                    />
                  </div>
                  <div
                    className="w-1/3 h-full cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      setActiveView("map");
                      setHasInteracted(true);
                    }}
                  >
                    <Globe className="top-28" />
                    <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
                  </div>
                  <div className="w-1/3 flex items-center justify-center text-black text-5xl font-bold">
                    <div className="flex flex-row items-center">
                      <span className="mr-4">Smart</span>
                      <RotatingText
                        texts={["Energy", "Planning", "Insights", "Future"]}
                        splitBy="words"
                        mainClassName="bg-black text-white p-2 rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                  <DecryptedText
                    text="Click the globe to see the map"
                    animateOn="hover"
                    className="text-black dark:text-white font-medium"
                  />
                </div>
              </TabsContent>

              <TabsContent value="map" className="h-full">
                <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {/* Flat map visualization with GeoJSON layer */}
                  <div className="absolute bottom-4 left-4 z-[1000]">
                    <Button
                      onClick={() => {
                        setActiveView("globe");
                        setHasInteracted(false);
                      }}
                    >
                      Back to Globe
                    </Button>
                  </div>
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
          {hasInteracted && (
           <motion.div
             className={`border-l border-gray-200 dark:border-gray-800 transition-all duration-300 ${
               isSidebarCollapsed ? "w-0" : "w-[500px]"
             }`}
             variants={itemVariants}
             initial={{ width: isSidebarCollapsed ? 0 : 500 }}
             animate={{ width: isSidebarCollapsed ? 0 : 500 }}
           >
            <DataSidebar
              regionName={selectedRegion}
              isLoading={isLoading}
              onRefresh={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              demandLoad={selectedCityData?.demandLoad}
              energyPrice={selectedCityData?.energyPrice}
            />
            </motion.div>
          )}
        </div>

        
      </div>
      <AICopilot />
    </motion.div>
  );
};

export default WorldMapInterface;
