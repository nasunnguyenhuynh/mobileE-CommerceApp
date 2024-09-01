import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './types'
import HomeNavigator from './HomeNavigator'
import SettingsNavigator from './SettingsNavigator'
import AuthNavigator from './AuthNavigator'
import ExtensionNavigator from './ExtensionNavigator'
import ProductNavigator from './ProductNavigator'
import ReviewNavigator from './ReviewNavigator'
import CartNavigator from './CartNavigator'
import PaymentNavigator from './PaymentNavigator'

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="AuthNavigator"
        >
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
            <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
            <Stack.Screen name="ProductNavigator" component={ProductNavigator} />
            <Stack.Screen name="ReviewNavigator" component={ReviewNavigator} />
            <Stack.Screen name="CartNavigator" component={CartNavigator} />
            <Stack.Screen name="PaymentNavigator" component={PaymentNavigator} />

            <Stack.Screen name="SettingsNavigator" component={SettingsNavigator} />
            <Stack.Screen name="ExtensionNavigator" component={ExtensionNavigator} />
        </Stack.Navigator>
    )
}

export default MainNavigator
