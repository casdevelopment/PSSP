import React, { useState } from 'react';
import { View } from 'react-native';
import { theme } from '../theme/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Attendance from '../screens/Attendance/Attendance';
import AttendanceHistory from '../screens/Attendance/AttendanceHistory';
import LeaveRequests from '../screens/Leave/LeaveRequests';
import LeaveRequestsManagement from '../screens/Leave/LeaveRequestsManagement';
import LeaveDetail from '../screens/Leave/LeaveDetail';
import { useAuthStore } from '../store/AuthStore';
import HeaderPlusButton from '../components/HeaderPlusButton';
import StudentDetail from '../screens/Students/StudentDetail';
import StaffDetail from '../screens/staff/StaffDetails';
import SalaryHistory from '../screens/Salary/SalaryHistory';
import SalaryDetail from '../screens/Salary/SalaryDetail';
import StaffSalaryDetails from '../screens/Salary/StaffSalaryDetails';
import SalaryDistribution from '../screens/Salary/SalaryDistribution';
import ExpenseDetails from '../screens/Expenses/ExpenseDetails';
import SchoolDetail from '../screens/Schools/SchoolDetail';
import MySchedule from '../screens/Timetable/MySchedule';
import Settings from '../screens/Profile/Settings';
import LiveChat from '../screens/Profile/LiveChat';
import HelpCenter from '../screens/Profile/HelpCenter';
import ArticleList from '../screens/Profile/ArticleList';
import NotificationSettings from '../screens/Profile/NotificationSettings';
import Notifications from '../screens/Profile/Notifications';
import ChangePassword from '../screens/Profile/ChangePassword';
import EditProfile from '../screens/Profile/EditProfile';
// FIXED: Changed TimeTable to Timetable
import ClassDetails from '../screens/Timetable/ClassDetails';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    const role = useAuthStore((state) => state.userType);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
            <Stack.Navigator initialRouteName='MainTabs'>
                <Stack.Screen name='MainTabs' component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name='Attendance' component={Attendance} />
                <Stack.Screen name='AttendanceHistory' component={AttendanceHistory} options={{ headerShown: false }} />

                <Stack.Screen name='LeaveRequests' component={LeaveRequests}
                    options={{
                        title: 'Leave Requests',
                        headerTitle: 'Leave Requests',
                        headerTitleStyle: {
                            fontSize: 20,
                            fontWeight: '600',
                        },
                    }}
                />

                <Stack.Screen
                    name='LeaveRequestsManagement'
                    component={LeaveRequestsManagement}
                    options={{
                        title: 'Leave Management',
                        headerTitle: 'Leave Management',
                        headerTitleStyle: {
                            fontSize: 20,
                            fontWeight: '600',
                        },
                    }}
                />

                <Stack.Screen
                    name='LeaveDetail'
                    component={LeaveDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='StudentDetail'
                    component={StudentDetail}
                    options={{ headerShown: false }}
                />

                {/* Salary Routing */}
                <Stack.Screen
                    name="SalaryHistory"
                    component={SalaryHistory}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SalaryDetail"
                    component={SalaryDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StaffDetail"
                    component={StaffDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StaffSalaryDetails"
                    component={StaffSalaryDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SalaryDistribution"
                    component={SalaryDistribution}
                    options={{
                        title: 'Salary Distribution',
                        headerTitle: 'Salary Distribution',
                        headerTitleStyle: {
                            fontSize: 20,
                            fontWeight: '600',
                        },
                    }}
                />
                <Stack.Screen name="ClassDetails" component={ClassDetails} options={{ headerShown: false }} />
                <Stack.Screen name="ExpenseDetails" component={ExpenseDetails} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                <Stack.Screen name="LiveChat" component={LiveChat} options={{ headerShown: false }} />
                <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ headerShown: false }} />
                <Stack.Screen name="ArticleList" component={ArticleList} options={{ headerShown: false }} />
                <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ headerShown: false }} />
                <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen
                    name="SchoolDetail"
                    component={SchoolDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="MySchedule" component={MySchedule} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            </Stack.Navigator>

        </View>
    );
}