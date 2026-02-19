import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, ThumbsUp, Star, Sparkles, TrendingDown, Calendar } from 'lucide-react';
import { mlService } from '../services/mlPredictionService';
import { motion, AnimatePresence } from 'framer-motion';

interface BestTimeSuggestionsProps {
  location: string;
  darkMode?: boolean;
  onSelectTime?: (day: string, time: string) => void;
}

export function BestTimeSuggestions({ location, darkMode, onSelectTime }: BestTimeSuggestionsProps) {
  const [bestTimes, setBestTimes] = useState<Array<{
    day: string;
    time: string;
    occupancy: number;
    availability: number;
    recommendation: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [currentRecommendation, setCurrentRecommendation] = useState<string>('');

  useEffect(() => {
    loadBestTimes();
  }, [location]);

  const loadBestTimes = async () => {
    try {
      setLoading(true);
      const times = await mlService.getFormattedBestTimes(location, 5);
      const recommendation = await mlService.getRecommendationText(location);
      setBestTimes(times);
      setCurrentRecommendation(recommendation);
    } catch (error) {
      console.error('Failed to load best times:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Excellent':
        return 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800';
      case 'Good':
        return 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Moderate':
        return 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Excellent':
        return <Star className="w-4 h-4 fill-current" />;
      case 'Good':
        return <ThumbsUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Best Time to Park</h3>
              <p className="text-xs text-muted-foreground">AI-optimized recommendations</p>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        <motion.div 
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <motion.div 
              className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Right Now</p>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentRecommendation}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm text-foreground"
                >
                  {currentRecommendation}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Best Times List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h4 className="text-sm font-semibold text-foreground">Top 5 Best Times This Week</h4>
          </div>

          {bestTimes.map((time, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${getRecommendationColor(time.recommendation)}`}
              onClick={() => onSelectTime?.(time.day, time.time)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/50 dark:bg-black/20">
                    {getRecommendationIcon(time.recommendation)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{time.day}</p>
                    <p className="text-xs opacity-80">{time.time}</p>
                  </div>
                </div>
                <Badge className="bg-white/50 dark:bg-black/20 border-0">
                  {time.recommendation}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="opacity-80">Availability</span>
                  <motion.span 
                    className="font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {time.availability}%
                  </motion.span>
                </div>
                <div className="w-full bg-white/30 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-current rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${time.availability}%` }}
                    transition={{ 
                      duration: 1,
                      delay: index * 0.1 + 0.2,
                      ease: "easeOut"
                    }}
                  />
                </div>
              </div>

              {/* Ranking Badge */}
              {index === 0 && (
                <motion.div 
                  className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 text-xs font-semibold"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5
                  }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  Best Choice
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl h-11"
          onClick={() => onSelectTime?.(bestTimes[0]?.day, bestTimes[0]?.time)}
        >
          <Clock className="w-4 h-4 mr-2" />
          Schedule for Best Time
        </Button>

        {/* Info */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Predictions based on historical data and real-time ML analysis
          </p>
        </div>
      </div>
    </Card>
  );
}
