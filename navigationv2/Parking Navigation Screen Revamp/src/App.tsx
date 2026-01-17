import { useState } from 'react';
import { ParkingNavigationScreen } from './components/ParkingNavigationScreen';

export default function App() {
  const [showParking, setShowParking] = useState(true);

  if (showParking) {
    return (
      <ParkingNavigationScreen 
        onBack={() => setShowParking(false)}
      />
    );
  }

  return (
    <div className="size-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <button
        onClick={() => setShowParking(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Open Parking Navigation
      </button>
    </div>
  );
}
