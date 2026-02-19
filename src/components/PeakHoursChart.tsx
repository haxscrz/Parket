import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, Sparkles, Brain } from 'lucide-react';
import { mlService } from '../services/mlPredictionService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PeakHoursChartProps {
  location: string;
  darkMode?: boolean;
}

export function PeakHoursChart({ location, darkMode }: PeakHoursChartProps) {
  const [chartData, setChartData] = useState<Array<{ hour: string; weekday: number; weekend: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [peakHours, setPeakHours] = useState<Array<{ day: string; time: string; occupancy: number; severity: string }>>([]);

  useEffect(() => {
    loadChartData();
  }, [location]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const data = await mlService.getPeakHoursChartData(location);
      const peaks = await mlService.getFormattedPeakHours(location, 3);
      setChartData(data);
      setPeakHours(peaks);
    } catch (error) {
      console.error('Failed to load peak hours data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-48 bg-muted rounded"></div>
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">AI Peak Hours Analysis</h3>
              <p className="text-xs text-muted-foreground">ML-powered predictions</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            94% Accurate
          </Badge>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft', fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="weekday" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Weekday"
              />
              <Bar 
                dataKey="weekend" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                name="Weekend"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h4 className="text-sm font-semibold text-foreground">Top Peak Times to Avoid</h4>
          </div>
          <div className="space-y-2">
            {peakHours.map((peak, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{peak.day}</p>
                    <p className="text-xs text-muted-foreground">{peak.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{peak.occupancy}% Full</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-red-300 dark:border-red-800 text-red-600 dark:text-red-400"
                  >
                    {peak.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Badge */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Weekend peak hours typically occur <strong>Friday-Sunday, 12 PM - 6 PM</strong>
          </p>
        </div>
      </div>
    </Card>
  );
}
