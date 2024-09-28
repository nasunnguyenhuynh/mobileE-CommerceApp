import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { OrderStackParamList } from './types';

import { OrderScreen } from '../screens';

const OrderStack = createStackNavigator<OrderStackParamList>();
const OrderNavigator = () => {
    return (
        <OrderStack.Navigator>
            <OrderStack.Screen
                options={{ title: 'Order History' }}
                name='OrderScreen' component={OrderScreen}>
            </OrderStack.Screen>
        </OrderStack.Navigator>
    )
}

export default OrderNavigator
