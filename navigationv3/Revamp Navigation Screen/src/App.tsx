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
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Parking Navigation Demo</h1>
        <button 
          onClick={() => setShowParking(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Parking Navigator
        </button>
      </div>
    </div>
  );
}
