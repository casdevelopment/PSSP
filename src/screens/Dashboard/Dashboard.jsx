import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/AuthStore'
import PrimaryButton from '../../components/PrimaryButton'

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <PrimaryButton 
        title="Logout" 
        onPress={logout} 
        showChevron={false} 
        style={styles.logoutBtn} 
      />
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logoutBtn: {
    width: '100%',
  }
})