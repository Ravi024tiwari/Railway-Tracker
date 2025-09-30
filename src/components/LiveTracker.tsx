import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Zap, AlertCircle } from "lucide-react";

interface LiveTrackerProps {
  route: {
    from: string;
    to: string;
  } | null;
}

interface LiveTrain {
  id: string;
  number: string;
  name: string;
  currentStation: string;
  nextStation: string;
  status: "moving" | "stationary" | "delayed" | "running" | "cancelled";
  progress: number;
  estimatedArrival: string;
}

export default function LiveTracker({ route }: LiveTrackerProps) {
  const [liveTrains, setLiveTrains] = useState<LiveTrain[]>([]);

  useEffect(() => {
    if (!route) return;

    // Simulate realistic live train data
    const mockTrains: LiveTrain[] = [
      {
        id: "1",
        number: "12951",
        name: "Mumbai Rajdhani Express",
        currentStation: "Vadodara Junction (BRC)",
        nextStation: "Ratlam Junction (RTM)",
        status: "moving",
        progress: 68,
        estimatedArrival: "08:35"
      },
      {
        id: "2", 
        number: "12009",
        name: "Shatabdi Express",
        currentStation: "Mathura Junction (MTJ)",
        nextStation: "Agra Cantt (AGC)",
        status: "delayed",
        progress: 45,
        estimatedArrival: "14:40"
      },
      {
        id: "3",
        number: "12617",
        name: "Mangala Lakshadweep Express",
        currentStation: "Shoranur Junction (SRR)",
        nextStation: "Thrissur (TCR)",
        status: "moving",
        progress: 82,
        estimatedArrival: "04:25"
      },
      {
        id: "4",
        number: "12002",
        name: "New Delhi Shatabdi",
        currentStation: "Platform 1 - NDLS",
        nextStation: "Service Suspended",
        status: "stationary",
        progress: 0,
        estimatedArrival: "N/A"
      }
    ];

    setLiveTrains(mockTrains);

    // Simulate live updates
    const interval = setInterval(() => {
      setLiveTrains(prev => prev.map(train => ({
        ...train,
        progress: train.status === "moving" ? Math.min(100, train.progress + Math.random() * 5) : train.progress
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [route]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "moving":
      case "running":
        return <Zap className="h-4 w-4 text-success animate-pulse-dot" />;
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "stationary":
        return <MapPin className="h-4 w-4 text-muted-foreground" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "moving":
      case "running":
        return <Badge variant="secondary" className="bg-success text-success-foreground">Running</Badge>;
      case "delayed":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Delayed</Badge>;
      case "stationary":
        return <Badge variant="outline">At Station</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (!route) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a route to see live train tracking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary animate-pulse-dot" />
          Live Train Tracking
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trains running between {route.from} → {route.to}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {liveTrains.map((train) => (
          <div key={train.id} className="border border-border rounded-lg p-4 bg-background/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(train.status)}
                <h4 className="font-semibold">{train.number} - {train.name}</h4>
              </div>
              {getStatusBadge(train.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Station:</span>
                <span className="font-medium">{train.currentStation}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Station:</span>
                <span className="font-medium">{train.nextStation}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ETA:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{train.estimatedArrival}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(train.progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${train.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}