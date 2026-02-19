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
    <div className="w-full h-screen bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* Premium Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#193654] via-[#1e4670] to-[#0f1f35] pt-6 pb-8 px-4 sm:px-6">
        {/* Top Bar with Greeting & Notification */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-2xl sm:text-3xl mb-1 leading-tight">
              Good morning, Hans! 👋
            </h1>
            <p className="text-white/70 text-sm sm:text-base font-medium">
              Let's find you the perfect spot
            </p>
          </div>
          <button
            onClick={onNavigateToNotifications}
            className="relative flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all ml-3"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>

        {/* Premium Balance Card */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden hover:shadow-3xl transition-all hover:from-white/20 hover:to-white/10 group">
          <div className="flex items-start justify-between gap-4">
            {/* Balance Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                </div>
                <span className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-wide">E-Wallet</span>
              </div>
              <h2 className="text-white text-4xl sm:text-5xl font-black mb-2">
                ₱2,350
              </h2>
              <p className="text-white/60 text-xs sm:text-sm font-medium">Available balance</p>
            </div>

            {/* Animated Icon */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#2a5a8a] to-[#1e4670] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onNavigateToWallet}
            className="mt-4 w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 backdrop-blur-md border border-white/30 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Top-up Balance</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mt-6 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.action}
                className={`flex flex-col items-center justify-center w-18 sm:w-24 h-20 sm:h-24 bg-gradient-to-br ${action.color} text-white rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 backdrop-blur-md hover:shadow-2xl hover:scale-110 transition-all relative overflow-hidden flex-shrink-0 group`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <action.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1.5 relative z-10 text-white/95" />
                <span className="text-[10px] sm:text-xs font-bold relative z-10 text-center uppercase tracking-wide">{action.label}</span>
              </button>
            ))}
          </div>
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
                                  <div
                                    className={`h-full rounded-full ${
                                      location.availability > 50 ? 'bg-[#193654]' : 
                                      location.availability > 20 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(0, (location.availability / 200) * 100))}%` }}
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
