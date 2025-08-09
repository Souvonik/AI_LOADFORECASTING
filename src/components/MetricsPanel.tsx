import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { AlertTriangle, Zap, Battery, Gauge, DollarSign } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import RenewableEnergy from "./RenewableEnergy";

interface MetricsPanelProps {
  regionName?: string;
  demandLoad?: number;
  energyPrice?: number;
}

const MetricsPanel = ({
  regionName = "Global",
  demandLoad = 78,
  energyPrice = 0.14,
}: MetricsPanelProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-md dark:bg-gray-800 overflow-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>{regionName} Energy Metrics</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <AlertTriangle
                    size={18}
                    className="text-amber-400"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current risk assessment for the region</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demand Load */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              <span className="text-sm font-medium">Load Demand</span>
            </div>
            <span className="text-sm font-bold">{demandLoad}%</span>
          </div>
          <Progress value={demandLoad} className="h-2" />
          <p className="text-xs text-gray-500">
            Current energy consumption relative to capacity
          </p>
        </div>


        {/* Energy Price */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Energy Price</span>
            </div>
            <span className="text-sm font-bold">
              ${energyPrice.toFixed(2)}/kWh
            </span>
          </div>
          <Progress
            value={Math.min((energyPrice / 0.3) * 100, 100)}
            className="h-2 [&>div]:bg-blue-500"
          />
          <p className="text-xs text-gray-500">
            Current average electricity price per kilowatt-hour
          </p>
        </div>

        <RenewableEnergy energyPrice={energyPrice} />

        <div className="pt-2 text-xs text-gray-400 italic">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsPanel;
