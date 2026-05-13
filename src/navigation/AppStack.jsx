import MainTabs from './MainTabs';
import Attendance from '../screens/Attendance/Attendance';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName='MainTabs' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MainTabs' component={MainTabs} />
            <Stack.Screen name='Attendance' component={Attendance} />
        </Stack.Navigator>
    );
}