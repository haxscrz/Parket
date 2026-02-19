import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Wallet,
  Plus,
  MapPin,
  MessageCircle,
  CreditCard,
  Bell,
  Settings,
  Navigation,
  Clock,
  Star,
  Zap,
  History,
  QrCode
} from "lucide-react";
import { PeakHoursChart } from "./PeakHoursChart";
import { BestTimeSuggestions } from "./BestTimeSuggestions";
import { HistoricalTrendsAnimation } from "./HistoricalTrendsAnimation";

interface HomeScreenProps {
  onNavigateToParking: () => void;
  onNavigateToProfile: () => void;
  onNavigateToWallet: () => void;
  onNavigateToNotifications: () => void;
  darkMode?: boolean;
}

export function HomeScreen({
  onNavigateToParking,
  onNavigateToProfile,
  onNavigateToWallet,
  onNavigateToNotifications,
  darkMode,
}: HomeScreenProps) {
  const locations = [
    { name: "SM Dasmarinas", price: "₱25/hr", distance: "2.1 km", rating: 4.5, availability: 45 },
    { name: "Mall of Asia", price: "₱35/hr", distance: "5.8 km", rating: 4.8, availability: 12 },
    { name: "Glorietta 3", price: "₱40/hr", distance: "3.2 km", rating: 4.6, availability: 23 },
    { name: "Ayala Malls Pasay", price: "₱30/hr", distance: "4.5 km", rating: 4.4, availability: 67 },
    { name: "St. Luke's Hospital", price: "₱20/hr", distance: "1.8 km", rating: 4.3, availability: 89 },
    { name: "Waltermart", price: "₱15/hr", distance: "3.7 km", rating: 4.2, availability: 156 },
  ];

  const paymentMethods = [
    { name: "Maya", color: "bg-green-500" },
    { name: "GCash", color: "bg-blue-500" },
    { name: "GoTyme", color: "bg-purple-500" }
  ];

  const quickActions = [
    { icon: History, label: "History", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { icon: MessageCircle, label: "Support", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    { icon: QrCode, label: "QR Scanner", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
    { icon: Settings, label: "Settings", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
                <div className="text-primary-foreground font-bold text-xl">P</div>
              </div>
              <div>
                <h1 className="font-bold text-lg">Good morning, Hans!</h1>
                <p className="text-primary-foreground/80 text-sm">Ready to park smart?</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-primary-foreground hover:bg-primary-foreground/10"
                onClick={onNavigateToNotifications}
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 border-0" />
              </Button>
            </div>
          </div>

          {/* E-Wallet Balance */}
          <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">E-Wallet Balance</p>
                  <h2 className="text-3xl font-bold">₱2,350.50</h2>
                </div>
                <Wallet className="w-8 h-8 text-primary-foreground/60" />
              </div>

              <Button
                onClick={onNavigateToWallet}
                className="w-full mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl h-11"
              >
                <Plus className="w-4 h-4 mr-2" />
                Top-up E-Wallet
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* ML-Powered Insights Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">AI Parking Insights</h2>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-0 text-xs">
              ML-Powered
            </Badge>
          </div>
          
          {/* Best Time Suggestions */}
          <BestTimeSuggestions 
            location="SM Dasmarinas" 
            darkMode={darkMode}
          />
          
          {/* Peak Hours Chart */}
          <PeakHoursChart 
            location="SM Dasmarinas"
            darkMode={darkMode}
          />

          {/* Historical Trends Animation */}
          <HistoricalTrendsAnimation
            location="SM Dasmarinas"
            darkMode={darkMode}
          />
        </div>

        {/* Quick Top-up */}
        <Card className="bg-card border-border">
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Quick Top-up</h3>
            <div className="flex gap-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.name}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border text-foreground hover:bg-accent flex-1"
                >
                  <div className={`w-3 h-3 rounded-full ${method.color} mr-2`} />
                  {method.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* RFID Registration */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Get your Parket-RFID</h3>
                <p className="text-white/80 text-sm">Fast lane access to all parking areas</p>
              </div>
              <Button
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                Order Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Parking Button */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                <Navigation className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Find Parking</h3>
                <p className="text-muted-foreground">Discover available spots near you</p>
              </div>
              <Button
                onClick={onNavigateToParking}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Locations
              </Button>
            </div>
          </div>
        </Card>

        {/* Popular Locations */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Popular Locations</h3>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {locations.slice(0, 3).map((location) => (
                <div
                  key={location.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  onClick={onNavigateToParking}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{location.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{location.distance}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{location.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">{location.price}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {location.availability} spots
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Button variant="ghost" className="flex flex-col gap-1 py-2 px-4">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            </div>
            <span className="text-xs text-foreground font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 py-2 px-4"
            onClick={onNavigateToParking}
          >
            <Navigation className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Parking</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 py-2 px-4"
            onClick={onNavigateToWallet}
          >
            <Wallet className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Wallet</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col gap-1 py-2 px-4"
            onClick={onNavigateToProfile}
          >
            <div className="w-6 h-6 bg-muted rounded-full" />
            <span className="text-xs text-muted-foreground">Profile</span>
          </Button>
        </div>
      </div>

      {/* Bottom padding for fixed navigation */}
      <div className="h-20" />
    </div>
  );
}