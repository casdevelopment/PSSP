import MainTabs from './MainTabs';
import Attendance from '../screens/Attendance/Attendance';
import AttendanceHistory from '../screens/Attendance/AttendanceHistory';
import LeaveRequests from '../screens/Leave/LeaveRequests';
import LeaveDetail from '../screens/Leave/LeaveDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName='MainTabs' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MainTabs' component={MainTabs} />
            <Stack.Screen name='Attendance' component={Attendance} />
            <Stack.Screen name='AttendanceHistory' component={AttendanceHistory} />
            <Stack.Screen name='LeaveRequests' component={LeaveRequests} />
            <Stack.Screen name='LeaveDetail' component={LeaveDetail} />
        </Stack.Navigator>
    );
}