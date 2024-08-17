import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen, ExtensionShopScreen } from '../screens';
import { ProfileStackParamList } from './types';

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />

            <ProfileStack.Screen name="ExtensionShopScreen" component={ExtensionShopScreen} />
        </ProfileStack.Navigator>
    );
};

export default ProfileNavigator;