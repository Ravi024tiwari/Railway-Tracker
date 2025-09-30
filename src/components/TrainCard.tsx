import { Clock, MapPin, AlertTriangle, CheckCircle, Wifi, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrainCardProps {
  train: {
    number: string;
    name: string;
    departure: string;
    arrival: string;
    duration: string;
    distance: string;
    status: "ontime" | "delayed" | "cancelled";
    delay?: string;
    price: string;
    class: string;
    amenities: string[];
    nextStation?: string;
    nextStationDistance?: string;
    weatherImpact?: string;
  };
}

export default function TrainCard({ train }: TrainCardProps) {
  const getStatusBadge = () => {
    switch (train.status) {
      case "ontime":
        return <Badge variant="secondary" className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          On Time
        </Badge>;
      case "delayed":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Delayed {train.delay}
        </Badge>;
      case "cancelled":
        return <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>;
      default:
        return null;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3 w-3" />;
      case "food":
        return <Utensils className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary">
            {train.number} - {train.name}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-lg">{train.departure}</span>
            </div>
            <p className="text-sm text-muted-foreground">Departure</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-lg">{train.arrival}</span>
            </div>
            <p className="text-sm text-muted-foreground">Arrival</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Duration: <strong>{train.duration}</strong></span>
          <span>Distance: <strong>{train.distance}</strong></span>
        </div>

        {train.nextStation && (
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-medium">Next Station: {train.nextStation}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Distance: {train.nextStationDistance}
            </p>
          </div>
        )}

        {train.weatherImpact && (
          <div className="bg-warning/10 border border-warning/20 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="font-medium text-warning">Weather Alert</span>
            </div>
            <p className="text-sm text-muted-foreground">{train.weatherImpact}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {train.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{train.class}</p>
            <p className="text-lg font-bold text-primary">{train.price}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}