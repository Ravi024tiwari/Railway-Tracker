import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, MapPin, Clock, Zap, AlertCircle, CloudRain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RouteVisualizationProps {
  route: {
    from: string;
    to: string;
  };
  trains: any[];
}

export default function RouteVisualization({ route, trains }: RouteVisualizationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ontime":
      case "running":
      case "moving":
        return "bg-success";
      case "delayed":
        return "bg-warning";
      case "cancelled":
        return "bg-destructive";
      case "stationary":
        return "bg-muted-foreground";
      default:
        return "bg-primary";
    }
  };

  // Calculate train positions based on their progress
  const getTrainPosition = (index: number, total: number) => {
    // Distribute trains evenly along the route
    const spacing = 100 / (total + 1);
    return (index + 1) * spacing;
  };

  // Calculate distance between trains
  const getDistanceBetweenTrains = (currentIndex: number) => {
    if (currentIndex === 0) return null;
    const currentPos = getTrainPosition(currentIndex, trains.length);
    const prevPos = getTrainPosition(currentIndex - 1, trains.length);
    const totalDistance = parseInt(trains[0]?.distance || "1000");
    const distanceKm = Math.round((currentPos - prevPos) * totalDistance / 100);
    return `${distanceKm} km`;
  };

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Live Route Map
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {route.from} → {route.to}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative">
          {/* Route Line */}
          <div className="relative h-32 mb-8">
            {/* Track Background */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full transform -translate-y-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"></div>
            </div>
            
            {/* Start Station Marker */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg"></div>
                <span className="text-xs font-medium mt-2 whitespace-nowrap">{route.from.split('(')[0].trim()}</span>
              </div>
            </div>
            
            {/* End Station Marker */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg"></div>
                <span className="text-xs font-medium mt-2 whitespace-nowrap">{route.to.split('(')[0].trim()}</span>
              </div>
            </div>

            {/* Trains on Route */}
            <TooltipProvider>
              {trains.map((train, index) => {
                const position = getTrainPosition(index, trains.length);
                const distanceFromPrevious = getDistanceBetweenTrains(index);
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all hover:scale-125"
                        style={{ left: `${position}%` }}
                      >
                        <div className="relative flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full ${getStatusColor(train.status)} flex items-center justify-center shadow-lg border-2 border-background animate-pulse-dot`}>
                            <Train className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-bold mt-1 bg-background px-2 py-0.5 rounded-full border shadow-sm">
                            T{index + 1}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      className="w-80 p-4 bg-background border-2 shadow-xl"
                    >
                      <div className="space-y-3">
                        {/* Train Header */}
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <h4 className="font-bold text-lg">{train.number}</h4>
                            <p className="text-sm text-muted-foreground">{train.name}</p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={train.status === "cancelled" ? "bg-destructive text-destructive-foreground" : ""}
                          >
                            {train.status === "ontime" ? "On Time" : train.status.charAt(0).toUpperCase() + train.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Distance Info */}
                        {distanceFromPrevious && (
                          <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span><strong>{distanceFromPrevious}</strong> ahead of T{index}</span>
                          </div>
                        )}

                        {/* Current and Next Station */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Current Station</p>
                            <p className="font-medium">{train.nextStation?.split('(')[0] || "En Route"}</p>
                            <p className="text-xs text-muted-foreground">{train.nextStationDistance}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Next Station ETA</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <p className="font-medium">{train.nextStationETA}</p>
                            </div>
                          </div>
                        </div>

                        {/* Timing Info */}
                        <div className="grid grid-cols-2 gap-3 text-sm bg-muted/50 p-2 rounded">
                          <div>
                            <p className="text-xs text-muted-foreground">Departure</p>
                            <p className="font-medium">{train.departure}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Arrival</p>
                            <p className="font-medium">{train.arrival}</p>
                          </div>
                        </div>

                        {/* Duration & Distance */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium">{train.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Distance</p>
                            <p className="font-medium">{train.distance}</p>
                          </div>
                        </div>

                        {/* Weather Impact */}
                        {train.weatherImpact && (
                          <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 p-2 rounded text-sm">
                            <CloudRain className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-warning mb-1">Weather Alert</p>
                              <p className="text-xs">{train.weatherImpact}</p>
                            </div>
                          </div>
                        )}

                        {/* Class & Price */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant="outline">{train.class}</Badge>
                          <span className="text-lg font-bold text-primary">{train.price}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-8 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-xs">On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-xs">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-xs">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <span className="text-xs">Stationary</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
