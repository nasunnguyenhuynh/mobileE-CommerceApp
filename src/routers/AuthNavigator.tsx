import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { Login, Signup, LoginWithSMS, VerifyOTP } from '../screens'
import HomeNavigator from './HomeNavigator';

const Stack = createNativeStackNavigator<AuthStackParamList>()
const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="LoginWithSMS" component={LoginWithSMS} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTP} />

            <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
        </Stack.Navigator>
    )
}

export default AuthNavigator
