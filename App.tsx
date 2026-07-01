import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import Routes from './src/navigation/Routes'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDB } from './src/utils/db';
import { syncOfflineAttendance } from './src/utils/sync';

const App = () => {
  useEffect(() => {
    const setupApp = async () => {
      // Initialize local database schema
      await initDB();
      // Run initial sync check
      await syncOfflineAttendance();
    };

    setupApp();

    // Sync offline queue every 30 seconds
    const interval = setInterval(() => {
      syncOfflineAttendance();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Routes />
    </SafeAreaProvider>
  )
}

export default App