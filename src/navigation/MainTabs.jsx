import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/AuthStore';
import SchoolsList from '../screens/Schools/SchoolsList';

// Screens
import Dashboard from '../screens/Dashboard/Dashboard';
import Attendance from '../screens/Attendance/Attendance';
import Profile from '../screens/Profile/Profile';
import Students from '../screens/Students/Students';
import Staff from '../screens/staff/StaffList';
import MySalary from '../screens/Salary/MySalary';
import SalaryDistribution from '../screens/Salary/SalaryDistribution';
import Timetable from '../screens/Timetable/Timetable';
import ExpenseRequests from '../screens/Expenses/ExpenseRequests';

// Components
import HeaderPlusButton from '../components/HeaderPlusButton';
import AddStudentModel from '../components/AddStudentModel';
import AddStaffModel from '../components/AddStaffModel';
import AddScheduleModal from '../components/AddScheduleModal';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

export default function MainTabs() {
  const role = useAuthStore((state) => state.userType);
  const [isAddStudentmodelVisible, setIsAddStudentmodelVisible] = useState(false);
  const [isAddStaffmodelVisible, setIsAddStaffmodelVisible] = useState(false);
  const [isAddScheduleModalVisible, setIsAddScheduleModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            // Map icon strictly by route name
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Staff') iconName = 'users';
            else if (route.name === 'Timetable') iconName = 'calendar';
            else if (route.name === 'Salary' || route.name === 'Salary Management' || route.name === 'SalaryDistribution') iconName = 'dollar-sign';
            else if (route.name === 'Profile') iconName = 'user';
            else if (route.name === 'Schools') iconName = 'trello';
            else if (route.name === 'Expenses') iconName = 'file-text';
            else if (route.name === 'Attendance') iconName = 'clipboard';
            else if (route.name === 'Students') iconName = 'book-open';

            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          headerShown: true,
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
            shadowOffset: { width: 0, height: -4 },
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
            <Tab.Screen
              name="Schools"
              component={SchoolsList}
              // options={{ headerShown: false }}
              options={{
                title: 'Schools',
                headerTitle: 'My Schools',
                headerTitleStyle: { fontSize: 20, fontWeight: '600' },
              }}
            />
            <Tab.Screen
              name="Salary Management"
              component={SalaryDistribution}
              options={{ headerShown: true, title: 'Salary' }}
            />
            <Tab.Screen
              name="Expenses"
              component={ExpenseRequests}
              options={{
                title: 'Expenses',
                headerTitle: 'Expenses Requests',
                headerTitleStyle: { fontSize: 20, fontWeight: '600' },
              }}
            />
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
                headerTitleStyle: { fontSize: 20, fontWeight: '600' },
                headerRight: () => <HeaderPlusButton onPress={() => setIsAddStudentmodelVisible(true)} />
              }}
            />
            <Tab.Screen name="Salary" component={MySalary} options={{ headerShown: true }} />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Staff"
              component={Staff}
              options={{
                title: 'Staff',
                headerTitle: 'Staff Management',
                headerTitleStyle: { fontSize: 20, fontWeight: '600' },
                headerRight: () => <HeaderPlusButton onPress={() => setIsAddStaffmodelVisible(true)} />
              }}
            />
            {/* <Tab.Screen
              name="Timetable"
              component={Timetable}
              options={{
                headerTitleStyle: { fontSize: 20, fontWeight: '600', color: theme.colors.textHeading },
                headerRight: () => <HeaderPlusButton onPress={() => setIsAddScheduleModalVisible(true)} />
              }}
            /> */}
            <Tab.Screen
              name="Expenses"
              component={ExpenseRequests}
              options={{
                title: 'Expenses',
                headerTitle: 'Expenses Requests',
                headerTitleStyle: { fontSize: 20, fontWeight: '600' },
              }}
            />
            <Tab.Screen
              name="Salary Management"
              component={MySalary}
              options={{
                title: 'Salary',
                headerTitle: 'Salary Management',
              }}
            />
          </>
        )}

        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>

      <AddScheduleModal
        visible={isAddScheduleModalVisible}
        onClose={() => setIsAddScheduleModalVisible(false)}
      />
      <AddStudentModel
        visible={isAddStudentmodelVisible}
        onClose={() => setIsAddStudentmodelVisible(false)}
      />
      <AddStaffModel
        visible={isAddStaffmodelVisible}
        onClose={() => setIsAddStaffmodelVisible(false)}
      />
    </>
  );
}