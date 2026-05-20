import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';

// Screens
import Dashboard from '../screens/Dashboard/Dashboard';
import Attendance from '../screens/Attendance/Attendance';
import Profile from '../screens/Profile/Profile';
import Students from '../screens/Students/Students';

// Components
import HeaderPlusButton from '../components/HeaderPlusButton';
import AddStudentModal from '../components/AddStudentModal'; // <-- Import the new modal

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

export default function MainTabs() {
  const role = useAuthStore((state) => state.role);
  
  // State to handle the Add Student modal
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Staff') {
              iconName = 'users';
            } else if (route.name === 'Timetable') {
              iconName = 'calendar';
            } else if (route.name === 'Salary') {
              iconName = 'dollar-sign';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            } else if (route.name === 'Schools') {
              iconName = 'trello'; // nearest matching feather icon for building 
            } else if (route.name === 'Expenses') {
              iconName = 'file-text';
            } else if (route.name === 'Attendance') {
              iconName = 'clipboard';
            } else if (route.name === 'Students') {
              iconName = 'book-open';
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          headerShown: true, // Enable headers for all screens
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderSubtle,
            paddingTop: 10,
            paddingBottom: 20,
            height: 80,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 10,
            position: 'absolute',
            bottom: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} />
        
        {role === 'coordinator' ? (
          <>
            <Tab.Screen name="Schools">
              {() => <PlaceholderScreen name="Schools" />}
            </Tab.Screen>
            <Tab.Screen name="Salary">
              {() => <PlaceholderScreen name="Salary" />}
            </Tab.Screen>
            <Tab.Screen name="Expenses">
              {() => <PlaceholderScreen name="Expenses" />}
            </Tab.Screen>
          </>
        ) : role === 'staff' ? (
          <>
            <Tab.Screen name="Attendance" component={Attendance} />
            <Tab.Screen 
              name="Students" 
              component={Students} 
              options={{
                title: 'My Students',
                headerTitle: 'My Students',
                headerTitleStyle: {
                  fontSize: 22,
                  fontWeight: '800',
                },
                headerRight: () => (
                  // Trigger modal visibility here
                  <HeaderPlusButton onPress={() => setIsAddStudentModalVisible(true)} />
                )
              }}
            />
            <Tab.Screen name="Salary">
              {() => <PlaceholderScreen name="Salary" />}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen name="Staff">
              {() => <PlaceholderScreen name="Staff" />}
            </Tab.Screen>
            <Tab.Screen name="Timetable">
              {() => <PlaceholderScreen name="Timetable" />}
            </Tab.Screen>
            <Tab.Screen name="Salary">
              {() => <PlaceholderScreen name="Salary" />}
            </Tab.Screen>
          </>
        )}

        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>

      {/* Render the modal at the top level of the tab navigator */}
      <AddStudentModal 
        visible={isAddStudentModalVisible} 
        onClose={() => setIsAddStudentModalVisible(false)} 
      />
    </>
  );
}