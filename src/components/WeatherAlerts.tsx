import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Wind, AlertTriangle } from "lucide-react";

interface WeatherAlert {
  id: string;
  station: string;
  condition: "sunny" | "rainy" | "cloudy" | "stormy";
  severity: "low" | "medium" | "high";
  impact: string;
  delayEstimate?: string;
}

interface WeatherAlertsProps {
  route: {
    from: string;
    to: string;
  } | null;
}

export default function WeatherAlerts({ route }: WeatherAlertsProps) {
  const weatherAlerts: WeatherAlert[] = [
    {
      id: "1",
      station: "Vadodara Junction (BRC)",
      condition: "rainy",
      severity: "medium",
      impact: "Moderate rainfall causing signal restrictions. Speed limit reduced to 75 km/h",
      delayEstimate: "15-20 min"
    },
    {
      id: "2",
      station: "Mathura Junction (MTJ)",
      condition: "stormy",
      severity: "high",
      impact: "Heavy thunderstorm with 45 km/h winds. Visibility reduced to 500m affecting train operations",
      delayEstimate: "30-45 min"
    },
    {
      id: "3",
      station: "Agra Cantt (AGC)",
      condition: "cloudy",
      severity: "low",
      impact: "Overcast skies with light fog. Normal operations maintained",
    },
    {
      id: "4",
      station: "Gwalior Junction (GWL)",
      condition: "sunny",
      severity: "low",
      impact: "Clear weather conditions. All trains running on schedule",
    }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case "stormy":
        return <Wind className="h-4 w-4 text-purple-500" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge variant="secondary" className="bg-success text-success-foreground">Low Impact</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Medium Impact</Badge>;
      case "high":
        return <Badge variant="destructive">High Impact</Badge>;
      default:
        return null;
    }
  };

  if (!route) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a route to see weather conditions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Weather Alerts & Impact
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Weather conditions along {route.from} → {route.to} route
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {weatherAlerts.map((alert) => (
          <div key={alert.id} className="border border-border rounded-lg p-4 bg-background/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getWeatherIcon(alert.condition)}
                <h4 className="font-semibold">{alert.station}</h4>
              </div>
              {getSeverityBadge(alert.severity)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{alert.impact}</p>
            
            {alert.delayEstimate && (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-warning font-medium">
                  Expected Delay: {alert.delayEstimate}
                </span>
              </div>
            )}
          </div>
        ))}
        
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-xs text-muted-foreground">
            * Weather predictions are updated every 30 minutes and may affect train schedules.
            Check live tracking for real-time updates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}