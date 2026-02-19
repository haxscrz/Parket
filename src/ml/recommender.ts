import { ParkingAvailabilityPredictor } from './availabilityPredictor';
import { ParkingLocation, UserParkingHistory, ParkingPrediction } from './types';

/**
 * Smart Parking Recommendation System
 * Uses ML predictions + user preferences to recommend best parking spots
 */
export class ParkingRecommender {
  private predictor: ParkingAvailabilityPredictor;

  constructor() {
    this.predictor = new ParkingAvailabilityPredictor();
  }

  /**
   * Initialize the recommender (load or train model)
   */
  async initialize(): Promise<void> {
    const loaded = await this.predictor.load();
    
    if (!loaded) {
      console.log('🎓 Training model for the first time...');
      await this.predictor.train(50);
      await this.predictor.save();
    }
  }

  /**
   * Get smart recommendations for parking locations
   */
  async getRecommendations(
    locations: ParkingLocation[],
    userHistory?: UserParkingHistory[]
  ): Promise<ParkingPrediction[]> {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    const predictions: ParkingPrediction[] = [];

    // Location ID mapping
    const locationMap: { [key: string]: number } = {
      'SM Dasmarinas': 0,
      'Mall of Asia': 1,
      'Glorietta 3': 2,
      'Ayala Malls Pasay': 3,
      "St. Luke's Hospital": 4,
      'Waltermart': 5
    };

    // Base capacities for each location
    const capacities: { [key: string]: number } = {
      'SM Dasmarinas': 200,
      'Mall of Asia': 500,
      'Glorietta 3': 300,
      'Ayala Malls Pasay': 250,
      "St. Luke's Hospital": 150,
      'Waltermart': 180
    };

    for (const location of locations) {
      const locationId = locationMap[location.name] ?? 0;
      const baseCapacity = capacities[location.name] ?? 200;

      // Get ML prediction
      const prediction = await this.predictor.predict(
        hour,
        dayOfWeek,
        locationId,
        baseCapacity
      );

      // Calculate recommendation score (0-100)
      const score = this.calculateRecommendationScore(
        location,
        prediction.availability,
        userHistory
      );

      predictions.push({
        location: location.name,
        predictedAvailability: prediction.availability,
        confidence: prediction.confidence,
        recommendationScore: score
      });
    }

    // Sort by recommendation score (highest first)
    return predictions.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  /**
   * Calculate recommendation score based on multiple factors
   */
  private calculateRecommendationScore(
    location: ParkingLocation,
    predictedAvailability: number,
    userHistory?: UserParkingHistory[]
  ): number {
    let score = 50; // Base score

    // Factor 1: Availability (0-30 points)
    // More available spots = higher score
    const availabilityScore = Math.min(30, (predictedAvailability / 100) * 30);
    score += availabilityScore;

    // Factor 2: Distance (0-25 points)
    // Closer = higher score
    const distanceValue = parseFloat(location.distance.replace(' km', ''));
    const distanceScore = Math.max(0, 25 - (distanceValue * 3));
    score += distanceScore;

    // Factor 3: Price (0-20 points)
    // Lower price = higher score
    const priceValue = parseFloat(location.price.replace('₱', '').replace('/hr', ''));
    const priceScore = Math.max(0, 20 - (priceValue / 2));
    score += priceScore;

    // Factor 4: Rating (0-15 points)
    const ratingScore = (location.rating / 5) * 15;
    score += ratingScore;

    // Factor 5: User history preference (0-10 points)
    if (userHistory && userHistory.length > 0) {
      const visitCount = userHistory.filter(h => h.location === location.name).length;
      const historyScore = Math.min(10, visitCount * 2);
      score += historyScore;
    }

    return Math.round(Math.min(100, score));
  }

  /**
   * Predict parking duration for user
   */
  predictDuration(userHistory: UserParkingHistory[]): number {
    if (userHistory.length === 0) {
      return 120; // Default 2 hours
    }

    // Calculate average from recent history
    const recentHistory = userHistory.slice(0, 5);
    const avgDuration = recentHistory.reduce((sum, h) => sum + h.duration, 0) / recentHistory.length;

    // Adjust based on current time
    const hour = new Date().getHours();
    let duration = avgDuration;

    if (hour >= 18 && hour <= 21) {
      duration *= 0.8; // Evening visits tend to be shorter
    } else if (hour >= 12 && hour <= 14) {
      duration *= 1.1; // Lunch visits might be longer
    }

    return Math.round(duration);
  }

  /**
   * Get ML insights for display
   */
  getInsights(predictions: ParkingPrediction[]): string[] {
    const insights: string[] = [];
    const topPick = predictions[0];

    if (topPick) {
      insights.push(`🎯 ${topPick.location} is your best match (${topPick.recommendationScore}% match)`);
      
      if (topPick.predictedAvailability > 50) {
        insights.push(`✅ High availability predicted: ${topPick.predictedAvailability} spots`);
      } else if (topPick.predictedAvailability < 20) {
        insights.push(`⚠️ Low availability: Only ${topPick.predictedAvailability} spots predicted`);
      }

      insights.push(`🔮 Prediction confidence: ${Math.round(topPick.confidence * 100)}%`);
    }

    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 17 && hour <= 19) {
      insights.push('🕐 Peak evening hours - consider nearby alternatives');
    } else if (hour >= 12 && hour <= 14) {
      insights.push('🕐 Lunch hour rush - arrive early for best spots');
    }

    return insights;
  }
}
