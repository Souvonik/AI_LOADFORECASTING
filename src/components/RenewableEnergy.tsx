import React, { useState } from 'react';
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface RenewableEnergyProps {
  energyPrice: number;
}

const RenewableEnergy = ({ energyPrice }: RenewableEnergyProps) => {
  const [panelCapacity, setPanelCapacity] = useState(5); // Default capacity in kW

  const dailyGeneration = panelCapacity * 4; // 4 kWh per day per kW capacity
  const dailySavings = dailyGeneration * energyPrice;

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Renewable Energy</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="capacity-slider">Solar Panel Capacity: {panelCapacity} kW</Label>
        </div>
        <Slider
          id="capacity-slider"
          min={1}
          max={20}
          step={1}
          value={[panelCapacity]}
          onValueChange={(value) => setPanelCapacity(value[0])}
        />
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Est. Daily Generation:</span>
          <span className="font-semibold">{dailyGeneration.toFixed(1)} kWh</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Daily Savings:</span>
          <span className="font-semibold text-green-600">${dailySavings.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default RenewableEnergy;