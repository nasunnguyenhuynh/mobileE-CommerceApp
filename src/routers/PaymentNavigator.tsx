import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { PaymentScreen, ReceiverInformationScreen } from '../screens';
import { PaymentStackParamList } from './types';

// navigate prodetail, payment
const PaymentStack = createStackNavigator<PaymentStackParamList>();

const PaymentNavigator = () => {
    return (
        <PaymentStack.Navigator>
            <PaymentStack.Screen name="PaymentScreen" component={PaymentScreen} />
            <PaymentStack.Screen name="ReceiverInformationScreen" component={ReceiverInformationScreen}
                options={{
                    // title: 'Address and Phone List'
                    // headerShown: false
                }} />
        </PaymentStack.Navigator>
    );
};

export default PaymentNavigator
