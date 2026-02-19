import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { mlService } from '../services/mlPredictionService';

interface HistoricalTrendsAnimationProps {
  location: string;
  darkMode?: boolean;
}

export function HistoricalTrendsAnimation({ location, darkMode }: HistoricalTrendsAnimationProps) {
  const [allData, setAllData] = useState<Array<{ time: string; occupancy: number; trend: number }>>([]);
  const [displayData, setDisplayData] = useState<Array<{ time: string; occupancy: number; trend: number }>>([]);
  const [currentDataPoint, setCurrentDataPoint] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    loadHistoricalData();
  }, [location]);

  useEffect(() => {
    if (allData.length === 0 || !isAnimating) return;

    const interval = setInterval(() => {
      setCurrentDataPoint((prev) => {
        if (prev >= allData.length - 1) {
          // Loop back to start
          setTimeout(() => {
            setDisplayData([]);
            setCurrentDataPoint(0);
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 400); // Smoother: Add new point every 400ms

    return () => clearInterval(interval);
  }, [allData, isAnimating]);

  useEffect(() => {
    if (currentDataPoint > 0) {
      setDisplayData(allData.slice(0, currentDataPoint + 1));
    }
  }, [currentDataPoint, allData]);

  const loadHistoricalData = async () => {
    try {
      const chartData = await mlService.getPeakHoursChartData(location);
      
      // Transform data for line chart animation
      const historicalData = chartData.map((item, index) => ({
        time: item.hour,
        occupancy: Math.round((item.weekday + item.weekend) / 2),
        trend: index < chartData.length / 2 ? 
          Math.round(item.weekday) : 
          Math.round(item.weekend)
      }));

      setAllData(historicalData);
      setIsAnimating(true);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const currentOccupancy = displayData.length > 0 ? displayData[displayData.length - 1].occupancy : 0;
  const trendDirection = displayData.length > 1 
    ? displayData[displayData.length - 1].occupancy - displayData[displayData.length - 2].occupancy 
    : 0;

  return (
    <div className="space-y-3">
      {/* Animated Stats */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div 
          className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20"
          animate={{ borderColor: ['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.4)', 'rgba(249, 115, 22, 0.2)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-xs text-muted-foreground mb-0.5">Current</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentOccupancy}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-lg font-bold text-foreground"
            >
              {currentOccupancy}%
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          animate={{ borderColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.2)'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground mb-0.5">Trend</p>
          <div className="flex items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={trendDirection}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1"
              >
                <TrendingUp 
                  className={`w-4 h-4 ${trendDirection >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`}
                />
                <span className={`text-sm font-bold ${trendDirection >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trendDirection >= 0 ? '+' : ''}{trendDirection}%
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Animated Line Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', marginTop: '8px' }}
                iconType="line"
                formatter={(value: string) => {
                  if (value === 'occupancy') return 'Avg Occupancy';
                  if (value === 'trend') return 'Live Trend';
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#f97316"
                strokeWidth={3}
                fill="url(#occupancyGradient)"
                animationDuration={600}
                animationEasing="ease-in-out"
                isAnimationActive={true}
                dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                name="Avg Occupancy"
              />
              <Area
                type="monotone"
                dataKey="trend"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#trendGradient)"
                animationDuration={600}
                animationEasing="ease-in-out"
                isAnimationActive={true}
                dot={{ r: 2, fill: '#3b82f6' }}
                name="Live Trend"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{allData.length > 0 ? Math.round((displayData.length / allData.length) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${allData.length > 0 ? (displayData.length / allData.length) * 100 : 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
  );
}
