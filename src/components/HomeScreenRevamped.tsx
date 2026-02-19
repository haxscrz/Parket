import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  Wallet,
  Plus,
  MapPin,
  MessageCircle,
  Bell,
  Navigation,
  Clock,
  Star,
  Zap,
  History,
  QrCode,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Brain,
  Activity,
  CreditCard,
  ArrowRight,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PeakHoursChart } from "./PeakHoursChart";
import { BestTimeSuggestions } from "./BestTimeSuggestions";
import { HistoricalTrendsAnimation } from "./HistoricalTrendsAnimation";

interface HomeScreenRevampedProps {
  onNavigateToParking: () => void;
  onNavigateToProfile: () => void;
  onNavigateToWallet: () => void;
  onNavigateToNotifications: () => void;
  darkMode?: boolean;
}

export function HomeScreenRevamped({
  onNavigateToParking,
  onNavigateToProfile,
  onNavigateToWallet,
  onNavigateToNotifications,
  darkMode,
}: HomeScreenRevampedProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const locations = [
    { name: "SM Dasmarinas", price: "₱25/hr", distance: "2.1 km", rating: 4.5, availability: 45, status: "available" },
    { name: "Mall of Asia", price: "₱35/hr", distance: "5.8 km", rating: 4.8, availability: 12, status: "limited" },
    { name: "Glorietta 3", price: "₱40/hr", distance: "3.2 km", rating: 4.6, availability: 23, status: "limited" },
    { name: "Ayala Malls Pasay", price: "₱30/hr", distance: "4.5 km", rating: 4.4, availability: 67, status: "available" },
  ];

  const quickActions = [
    { icon: Navigation, label: "Navigate", color: "from-blue-500 to-cyan-500", action: onNavigateToParking },
    { icon: QrCode, label: "Scan QR", color: "from-purple-500 to-pink-500", action: () => {} },
    { icon: History, label: "History", color: "from-orange-500 to-red-500", action: () => {} },
    { icon: MessageCircle, label: "Support", color: "from-green-500 to-emerald-500", action: () => {} },
  ];

  const paymentMethods = [
    { name: "Maya", balance: "₱1,250.30", color: "bg-gradient-to-br from-green-500 to-emerald-600" },
    { name: "GCash", balance: "₱850.20", color: "bg-gradient-to-br from-blue-500 to-cyan-600" },
    { name: "GoTyme", balance: "₱250.00", color: "bg-gradient-to-br from-purple-500 to-pink-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Compact Header */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Gradient Background with Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative p-4 pb-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white font-bold text-xl">P</div>
              </motion.div>
              <div>
                <h1 className="font-bold text-white text-base">Good morning, Hans!</h1>
                <p className="text-white/80 text-xs">Ready for smart parking?</p>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
                onClick={onNavigateToNotifications}
              >
                <Bell className="w-5 h-5" />
                <motion.div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
            </motion.div>
          </div>

          {/* Balance Card - Compact */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-4 h-4 text-white/80" />
                      <p className="text-white/80 text-xs font-medium">E-Wallet Balance</p>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">₱2,350.50</h2>
                    <Button
                      onClick={onNavigateToWallet}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl h-8 text-xs backdrop-blur-sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Top-up
                    </Button>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
                  >
                    <CreditCard className="w-9 h-9 text-white/90" />
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions - Horizontal Scroll */}
          <div className="mt-4 -mx-4 px-4">
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-2">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={action.action}
                      className={`flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg border-0 relative overflow-hidden group`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 2, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <action.icon className="w-6 h-6 mb-1 relative z-10" />
                      <span className="text-[10px] font-semibold relative z-10">{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </motion.div>

      {/* Main Content with Tabs */}
      <div className="px-4 -mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold text-xs"
            >
              <Target className="w-3.5 h-3.5 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold text-xs"
            >
              <Brain className="w-3.5 h-3.5 mr-1.5" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="wallet"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-semibold text-xs"
            >
              <Wallet className="w-3.5 h-3.5 mr-1.5" />
              Wallet
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Nearby Locations - Compact Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Nearby Parking
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-auto p-0 text-blue-600 dark:text-blue-400 hover:bg-transparent"
                      onClick={onNavigateToParking}
                    >
                      View All
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {locations.slice(0, 3).map((location, index) => (
                      <motion.div
                        key={location.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground text-sm mb-1">{location.name}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {location.distance}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {location.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-foreground">{location.price}</p>
                                <Badge 
                                  className={`text-[10px] mt-1 ${
                                    location.status === 'available' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  }`}
                                >
                                  {location.availability} spots
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Availability Bar */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    location.availability > 50 ? 'bg-green-500' : 
                                    location.availability > 20 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (location.availability / 200) * 100)}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                              <motion.div
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={{ x: -10 }}
                                whileHover={{ x: 0 }}
                              >
                                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigate Button */}
                  <motion.div
                    className="mt-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onNavigateToParking}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-12 font-semibold shadow-lg"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Start Navigation
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20">
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {[
                        { location: "SM Dasmarinas", time: "2 hours ago", amount: "₱50.00", duration: "2h" },
                        { location: "Mall of Asia", time: "Yesterday", amount: "₱105.00", duration: "3h" },
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{activity.location}</p>
                              <p className="text-xs text-muted-foreground">{activity.time} • {activity.duration}</p>
                            </div>
                          </div>
                          <p className="font-bold text-sm text-foreground">{activity.amount}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4 mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="ai-insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <BestTimeSuggestions 
                  location="SM Dasmarinas" 
                  darkMode={darkMode}
                />
                
                <PeakHoursChart 
                  location="SM Dasmarinas"
                  darkMode={darkMode}
                />

                <HistoricalTrendsAnimation
                  location="SM Dasmarinas"
                  darkMode={darkMode}
                />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4 mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Payment Methods
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map((method, index) => (
                      <motion.div
                        key={method.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className={`${method.color} text-white border-0 overflow-hidden cursor-pointer group`}>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-white/80 text-xs mb-1">Available Balance</p>
                                <h3 className="text-2xl font-bold">{method.balance}</h3>
                              </div>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                              >
                                <Wallet className="w-8 h-8 text-white/80" />
                              </motion.div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm">{method.name}</p>
                              <motion.div
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Top-up */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20">
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-3">Quick Top-up</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['₱100', '₱200', '₱500'].map((amount, index) => (
                        <motion.div
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl font-semibold text-sm border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          >
                            {amount}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      className="mt-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={onNavigateToWallet}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl h-11 font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Custom Amount
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Padding */}
      <div className="h-24" />
    </div>
  );
}
