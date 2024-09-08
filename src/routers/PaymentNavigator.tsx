import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { 
    PaymentScreen, 
    PaymentMethodScreen, 
    ReceiverInformationScreen, 
    ShippingUnitScreen, 
    SelectingVoucherScreen } from '../screens';
import { PaymentStackParamList } from './types';

const PaymentStack = createStackNavigator<PaymentStackParamList>();

const PaymentNavigator = () => {
    return (
        <PaymentStack.Navigator>
            <PaymentStack.Screen name="PaymentScreen" component={PaymentScreen} />
            <PaymentStack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
            <PaymentStack.Screen name="ReceiverInformationScreen" component={ReceiverInformationScreen} />
            <PaymentStack.Screen name="ShippingUnitScreen" component={ShippingUnitScreen} />
            <PaymentStack.Screen name="SelectingVoucherScreen" component={SelectingVoucherScreen} />
        </PaymentStack.Navigator>
    );
};

export default PaymentNavigator
