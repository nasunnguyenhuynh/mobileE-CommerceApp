import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { VoucherConditionScreen } from '../screens';
import { VoucherStackParamList } from './types';

const VoucherStack = createStackNavigator<VoucherStackParamList>();
const VoucherNavigator = () => {
    return (
        <VoucherStack.Navigator>
            <VoucherStack.Screen name="VoucherConditionScreen" component={VoucherConditionScreen} />
        </VoucherStack.Navigator>
    )
}

export default VoucherNavigator
