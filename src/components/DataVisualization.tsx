import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface DataVisualizationProps {
  locationName?: string;
  forecastData?: any[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  locationName = "Global",
  forecastData = [],
}) => {
  const [chartType, setChartType] = useState("line");

  const chartData = forecastData?.map((d) => ({
    date: new Date(d.ds).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    demand: parseFloat(d.load_yhat_kwh) / 1000,
  }));

  return (
    <div className="w-full h-full bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden">
      <Card className="border-0 shadow-none h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {locationName} Monthly Load Demand Forecast
          </CardTitle>
          <div className="flex justify-end items-center mt-2">
            <Tabs
              defaultValue="line"
              className="w-[250px]"
              onValueChange={setChartType}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[400px] w-full">
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#f97316"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Load Demand"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="#f97316" name="Load Demand" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {chartType === "area" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="Load Demand"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;