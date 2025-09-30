import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface RouteSearchProps {
  onSearch: (from: string, to: string) => void;
}

const popularStations = [
  "New Delhi (NDLS)", "Mumbai Central (BCT)", "Chennai Central (MAS)", 
  "Howrah Junction (HWH)", "Bangalore City (SBC)", "Pune Junction (PUNE)",
  "Hyderabad Deccan (HYB)", "Ahmedabad Junction (ADI)", "Jaipur Junction (JP)",
  "Lucknow Junction (LJN)", "Patna Junction (PNBE)", "Bhopal Junction (BPL)",
  "Nagpur Junction (NGP)", "Guwahati (GHY)", "Trivandrum Central (TVC)",
  "Amritsar Junction (ASR)", "Varanasi Junction (BSB)", "Agra Cantt (AGC)"
];

export default function RouteSearch({ onSearch }: RouteSearchProps) {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");

  const handleSearch = () => {
    if (fromStation && toStation) {
      onSearch(fromStation, toStation);
    }
  };

  const handleSwapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              From Station
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter departure station"
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapStations}
            className="mb-2 hover:rotate-180 transition-transform duration-300"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              To Station
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter destination station"
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            variant="hero" 
            size="lg"
            className="w-full md:w-auto"
            disabled={!fromStation || !toStation}
          >
            <Search className="h-4 w-4" />
            Search Trains
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3">Popular Stations:</p>
          <div className="flex flex-wrap gap-2">
            {popularStations.map((station) => (
              <Button
                key={station}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!fromStation) {
                    setFromStation(station);
                  } else if (!toStation) {
                    setToStation(station);
                  }
                }}
                className="text-xs"
              >
                {station}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}