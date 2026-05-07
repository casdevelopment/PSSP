import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuthStore } from '../store/AuthStore';

export default function Routes() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    console.log('isAuthenticated:', isAuthenticated);
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}