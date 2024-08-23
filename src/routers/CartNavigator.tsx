import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { CartScreen } from '../screens';
import { CartStackParamList } from './types';

// navigate prodetail, payment
const CartStack = createStackNavigator<CartStackParamList>();

const CartNavigator = () => {
    return (
        <CartStack.Navigator>
            <CartStack.Screen name="CartScreen" component={CartScreen} />
        </CartStack.Navigator>
    );
};

export default CartNavigator
