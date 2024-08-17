// src/navigation/SettingsNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ShopScreen } from '../screens';
import { ShopStackParamList } from './types';

const ShopStack = createStackNavigator<ShopStackParamList>();

const ShopNavigator = () => {
    return (
        <ShopStack.Navigator>
            <ShopStack.Screen name="ShopScreen" component={ShopScreen} />
        </ShopStack.Navigator>
    );
};

export default ShopNavigator;
