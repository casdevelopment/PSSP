import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Attendance from '../screens/Attendance/Attendance';
import AttendanceHistory from '../screens/Attendance/AttendanceHistory';
import LeaveRequests from '../screens/Leave/LeaveRequests';
import LeaveDetail from '../screens/Leave/LeaveDetail';
import { useAuthStore } from '../store/AuthStore';
import HeaderPlusButton from '../components/HeaderPlusButton';
import RequestLeaveModal from '../components/RequestLeaveModal';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    const user = useAuthStore((state) => state.user);
    const role = user?.role;
    
    // State to handle the modal at the stack level
    const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

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
                                <HeaderPlusButton onPress={() => setIsLeaveModalVisible(true)} />
                            ) : null
                        )
                    }}
                />
                
                <Stack.Screen
                    name='LeaveDetail'
                    component={LeaveDetail}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>

            {/* Modal is mounted here so it can lay over the stack cleanly */}
            <RequestLeaveModal 
                visible={isLeaveModalVisible} 
                onClose={() => setIsLeaveModalVisible(false)} 
            />
        </>
    );
}