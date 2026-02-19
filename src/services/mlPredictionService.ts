import type { ParkingPredictions, HourlyPrediction, PeakHour, BestTime, SmartRouteRecommendation } from '../types/ml-predictions';

class MLPredictionService {
  private predictions: ParkingPredictions | null = null;
  private isLoaded = false;

  // Day names for display
  private dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  /**
   * Load ML predictions from JSON file
   */
  async loadPredictions(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/parking_predictions.json');
      this.predictions = await response.json();
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load ML predictions:', error);
      throw error;
    }
  }

  /**
   * Ensure predictions are loaded before use
   */
  private async ensureLoaded(): Promise<void> {
    if (!this.isLoaded) {
      await this.loadPredictions();
    }
  }

  /**
   * Get prediction for a specific location, day, and hour
   */
  async getPrediction(location: string, day: number, hour: number): Promise<HourlyPrediction | null> {
    await this.ensureLoaded();
    
    if (!this.predictions || !this.predictions.locations[location]) {
      return null;
    }

    const locationData = this.predictions.locations[location];
    const dayStr = day.toString();
    const hourStr = hour.toString();

    if (locationData.predictions_by_day[dayStr]?.[hourStr]) {
      return locationData.predictions_by_day[dayStr][hourStr];
    }

    return null;
  }

  /**
   * Get current prediction based on current time
   */
  async getCurrentPrediction(location: string): Promise<HourlyPrediction | null> {
    const now = new Date();
    const day = now.getDay();
    let hour = now.getHours();
    
    // If current hour is outside business hours (6-21), use nearest available hour
    if (hour < 6) {
      hour = 6; // Use 6 AM data
    } else if (hour > 21) {
      hour = 21; // Use 9 PM data
    }
    
    return this.getPrediction(location, day, hour);
  }

  /**
   * Get peak hours for a location
   */
  async getPeakHours(location: string): Promise<PeakHour[]> {
    await this.ensureLoaded();
    
    if (!this.predictions || !this.predictions.locations[location]) {
      return [];
    }

    return this.predictions.locations[location].peak_hours;
  }

  /**
   * Get best times to park at a location
   */
  async getBestTimes(location: string): Promise<BestTime[]> {
    await this.ensureLoaded();
    
    if (!this.predictions || !this.predictions.locations[location]) {
      return [];
    }

    return this.predictions.locations[location].best_times;
  }

  /**
   * Get formatted best times with readable day/time strings
   */
  async getFormattedBestTimes(location: string, limit: number = 5): Promise<Array<{
    day: string;
    time: string;
    occupancy: number;
    availability: number;
    recommendation: string;
  }>> {
    const bestTimes = await this.getBestTimes(location);
    
    return bestTimes.slice(0, limit).map(time => {
      const availability = (1 - time.occupancy) * 100;
      return {
        day: this.dayNames[time.day],
        time: this.formatHour(time.hour),
        occupancy: Math.round(time.occupancy * 100),
        availability: Math.round(availability),
        recommendation: availability > 70 ? 'Excellent' : availability > 50 ? 'Good' : 'Moderate'
      };
    });
  }

  /**
   * Get peak hours formatted for display
   */
  async getFormattedPeakHours(location: string, limit: number = 5): Promise<Array<{
    day: string;
    time: string;
    occupancy: number;
    severity: string;
  }>> {
    const peakHours = await this.getPeakHours(location);
    
    return peakHours.slice(0, limit).map(peak => {
      const occupancyPercent = peak.occupancy * 100;
      return {
        day: this.dayNames[peak.day],
        time: this.formatHour(peak.hour),
        occupancy: Math.round(occupancyPercent),
        severity: occupancyPercent > 90 ? 'Critical' : occupancyPercent > 80 ? 'High' : 'Medium'
      };
    });
  }

  /**
   * Get hourly predictions for a specific day
   */
  async getDailyPredictions(location: string, day: number): Promise<Array<{
    hour: number;
    time: string;
    prediction: HourlyPrediction;
  }>> {
    await this.ensureLoaded();
    
    if (!this.predictions || !this.predictions.locations[location]) {
      return [];
    }

    const dayData = this.predictions.locations[location].predictions_by_day[day.toString()];
    
    if (!dayData) {
      return [];
    }

    return Object.entries(dayData).map(([hour, prediction]) => ({
      hour: parseInt(hour),
      time: this.formatHour(parseInt(hour)),
      prediction
    })).sort((a, b) => a.hour - b.hour);
  }

  /**
   * Get chart data for peak hours visualization
   */
  async getPeakHoursChartData(location: string): Promise<Array<{
    hour: string;
    weekday: number;
    weekend: number;
  }>> {
    await this.ensureLoaded();
    
    if (!this.predictions || !this.predictions.locations[location]) {
      return [];
    }

    const locationData = this.predictions.locations[location];
    const chartData: Array<{ hour: string; weekday: number; weekend: number }> = [];

    // Get weekday (Wednesday - day 3) and weekend (Saturday - day 6) data
    const weekdayData = locationData.predictions_by_day['3'] || locationData.predictions_by_day['0'];
    const weekendData = locationData.predictions_by_day['6'] || locationData.predictions_by_day['5'];

    if (weekdayData && weekendData) {
      for (let hour = 6; hour <= 21; hour++) {
        const hourStr = hour.toString();
        chartData.push({
          hour: this.formatHour(hour),
          weekday: Math.round((weekdayData[hourStr]?.occupancy_rate || 0) * 100),
          weekend: Math.round((weekendData[hourStr]?.occupancy_rate || 0) * 100)
        });
      }
    }

    return chartData;
  }

  /**
   * Get all available locations
   */
  async getAvailableLocations(): Promise<string[]> {
    await this.ensureLoaded();
    
    if (!this.predictions) {
      return [];
    }

    return Object.keys(this.predictions.locations);
  }

  /**
   * Get smart route recommendation based on ML predictions
   */
  async getSmartRouteRecommendation(
    location: string,
    currentTime?: Date
  ): Promise<SmartRouteRecommendation | null> {
    const time = currentTime || new Date();
    const prediction = await this.getCurrentPrediction(location);

    if (!prediction) {
      return null;
    }

    // Simulate finding an optimal parking spot based on congestion
    const spotRecommendation = this.calculateOptimalSpot(prediction.congestion_level);

    return {
      parkingSpot: spotRecommendation.spot,
      distance: spotRecommendation.distance,
      walkingTime: spotRecommendation.walkingTime,
      congestionLevel: prediction.congestion_level,
      confidence: this.calculateConfidence(prediction.availability_rate)
    };
  }

  /**
   * Calculate optimal parking spot based on congestion
   */
  private calculateOptimalSpot(congestionLevel: 'low' | 'medium' | 'high'): {
    spot: { id: string; row: string; position: number };
    distance: number;
    walkingTime: number;
  } {
    // Simulate ML-based spot selection
    const rows = ['A', 'B', 'C', 'D', 'E'];
    let selectedRow: string;
    let position: number;
    let distance: number;

    if (congestionLevel === 'low') {
      selectedRow = rows[0]; // Closest row
      position = Math.floor(Math.random() * 5) + 1;
      distance = 20 + Math.random() * 15;
    } else if (congestionLevel === 'medium') {
      selectedRow = rows[1]; // Second closest
      position = Math.floor(Math.random() * 8) + 1;
      distance = 35 + Math.random() * 20;
    } else {
      selectedRow = rows[3]; // Further rows
      position = Math.floor(Math.random() * 10) + 1;
      distance = 60 + Math.random() * 30;
    }

    return {
      spot: {
        id: `${selectedRow}-${position}`,
        row: selectedRow,
        position
      },
      distance: Math.round(distance),
      walkingTime: Math.round(distance / 1.4) // Assuming 1.4 m/s walking speed
    };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(availabilityRate: number): number {
    // Higher availability = higher confidence
    return Math.min(0.95, 0.5 + (availabilityRate * 0.5));
  }

  /**
   * Format hour to readable time string
   */
  private formatHour(hour: number): string {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  }

  /**
   * Get model performance metrics
   */
  async getModelPerformance(): Promise<{
    r2_score: number;
    mae: number;
    rmse: number;
    accuracy: string;
  } | null> {
    await this.ensureLoaded();
    
    if (!this.predictions) {
      return null;
    }

    const perf = this.predictions.model_performance;
    const accuracyPercent = Math.round(perf.r2_score * 100);

    return {
      ...perf,
      accuracy: `${accuracyPercent}%`
    };
  }

  /**
   * Determine if current time is peak hour for location
   */
  async isCurrentlyPeakHour(location: string): Promise<boolean> {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const peakHours = await this.getPeakHours(location);
    
    return peakHours.some(peak => peak.day === day && peak.hour === hour);
  }

  /**
   * Get recommendation text based on current conditions
   */
  async getRecommendationText(location: string): Promise<string> {
    const prediction = await this.getCurrentPrediction(location);
    
    if (!prediction) {
      return 'No prediction available';
    }

    const availabilityPercent = Math.round(prediction.availability_rate * 100);

    if (availabilityPercent > 70) {
      return `Great time to park! ${availabilityPercent}% spots available`;
    } else if (availabilityPercent > 40) {
      return `Moderate availability. ${availabilityPercent}% spots available`;
    } else if (availabilityPercent > 20) {
      return `Limited spots. ${availabilityPercent}% available. Consider alternative time`;
    } else {
      return `Very crowded! Only ${availabilityPercent}% spots available. Try earlier or later`;
    }
  }
}

// Export singleton instance
export const mlService = new MLPredictionService();
