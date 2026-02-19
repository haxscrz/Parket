import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Brain, Zap, Navigation, Clock, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { mlService } from '../services/mlPredictionService';

interface SmartSlotRecommendationProps {
  location: string;
  onAcceptRecommendation?: (slotId: string) => void;
  darkMode?: boolean;
}

export function SmartSlotRecommendation({ 
  location, 
  onAcceptRecommendation,
  darkMode 
}: SmartSlotRecommendationProps) {
  const [recommendation, setRecommendation] = useState<{
    parkingSpot: { id: string; row: string; position: number };
    distance: number;
    walkingTime: number;
    congestionLevel: 'low' | 'medium' | 'high';
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    loadRecommendation();
  }, [location]);

  const loadRecommendation = async () => {
    try {
      setLoading(true);
      const rec = await mlService.getSmartRouteRecommendation(location);
      setRecommendation(rec);
    } catch (error) {
      console.error('Failed to load smart recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (recommendation) {
      setAccepted(true);
      onAcceptRecommendation?.(recommendation.parkingSpot.id);
    }
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/30';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-950/30';
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getCongestionLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Low Traffic';
      case 'medium':
        return 'Moderate Traffic';
      case 'high':
        return 'High Traffic';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!recommendation) {
    return null;
  }

  if (accepted) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-foreground">Recommendation Accepted!</p>
              <p className="text-sm text-muted-foreground">Navigating to optimal spot...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/30 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">AI Smart Routing</h3>
              <p className="text-xs text-muted-foreground">ML-optimized spot selection</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-0 text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {Math.round(recommendation.confidence * 100)}% Confidence
          </Badge>
        </div>

        {/* Recommended Spot */}
        <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-4 border border-white/30 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Recommended Spot</p>
              <p className="text-2xl font-bold text-foreground">
                {recommendation.parkingSpot.row}-{recommendation.parkingSpot.position}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getCongestionColor(recommendation.congestionLevel)}`}>
                <TrendingUp className="w-3 h-3" />
                {getCongestionLabel(recommendation.congestionLevel)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-bold text-foreground">{recommendation.distance}m</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Walk Time</p>
                <p className="text-sm font-bold text-foreground">{recommendation.walkingTime}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-muted-foreground">Shortest distance to mall entrance</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-muted-foreground">Optimized based on current traffic</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-muted-foreground">High availability probability</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAccept}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl h-10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Accept Recommendation
        </Button>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground mt-3">
          Powered by machine learning algorithms
        </p>
      </div>
    </Card>
  );
}
