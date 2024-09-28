import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderConfirmingScreen from './OrderConfirmingScreen'
import OrderPackingScreen from './OrderPackingScreen';
import OrderDeliveringScreen from './OrderDeliveringScreen'
import OrderDeliveredScreen from './OrderDeliveredScreen'
import OrderCanceledScreen from './OrderCanceledScreen'
import OrderReturnedScreen from './OrderReturnedScreen'
// navigation
import { OrderScreenStackParamList } from '../types'
const OrderStack = createMaterialTopTabNavigator<OrderScreenStackParamList>();
const OrderScreen = ({ route }: { route: any }) => {
    const { orderConfirming, orderPacking, orderDelivering, orderDelivered, orderCanceled, orderReturned } = route.params;

    return (
        <OrderStack.Navigator
            initialRouteName="OrderConfirmingScreen"
            screenOptions={{
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: { fontSize: 14, fontWeight: "400", "textTransform": "capitalize", },
                tabBarStyle: { backgroundColor: '#f5f5f5' },
                tabBarIndicatorStyle: { backgroundColor: 'tomato' },
                swipeEnabled: true,
                tabBarScrollEnabled: true,
            }}
        >
            <OrderStack.Screen
                name="OrderConfirmingScreen"
                component={OrderConfirmingScreen}
                initialParams={{ orderConfirming }}
                options={{
                    tabBarLabel: 'Confirming',
                }}
            />
            <OrderStack.Screen
                name="OrderPackingScreen"
                component={OrderPackingScreen}
                initialParams={{ orderPacking }}
                options={{
                    tabBarLabel: 'Packing',
                }}
            />
            <OrderStack.Screen
                name="OrderDeliveringScreen"
                component={OrderDeliveringScreen}
                initialParams={{ orderDelivering }}
                options={{
                    tabBarLabel: 'Delivering',
                }}
            />
            <OrderStack.Screen
                name="OrderDeliveredScreen"
                component={OrderDeliveredScreen}
                initialParams={{ orderDelivered }}
                options={{
                    tabBarLabel: 'Delivered',
                }}
            />
            <OrderStack.Screen
                name="OrderCanceledScreen"
                component={OrderCanceledScreen}
                initialParams={{ orderCanceled }}
                options={{
                    tabBarLabel: 'Canceled',
                }}
            />
            <OrderStack.Screen
                name="OrderReturnedScreen"
                component={OrderReturnedScreen}
                initialParams={{ orderReturned }}
                options={{
                    tabBarLabel: 'Returned',
                }}
            />
        </OrderStack.Navigator>
    )
}

export default OrderScreen
