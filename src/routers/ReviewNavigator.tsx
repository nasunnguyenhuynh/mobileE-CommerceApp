import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { ReviewStackParamList } from './types';

import { ReviewScreen, ReviewFormScreen } from '../screens';

const ExtensionStack = createStackNavigator<ReviewStackParamList>();
const ReviewNavigator = () => {
    return (
        <ExtensionStack.Navigator>
            <ExtensionStack.Screen
                name='ReviewScreen' component={ReviewScreen}>
            </ExtensionStack.Screen>
            <ExtensionStack.Screen
                name='ReviewFormScreen' component={ReviewFormScreen}>
            </ExtensionStack.Screen>
        </ExtensionStack.Navigator>
    )
}

export default ReviewNavigator
