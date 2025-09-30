import { useState } from "react";
import { Train, Navigation, AlertTriangle, Clock, MapPin, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RouteSearch from "@/components/RouteSearch";
import TrainCard from "@/components/TrainCard";
import RouteVisualization from "@/components/RouteVisualization";
import heroImage from "@/assets/railway-hero.jpg";

interface Route {
  from: string;
  to: string;
}

const Index = () => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [trains, setTrains] = useState<any[]>([]);

  // Calculate realistic distance based on route
  const getRouteData = (from: string, to: string) => {
    const routes = {
      "New Delhi (NDLS) → Mumbai Central (BCT)": { distance: "1384 km", duration: "15h 50m" },
      "Mumbai Central (BCT) → New Delhi (NDLS)": { distance: "1384 km", duration: "15h 50m" },
      "New Delhi (NDLS) → Chennai Central (MAS)": { distance: "2180 km", duration: "27h 45m" },
      "Chennai Central (MAS) → New Delhi (NDLS)": { distance: "2180 km", duration: "27h 45m" },
      "New Delhi (NDLS) → Howrah Junction (HWH)": { distance: "1441 km", duration: "17h 20m" },
      "Howrah Junction (HWH) → New Delhi (NDLS)": { distance: "1441 km", duration: "17h 20m" },
      "Mumbai Central (BCT) → Chennai Central (MAS)": { distance: "1279 km", duration: "21h 15m" },
      "Chennai Central (MAS) → Mumbai Central (BCT)": { distance: "1279 km", duration: "21h 15m" },
      "New Delhi (NDLS) → Bangalore City (SBC)": { distance: "2444 km", duration: "34h 30m" },
      "Bangalore City (SBC) → New Delhi (NDLS)": { distance: "2444 km", duration: "34h 30m" },
    };
    
    const routeKey = `${from} → ${to}`;
    return routes[routeKey] || { distance: "520 km", duration: "8h 30m" };
  };

  const handleRouteSearch = (from: string, to: string) => {
    setCurrentRoute({ from, to });
    
    const routeData = getRouteData(from, to);
    
    // Create route-specific trains for realistic variation
    const routeKey = `${from}-${to}`;
    const allTrains = [
      // Rajdhani/Premium Trains
      { number: "12951", name: "Mumbai Rajdhani Express", class: "1AC", price: "₹4,280", amenities: ["WiFi", "Food"] },
      { number: "12301", name: "Howrah Rajdhani Express", class: "1AC", price: "₹3,950", amenities: ["WiFi", "Food"] },
      { number: "12431", name: "Trivandrum Rajdhani", class: "2AC", price: "₹3,120", amenities: ["WiFi", "Food"] },
      { number: "12953", name: "August Kranti Rajdhani", class: "1AC", price: "₹4,180", amenities: ["WiFi", "Food"] },
      { number: "12809", name: "Howrah Mail Express", class: "3AC", price: "₹1,450", amenities: ["WiFi", "Food"] },
      
      // Shatabdi/Express Trains
      { number: "12002", name: "Bhopal Shatabdi Express", class: "CC", price: "₹890", amenities: ["WiFi", "Food"] },
      { number: "12028", name: "Ahmedabad Shatabdi", class: "EC", price: "₹1,240", amenities: ["WiFi", "Food"] },
      { number: "12034", name: "Chennai Shatabdi", class: "CC", price: "₹920", amenities: ["WiFi", "Food"] },
      { number: "12009", name: "Lucknow Shatabdi Express", class: "EC", price: "₹1,180", amenities: ["WiFi", "Food"] },
      
      // Duronto/Express
      { number: "12259", name: "Sealdah Duronto Express", class: "3AC", price: "₹1,680", amenities: ["WiFi", "Food"] },
      { number: "12213", name: "Yuva Express", class: "SL", price: "₹485", amenities: ["Food"] },
      { number: "12413", name: "Jammu Tawi Express", class: "3AC", price: "₹1,520", amenities: ["WiFi", "Food"] },
      { number: "12137", name: "Punjab Mail Express", class: "2AC", price: "₹2,340", amenities: ["WiFi", "Food"] },
      { number: "12625", name: "Karnataka Express", class: "3AC", price: "₹1,750", amenities: ["WiFi", "Food"] },
      
      // Superfast/Mail
      { number: "12239", name: "Begampura Express", class: "SL", price: "₹520", amenities: ["Food"] },
      { number: "12841", name: "Coromandel Express", class: "3AC", price: "₹1,620", amenities: ["WiFi", "Food"] },
      { number: "12563", name: "Bangalore Superfast", class: "2AC", price: "₹2,880", amenities: ["WiFi", "Food"] },
      { number: "12617", name: "Mangala Lakshadweep", class: "3AC", price: "₹1,580", amenities: ["Food"] },
    ];

    // Select 4-6 trains pseudo-randomly based on route
    const hashCode = routeKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const numTrains = 4 + (hashCode % 3); // 4 to 6 trains
    const startIndex = hashCode % (allTrains.length - numTrains);
    const selectedTrains = allTrains.slice(startIndex, startIndex + numTrains);

    const statuses: ("ontime" | "delayed" | "cancelled")[] = ["ontime", "ontime", "ontime", "delayed", "cancelled"];
    const weatherConditions = [
      "Heavy rainfall expected near Surat - Possible 30 min delay",
      "Fog conditions in NCR region - May cause 15-20 min delay",
      "Clear weather expected - Smooth journey ahead",
      "Thunderstorm alert near Nagpur - Minor delays expected",
      null
    ];

    const stations = [
      "Vadodara Junction (BRC)", "Surat Junction (ST)", "Vapi (VAPI)", 
      "Borivali (BVI)", "Kanpur Central (CNB)", "Lucknow Junction (LJN)",
      "Varanasi Junction (BSB)", "Mugalsarai Junction (MGS)", "Gaya Junction (GAYA)",
      "Asansol Junction (ASN)", "Durgapur (DGR)", "Burdwan Junction (BWN)"
    ];

    const mockTrains = selectedTrains.map((train, index) => {
      const stationIndex = (hashCode + index * 3) % stations.length;
      const statusIndex = (hashCode + index) % statuses.length;
      const weatherIndex = (hashCode + index * 2) % weatherConditions.length;
      
      const baseHour = 6 + (index * 3);
      const arrivalHour = baseHour + parseInt(routeData.duration.split('h')[0]);
      
      return {
        ...train,
        departure: `${String(baseHour).padStart(2, '0')}:${String(15 + index * 10).padStart(2, '0')}`,
        arrival: `${String(arrivalHour % 24).padStart(2, '0')}:${String(25 + index * 5).padStart(2, '0')}`,
        duration: routeData.duration,
        distance: routeData.distance,
        status: statuses[statusIndex],
        delay: statuses[statusIndex] === "delayed" ? `${15 + index * 5} min` : undefined,
        weatherImpact: weatherConditions[weatherIndex] || undefined,
        nextStation: stations[stationIndex],
        nextStationDistance: `${45 + index * 20} km`,
        nextStationETA: `${String((baseHour + 2) % 24).padStart(2, '0')}:${String(30 + index * 5).padStart(2, '0')}`
      };
    });
    
    setTrains(mockTrains);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Indian Railways Live Tracker
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Advanced AI-powered railway tracking system with real-time updates, weather predictions, and smart journey optimization
          </p>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <Train className="h-8 w-8 mx-auto mb-4 text-railway" />
                <h3 className="font-semibold text-white mb-2">AI-Powered Tracking</h3>
                <p className="text-white/80 text-sm">Machine learning algorithms for precise train location prediction</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <MapPin className="h-8 w-8 mx-auto mb-4 text-railway" />
                <h3 className="font-semibold text-white mb-2">Smart Route Optimization</h3>
                <p className="text-white/80 text-sm">Dynamic route suggestions based on real-time traffic and delays</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <CloudRain className="h-8 w-8 mx-auto mb-4 text-railway" />
                <h3 className="font-semibold text-white mb-2">Weather Intelligence</h3>
                <p className="text-white/80 text-sm">Advanced meteorological analysis for journey impact assessment</p>
              </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Route Search */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Plan Your Journey</h2>
          <RouteSearch onSearch={handleRouteSearch} />
        </section>

        {currentRoute && (
          <>
            {/* Route Info */}
            <section>
              <Card className="shadow-card bg-gradient-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {currentRoute.from} → {currentRoute.to}
                      </h3>
                      <p className="opacity-90">Found {trains.length} trains on this route</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{getRouteData(currentRoute.from, currentRoute.to).distance}</p>
                      <p className="opacity-90">Total Distance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Graphical Route Visualization */}
            <RouteVisualization route={currentRoute} trains={trains} />

            {/* Train Results */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Available Trains</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {trains.map((train, index) => (
                  <TrainCard key={index} train={train} />
                ))}
              </div>
            </section>
          </>
        )}

        {!currentRoute && (
          <section className="text-center py-16">
            <Train className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Welcome to Indian Railways Live Tracker
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Experience the future of railway travel with AI-powered tracking, real-time weather intelligence, 
              and smart journey optimization for Indian Railways.
            </p>
            <Button variant="hero" size="lg">
              <Navigation className="h-4 w-4" />
              Start Planning Your Journey
            </Button>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-lg mb-2">Indian Railways Live Tracker</h3>
          <p className="text-muted-foreground">Next-Generation Railway Intelligence Platform | Powered by Advanced AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;