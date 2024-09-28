import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { ReviewStackParamList } from './types';

import { ReviewScreen, ReviewFormScreen } from '../screens';

const ReviewStack = createStackNavigator<ReviewStackParamList>();
const ReviewNavigator = () => {
    return (
        <ReviewStack.Navigator>
            <ReviewStack.Screen
                name='ReviewScreen' component={ReviewScreen}>
            </ReviewStack.Screen>
            <ReviewStack.Screen
                name='ReviewFormScreen' component={ReviewFormScreen}>
            </ReviewStack.Screen>
        </ReviewStack.Navigator>
    )
}

export default ReviewNavigator
