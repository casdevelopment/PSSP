import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Auth/Splash';
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import Onboarding from '../screens/Auth/Onboarding';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Splash' component={Splash} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
            <Stack.Screen name='Onboarding' component={Onboarding} />
        </Stack.Navigator>
    );
}
    