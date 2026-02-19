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
    { name: "SM Dasmarinas", price: "₱25-35", distance: "2.1 km", rating: 4.5, availability: 45, status: "available" },
    { name: "Mall of Asia", price: "₱30-40", distance: "5.8 km", rating: 4.8, availability: 12, status: "limited" },
    { name: "Glorietta 3", price: "₱35-45", distance: "3.2 km", rating: 4.6, availability: 23, status: "limited" },
    { name: "Ayala Malls Pasay", price: "₱30-40", distance: "4.5 km", rating: 4.4, availability: 67, status: "available" },
  ];

  const quickActions = [
    { icon: Navigation, label: "Navigate", color: "from-[#193654] to-[#2a5a8a]", action: onNavigateToParking },
    { icon: QrCode, label: "Scan QR", color: "from-[#1e4670] to-[#2a5a8a]", action: () => {} },
    { icon: History, label: "History", color: "from-[#193654] to-[#1e4670]", action: () => {} },
    { icon: MessageCircle, label: "Support", color: "from-[#2a5a8a] to-[#193654]", action: () => {} },
  ];

  const paymentMethods = [
    { name: "Maya", balance: "₱1,250.30", color: "bg-gradient-to-br from-[#193654] to-[#0f1f35]" },
    { name: "GCash", balance: "₱850.20", color: "bg-gradient-to-br from-[#1e4670] to-[#193654]" },
    { name: "GoTyme", balance: "₱250.00", color: "bg-gradient-to-br from-[#2a5a8a] to-[#1e4670]" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Compact Header - Mobile Optimized */}
      <div className="bg-gradient-to-br from-[#193654] via-[#1e4670] to-[#193654] px-4 py-3 relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <motion.div 
              className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-white font-bold text-lg">P</div>
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-white text-sm leading-tight">Good morning, Hans!</h1>
              <p className="text-white/80 text-xs">Ready for smart parking?</p>
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.9 }} className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-white/10 backdrop-blur-sm rounded-lg w-10 h-10 flex items-center justify-center"
              onClick={onNavigateToNotifications}
            >
              <Bell className="w-5 h-5" />
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </motion.div>
        </div>

        {/* Balance Card - Compact Mobile */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="bg-[#0f1f35]/80 backdrop-blur-xl border-white/20 text-white overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wallet className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                    <p className="text-white/80 text-xs font-medium truncate">E-Wallet Balance</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">₱2,350</h2>
                  <Button
                    onClick={onNavigateToWallet}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-lg h-7 text-xs backdrop-blur-sm w-fit"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    Top-up
                  </Button>
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 flex-shrink-0"
                >
                  <CreditCard className="w-7 h-7 sm:w-9 sm:h-9 text-white/90" />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions - Horizontal Scroll */}
        <div className="mt-3 -mx-4 px-4">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1.5">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={action.action}
                    className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${action.color} text-white rounded-xl sm:rounded-2xl shadow-lg border-0 relative overflow-hidden group flex-shrink-0`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 relative z-10" />
                    <span className="text-[9px] sm:text-[10px] font-semibold relative z-10 text-center">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 overflow-hidden flex flex-col px-3 sm:px-4 py-3 sm:py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 mb-3 sm:mb-4">
            <TabsTrigger 
              value="overview" 
              className="rounded-md data-[state=active]:bg-[#193654] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <Target className="w-3.5 h-3.5 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights"
              className="rounded-md data-[state=active]:bg-[#193654] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <Brain className="w-3.5 h-3.5 mr-1" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="wallet"
              className="rounded-md data-[state=active]:bg-[#193654] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <Wallet className="w-3.5 h-3.5 mr-1" />
              Wallet
            </TabsTrigger>
          </TabsList>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-3 sm:space-y-4 mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Nearby Locations - Responsive Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#193654] dark:text-blue-400" />
                        Nearby Parking
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-auto p-0 text-[#193654] dark:text-blue-400 hover:bg-transparent"
                        onClick={onNavigateToParking}
                      >
                        View All
                        <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {locations.slice(0, 3).map((location, index) => (
                        <motion.div
                          key={location.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all overflow-hidden group cursor-pointer">
                            <div className="p-3 sm:p-4">
                              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 truncate">{location.name}</h4>
                                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-0.5 flex-shrink-0">
                                      <MapPin className="w-3 h-3" />
                                      {location.distance}
                                    </span>
                                    <span className="flex items-center gap-0.5 flex-shrink-0">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      {location.rating}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-base sm:text-lg font-bold text-[#193654] dark:text-blue-400">{location.price}</p>
                                  <Badge 
                                    className={`text-[9px] sm:text-[10px] mt-1 ${
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
                                      location.availability > 50 ? 'bg-[#193654]' : 
                                      location.availability > 20 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (location.availability / 200) * 100)}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                                <motion.div
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  initial={{ x: -10 }}
                                  whileHover={{ x: 0 }}
                                >
                                  <ArrowRight className="w-4 h-4 text-[#193654] dark:text-blue-400" />
                                </motion.div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Navigate Button */}
                    <motion.div
                      className="mt-2 sm:mt-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={onNavigateToParking}
                        className="w-full bg-[#193654] hover:bg-[#0f1f35] text-white rounded-lg sm:rounded-xl h-10 sm:h-12 font-semibold text-sm sm:text-base"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Start Navigation
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-[#193654] dark:text-blue-400" />
                        Recent Activity
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { location: "SM Dasmarinas", time: "2 hours ago", amount: "₱30.00", duration: "2h" },
                          { location: "Mall of Asia", time: "Yesterday", amount: "₱35.00", duration: "3h" },
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#193654] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-xs sm:text-sm text-foreground truncate">{activity.location}</p>
                                <p className="text-xs text-muted-foreground">{activity.time} • {activity.duration}</p>
                              </div>
                            </div>
                            <p className="font-bold text-sm text-foreground flex-shrink-0 ml-2">{activity.amount}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="space-y-3 sm:space-y-4 mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="ai-insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
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
            <TabsContent value="wallet" className="space-y-3 sm:space-y-4 mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#193654] dark:text-blue-400" />
                      Payment Methods
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
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
                            <div className="p-3 sm:p-5">
                              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/80 text-xs sm:text-sm mb-0.5">Available Balance</p>
                                  <h3 className="text-xl sm:text-2xl font-bold">{method.balance}</h3>
                                </div>
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                  className="flex-shrink-0"
                                >
                                  <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-white/80" />
                                </motion.div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm">{method.name}</p>
                                <motion.div
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
                  <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-3">Quick Top-up</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {['₱100', '₱200', '₱500'].map((amount) => (
                          <motion.div
                            key={amount}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-9 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm border-slate-300 dark:border-slate-600 hover:bg-[#193654] hover:text-white hover:border-[#193654]"
                            >
                              {amount}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div
                        className="mt-2 sm:mt-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={onNavigateToWallet}
                          className="w-full bg-[#193654] hover:bg-[#0f1f35] text-white rounded-lg sm:rounded-xl h-10 sm:h-11 font-semibold text-sm sm:text-base"
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
          </div>
        </Tabs>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-2 safe-area-inset-bottom" />
    </div>
  );
}
