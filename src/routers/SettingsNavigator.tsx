// src/navigation/SettingsNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsScreen, ProfileScreen } from '../screens';
import { SettingsStackParamList } from './types';

const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="ProfileScreen" component={ProfileScreen} />
            <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
        </SettingsStack.Navigator>
    );
};

export default SettingsNavigator;
