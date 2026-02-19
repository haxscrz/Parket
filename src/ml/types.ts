// Machine Learning Types for Parking System

export interface ParkingLocation {
  name: string;
  price: string; // e.g., "₱25/hr"
  distance: string; // e.g., "2.1 km"
  rating: number;
  availability: number; // number of available spots
}

export interface UserParkingHistory {
  id: string;
  location: string;
  zone: string;
  date: Date;
  duration: number; // in minutes
  amount: number;
  dayOfWeek: number; // 0-6
  hour: number; // 0-23
  paymentMethod: string;
}

export interface ParkingPrediction {
  location: string;
  predictedAvailability: number;
  confidence: number;
  recommendationScore: number;
}

export interface DurationPrediction {
  estimatedMinutes: number;
  confidence: number;
  basedOnHistory: boolean;
}
