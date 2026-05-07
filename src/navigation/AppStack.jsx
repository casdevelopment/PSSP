import Dashboard from '../screens/Dashboard/Dashboard';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Dashboard' component={Dashboard} />
        </Stack.Navigator>
    );
}