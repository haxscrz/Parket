import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { HomeScreenRevamped } from './components/HomeScreenRevamped';
import { ParkingNavigationScreen } from './components/ParkingNavigationScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ParkingHistoryScreen } from './components/ParkingHistoryScreen';
import { WalletScreen } from './components/WalletScreen';

type ScreenType = 'login' | 'home' | 'parking' | 'notifications' | 'profile' | 'history' | 'wallet';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const navigateToScreen = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (currentScreen === 'notifications' || currentScreen === 'wallet') {
      setCurrentScreen('home');
    } else if (currentScreen === 'history') {
      setCurrentScreen('profile');
    } else {
      setCurrentScreen('home');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!isLoggedIn) {
    return (
      <div className={`${darkMode ? 'dark' : ''}`}>
        <LoginScreen onLogin={handleLogin} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      {currentScreen === 'home' && (
        <HomeScreen
          onNavigateToParking={() => navigateToScreen('parking')}
          onNavigateToProfile={() => navigateToScreen('profile')}
          onNavigateToWallet={() => navigateToScreen('wallet')}
          onNavigateToNotifications={() => navigateToScreen('notifications')}
          darkMode={darkMode}
        />
      )}
      
      {currentScreen === 'parking' && (
        <ParkingNavigationScreen onBack={handleBack} darkMode={darkMode} />
      )}
      
      {currentScreen === 'notifications' && (
        <NotificationsScreen onBack={handleBack} darkMode={darkMode} />
      )}
      
      {currentScreen === 'profile' && (
        <ProfileScreen
          onBack={handleBack}
          onNavigateToHistory={() => navigateToScreen('history')}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentScreen === 'history' && (
        <ParkingHistoryScreen onBack={handleBack} darkMode={darkMode} />
      )}
      
      {currentScreen === 'wallet' && (
        <WalletScreen onBack={handleBack} darkMode={darkMode} />
      )}
    </div>
  );
}