// Generate synthetic training data based on typical parking patterns
// In production, this would come from real historical data

export interface TrainingDataPoint {
  // Input features
  hour: number;          // 0-23
  dayOfWeek: number;     // 0-6 (0=Sunday)
  locationId: number;    // 0-5
  baseAvailability: number; // normal capacity
  
  // Output label
  availability: number;  // actual available spots
}

/**
 * Generate synthetic training data for parking availability prediction
 * Simulates realistic patterns:
 * - Malls busier on weekends
 * - Hospitals steady throughout week
 * - Peak hours: lunch (12-14) and evening (17-20)
 */
export function generateTrainingData(samples: number = 1000): TrainingDataPoint[] {
  const data: TrainingDataPoint[] = [];
  const locations = [
    { id: 0, name: 'SM Dasmarinas', baseCapacity: 200, pattern: 'mall' },
    { id: 1, name: 'Mall of Asia', baseCapacity: 500, pattern: 'mall' },
    { id: 2, name: 'Glorietta 3', baseCapacity: 300, pattern: 'mall' },
    { id: 3, name: 'Ayala Malls Pasay', baseCapacity: 250, pattern: 'mall' },
    { id: 4, name: 'St. Lukes Hospital', baseCapacity: 150, pattern: 'hospital' },
    { id: 5, name: 'Waltermart', baseCapacity: 180, pattern: 'mall' }
  ];

  for (let i = 0; i < samples; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const dayOfWeek = Math.floor(Math.random() * 7);
    const hour = Math.floor(Math.random() * 24);
    
    let occupancyRate = 0.5; // base 50% occupancy
    
    // Apply patterns based on location type
    if (location.pattern === 'mall') {
      // Malls busier on weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        occupancyRate += 0.3;
      }
      
      // Peak hours: lunch and evening
      if (hour >= 12 && hour <= 14) occupancyRate += 0.2;
      if (hour >= 17 && hour <= 20) occupancyRate += 0.25;
      
      // Early morning/late night less busy
      if (hour < 10 || hour > 21) occupancyRate -= 0.3;
      
    } else if (location.pattern === 'hospital') {
      // Hospitals steady but slightly busier during day
      if (hour >= 8 && hour <= 18) occupancyRate += 0.15;
      if (dayOfWeek >= 1 && dayOfWeek <= 5) occupancyRate += 0.1; // weekdays busier
    }
    
    // Add some randomness
    occupancyRate += (Math.random() - 0.5) * 0.2;
    occupancyRate = Math.max(0.1, Math.min(0.95, occupancyRate)); // clamp between 10-95%
    
    const availability = Math.round(location.baseCapacity * (1 - occupancyRate));
    
    data.push({
      hour,
      dayOfWeek,
      locationId: location.id,
      baseAvailability: location.baseCapacity,
      availability
    });
  }
  
  return data;
}

/**
 * Generate training data for duration prediction
 */
export interface DurationTrainingData {
  locationId: number;
  dayOfWeek: number;
  hour: number;
  userHistoryAvg: number; // user's average parking duration
  duration: number; // actual duration in minutes
}

export function generateDurationTrainingData(samples: number = 500): DurationTrainingData[] {
  const data: DurationTrainingData[] = [];
  
  for (let i = 0; i < samples; i++) {
    const locationId = Math.floor(Math.random() * 6);
    const dayOfWeek = Math.floor(Math.random() * 7);
    const hour = Math.floor(Math.random() * 24);
    const userHistoryAvg = 60 + Math.random() * 120; // 60-180 minutes typical
    
    let duration = userHistoryAvg;
    
    // Shopping trips on weekends tend to be longer
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      duration *= 1.2;
    }
    
    // Evening visits tend to be shorter
    if (hour >= 18) {
      duration *= 0.8;
    }
    
    // Add randomness
    duration += (Math.random() - 0.5) * 40;
    duration = Math.max(15, Math.min(300, duration)); // 15 min to 5 hours
    
    data.push({
      locationId,
      dayOfWeek,
      hour,
      userHistoryAvg,
      duration: Math.round(duration)
    });
  }
  
  return data;
}
