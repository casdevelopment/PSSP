import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Attendance from '../screens/Attendance/Attendance';
import AttendanceHistory from '../screens/Attendance/AttendanceHistory';
import LeaveRequests from '../screens/Leave/LeaveRequests';
import LeaveDetail from '../screens/Leave/LeaveDetail';
import { useAuthStore } from '../store/AuthStore';
import HeaderPlusButton from '../components/HeaderPlusButton';
import RequestLeaveModel from '../components/RequestLeaveModel';
import StudentDetail from '../screens/Students/StudentDetail';
import StaffDetail from '../screens/staff/StaffDetails';
import SalaryHistory from '../screens/Salary/SalaryHistory';
import SalaryDetail from '../screens/Salary/SalaryDetail';
import StaffSalaryDetails from '../screens/Salary/StaffSalaryDetails';
// FIXED: Changed TimeTable to Timetable
import ClassDetails from '../screens/Timetable/ClassDetails'; 

const Stack = createNativeStackNavigator();

export default function AppStack() {
    const user = useAuthStore((state) => state.user);
    const role = user?.role;

    const [isLeavemodelVisible, setIsLeavemodelVisible] = useState(false);

    return (
        <>
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
                        headerRight: () => (
                            (role === 'principal' || role === 'staff') ? (
                                <HeaderPlusButton onPress={() => setIsLeavemodelVisible(true)} />
                            ) : null
                        )
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
                <Stack.Screen name="ClassDetails" component={ClassDetails} options={{ headerShown: false }} />
            </Stack.Navigator>

            <RequestLeaveModel
                visible={isLeavemodelVisible}
                onClose={() => setIsLeavemodelVisible(false)}
            />
        </>
    );
}