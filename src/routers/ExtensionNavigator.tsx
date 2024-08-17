import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExtensionStackParamList } from './types';
import { ExtensionActivityScreen, ExtensionShopScreen } from '../screens';

const ExtensionStack = createNativeStackNavigator<ExtensionStackParamList>();

const ExtensionNavigator = () => {
    return (
        <ExtensionStack.Navigator screenOptions={{ headerShown: false }}>
            <ExtensionStack.Screen name='ExtensionActivityScreen' component={ExtensionActivityScreen}></ExtensionStack.Screen>
            <ExtensionStack.Screen name='ExtensionShopScreen' component={ExtensionShopScreen}></ExtensionStack.Screen>
            {/* Ex1,   Ex2,  Ex3 */}
        </ExtensionStack.Navigator>
    );
};

export default ExtensionNavigator
