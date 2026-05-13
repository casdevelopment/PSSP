import MainTabs from './MainTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName='MainTabs' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MainTabs' component={MainTabs} />
        </Stack.Navigator>
    );
}