import React from 'react'
import { StatusBar, StyleSheet} from 'react-native'
import Routes from './src/navigation/Routes'

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Routes />
      </>
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