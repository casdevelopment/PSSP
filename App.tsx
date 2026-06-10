import React, { useEffect } from 'react'
import { StatusBar, StyleSheet} from 'react-native'
import Routes from './src/navigation/Routes'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDB } from './src/utils/db';

const App = () => {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Routes />
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: 'white',
  },
})