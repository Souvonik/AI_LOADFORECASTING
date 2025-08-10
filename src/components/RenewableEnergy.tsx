import React, { useState } from 'react';
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface RenewableEnergyProps {
  energyPrice: number;
  regionName?: string;
  selectedDate?: Date;
}

const RenewableEnergy = ({
  energyPrice,
  regionName,
  selectedDate,
}: RenewableEnergyProps) => {
  const [panelCapacity, setPanelCapacity] = React.useState(1);

  const seasonalFactor = [
    0.8, 0.85, 0.95, 1.1, 1.2, 1.1, 1, 0.9, 0.95, 0.9, 0.85, 0.8,
  ]; // Jan-Dec
  const geographicalFactor: { [key: string]: number } = {
    Rājasthān: 1.2,
    Gujarāt: 1.15,
    Mahārāshtra: 1.1,
    Karnātaka: 1.05,
    "Andhra Pradesh": 1.05,
    Telangana: 1.05,
    "Tamil Nādu": 1,
    Kerala: 0.95,
    Odisha: 0.95,
    "West Bengal": 0.9,
    Jharkhand: 0.9,
    Bihār: 0.85,
    "Uttar Pradesh": 0.85,
    "Madhya Pradesh": 1,
    Chhattīsgarh: 0.95,
    Haryāna: 0.9,
    Punjab: 0.9,
    Uttarakhand: 0.8,
    "Himāchal Pradesh": 0.75,
    "Jammu and Kashmīr": 0.7,
    Delhi: 0.9,
    Chandīgarh: 0.9,
    Assam: 0.8,
    Tripura: 0.8,
    Mizoram: 0.8,
    Manipur: 0.8,
    Nāgāland: 0.8,
    Meghālaya: 0.75,
    Sikkim: 0.7,
    "Arunāchal Pradesh": 0.75,
    Goa: 1,
    Puducherry: 1,
    "Andaman and Nicobar Islands": 1,
    Lakshadweep: 1.1,
    default: 1,
  };

  const cityToState: { [key: string]: string } = {
    Delhi: "Delhi",
    Mumbai: "Mahārāshtra",
    Kolkāta: "West Bengal",
    Bangalore: "Karnātaka",
    Chennai: "Tamil Nādu",
    Hyderābād: "Telangana",
    Pune: "Mahārāshtra",
    Ahmadābād: "Gujarāt",
    Sūrat: "Gujarāt",
    Lucknow: "Uttar Pradesh",
    Jaipur: "Rājasthān",
    Cawnpore: "Uttar Pradesh",
    Mirzāpur: "Uttar Pradesh",
    Nāgpur: "Mahārāshtra",
    Ghāziābād: "Uttar Pradesh",
    Indore: "Madhya Pradesh",
    Vadodara: "Gujarāt",
    Visakhapatnam: "Andhra Pradesh",
    Bhopāl: "Madhya Pradesh",
    Chinchvad: "Mahārāshtra",
    Patna: "Bihār",
    Ludhiāna: "Punjab",
    Āgra: "Uttar Pradesh",
    Kalyān: "Mahārāshtra",
    Madurai: "Tamil Nādu",
    Jamshedpur: "Jharkhand",
    Nashik: "Mahārāshtra",
    Farīdābād: "Haryāna",
    Aurangābād: "Mahārāshtra",
    Rājkot: "Gujarāt",
    Meerut: "Uttar Pradesh",
    Jabalpur: "Madhya Pradesh",
    Thāne: "Mahārāshtra",
    Dhanbād: "Jharkhand",
    Allahābād: "Uttar Pradesh",
    Vārānasi: "Uttar Pradesh",
    Srīnagar: "Jammu and Kashmīr",
    Amritsar: "Punjab",
    Alīgarh: "Uttar Pradesh",
    Bhiwandi: "Mahārāshtra",
    Gwalior: "Madhya Pradesh",
    Bhilai: "Chhattīsgarh",
    Hāora: "West Bengal",
    Rānchi: "Jharkhand",
    Bezwāda: "Andhra Pradesh",
    Chandīgarh: "Chandīgarh",
    Mysore: "Karnātaka",
    Raipur: "Chhattīsgarh",
    Kota: "Rājasthān",
    Bareilly: "Uttar Pradesh",
    Jodhpur: "Rājasthān",
    Coimbatore: "Tamil Nādu",
    Dispur: "Assam",
    Guwāhāti: "Assam",
    Solāpur: "Mahārāshtra",
    Trichinopoly: "Tamil Nādu",
    Hubli: "Karnātaka",
    Jalandhar: "Punjab",
    Bhubaneshwar: "Odisha",
    Bhayandar: "Mahārāshtra",
    Morādābād: "Uttar Pradesh",
    Kolhāpur: "Mahārāshtra",
    Thiruvananthapuram: "Kerala",
    Sahāranpur: "Uttar Pradesh",
    Warangal: "Telangana",
    Salem: "Tamil Nādu",
    Mālegaon: "Mahārāshtra",
    Kochi: "Kerala",
    Gorakhpur: "Uttar Pradesh",
    Shimoga: "Karnātaka",
    Tiruppūr: "Tamil Nādu",
    Guntūr: "Andhra Pradesh",
    Raurkela: "Odisha",
    Mangalore: "Karnātaka",
    Nānded: "Mahārāshtra",
    Cuttack: "Odisha",
    Chānda: "Mahārāshtra",
    "Dehra Dūn": "Uttarakhand",
    Durgāpur: "West Bengal",
    Āsansol: "West Bengal",
    Bhāvnagar: "Gujarāt",
    Amrāvati: "Mahārāshtra",
    Nellore: "Andhra Pradesh",
    Ajmer: "Rājasthān",
    Tinnevelly: "Tamil Nādu",
    Bīkaner: "Rājasthān",
    Agartala: "Tripura",
    Ujjain: "Madhya Pradesh",
    Jhānsi: "Uttar Pradesh",
    Ulhāsnagar: "Mahārāshtra",
    Davangere: "Karnātaka",
    Jammu: "Jammu and Kashmīr",
    Belgaum: "Karnātaka",
    Gulbarga: "Karnātaka",
    Jāmnagar: "Gujarāt",
    Dhūlia: "Mahārāshtra",
    Gaya: "Bihār",
    Jalgaon: "Mahārāshtra",
    Kurnool: "Andhra Pradesh",
    Udaipur: "Rājasthān",
    Bellary: "Karnātaka",
    Sāngli: "Mahārāshtra",
    Tuticorin: "Tamil Nādu",
    Calicut: "Kerala",
    Akola: "Mahārāshtra",
    Bhāgalpur: "Bihār",
    Sīkar: "Rājasthān",
    Tumkūr: "Karnātaka",
    Quilon: "Kerala",
    Muzaffarnagar: "Uttar Pradesh",
    Bhīlwāra: "Rājasthān",
    Nizāmābād: "Telangana",
    Bhātpāra: "West Bengal",
    Kākināda: "Andhra Pradesh",
    Parbhani: "Mahārāshtra",
    Pānihāti: "West Bengal",
    Lātūr: "Mahārāshtra",
    Rohtak: "Haryāna",
    Rājapālaiyam: "Tamil Nādu",
    Ahmadnagar: "Mahārāshtra",
    Cuddapah: "Andhra Pradesh",
    Rājahmundry: "Andhra Pradesh",
    Alwar: "Rājasthān",
    Muzaffarpur: "Bihār",
    Bilāspur: "Chhattīsgarh",
    Mathura: "Uttar Pradesh",
    Kāmārhāti: "West Bengal",
    Patiāla: "Punjab",
    Saugor: "Madhya Pradesh",
    Bijāpur: "Karnātaka",
    Brahmapur: "Odisha",
    Shāhjānpur: "Uttar Pradesh",
    Trichūr: "Kerala",
    Barddhamān: "West Bengal",
    Kulti: "West Bengal",
    Sambalpur: "Odisha",
    Purnea: "Bihār",
    Hisar: "Haryāna",
    Fīrozābād: "Uttar Pradesh",
    Bīdar: "Karnātaka",
    Rāmpur: "Uttar Pradesh",
    Shiliguri: "West Bengal",
    Bāli: "West Bengal",
    Pānīpat: "Haryāna",
    Karīmnagar: "Telangana",
    Bhuj: "Gujarāt",
    Ichalkaranji: "Mahārāshtra",
    Tirupati: "Andhra Pradesh",
    Hospet: "Karnātaka",
    Āīzawl: "Mizoram",
    Sannai: "Madhya Pradesh",
    Bārāsat: "West Bengal",
    Ratlām: "Madhya Pradesh",
    Handwāra: "Jammu and Kashmīr",
    Drug: "Chhattīsgarh",
    Imphāl: "Manipur",
    Anantapur: "Andhra Pradesh",
    Etāwah: "Uttar Pradesh",
    Rāichūr: "Karnātaka",
    Ongole: "Andhra Pradesh",
    Bharatpur: "Rājasthān",
    Begusarai: "Bihār",
    Sonīpat: "Haryāna",
    Rāmgundam: "Telangana",
    Hāpur: "Uttar Pradesh",
    Uluberiya: "West Bengal",
    Porbandar: "Gujarāt",
    Pāli: "Rājasthān",
    Vizianagaram: "Andhra Pradesh",
    Puducherry: "Puducherry",
    Karnāl: "Haryāna",
    Nāgercoil: "Tamil Nādu",
    Tanjore: "Tamil Nādu",
    Sambhal: "Uttar Pradesh",
    Shimla: "Himāchal Pradesh",
    Ghāndīnagar: "Gujarāt",
    Shillong: "Meghālaya",
    "New Delhi": "Delhi",
    "Port Blair": "Andaman and Nicobar Islands",
    Gangtok: "Sikkim",
    Kohīma: "Nāgāland",
    Itānagar: "Arunāchal Pradesh",
    Panaji: "Goa",
    Damān: "Gujarāt",
    Kavaratti: "Lakshadweep",
    Bengaluru: "Karnātaka",
  };

  const state = regionName ? cityToState[regionName] : "default";
  const geoFactor = geographicalFactor[state] || 1;
  const month = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  const seasonFactor = seasonalFactor[month];

  const dailyGeneration = panelCapacity * 4 * seasonFactor * geoFactor;
  const dailySavings = dailyGeneration * (energyPrice || 0);

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Renewable Energy</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="capacity-slider">
            Solar Panel Capacity: {panelCapacity} kW
          </Label>
        </div>
        <Slider
          id="capacity-slider"
          min={1}
          max={8}
          step={1}
          value={[panelCapacity]}
          onValueChange={(value) => setPanelCapacity(value[0])}
        />
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Est. Daily Generation:</span>
          <span className="font-semibold">
            {dailyGeneration.toFixed(1)} kWh
          </span>
        </div>
        <div className="flex justify-between">
          <span>Est. Daily Savings:</span>
          <span className="font-semibold text-green-600">
            ₹{dailySavings.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RenewableEnergy;