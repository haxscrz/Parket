// ML Prediction Types
export interface HourlyPrediction {
  occupancy_rate: number;
  availability_rate: number;
  congestion_level: 'low' | 'medium' | 'high';
}

export interface PredictionsByDay {
  [day: string]: {
    [hour: string]: HourlyPrediction;
  };
}

export interface PeakHour {
  day: number;
  hour: number;
  occupancy: number;
}

export interface BestTime {
  day: number;
  hour: number;
  occupancy: number;
}

export interface LocationPrediction {
  predictions_by_day: PredictionsByDay;
  peak_hours: PeakHour[];
  best_times: BestTime[];
}

export interface ParkingPredictions {
  locations: {
    [location: string]: LocationPrediction;
  };
  model_performance: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
  last_updated: string;
}

export interface SmartRouteRecommendation {
  parkingSpot: {
    id: string;
    row: string;
    position: number;
  };
  distance: number;
  walkingTime: number;
  congestionLevel: 'low' | 'medium' | 'high';
  confidence: number;
}
