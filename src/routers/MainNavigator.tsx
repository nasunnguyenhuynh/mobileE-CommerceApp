import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { RootStackParamList } from './types'
import HomeNavigator from './HomeNavigator'
import ProfileNavigator from './ProfileNavigator'
import SettingsNavigator from './SettingsNavigator'
import AuthNavigator from './AuthNavigator'
import ExtensionNavigator from './ExtensionNavigator'
import ProductNavigator from './ProductNavigator'
import ReviewNavigator from './ReviewNavigator'
import CartNavigator from './CartNavigator'
import PaymentNavigator from './PaymentNavigator'
import VoucherNavigator from './VoucherNavigator'
import OrderNavigator from './OrderNavigator'

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="AuthNavigator"
        >
            <Stack.Screen name="AuthNavigator" component={AuthNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="HomeNavigator" component={HomeNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="ProductNavigator" component={ProductNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="ReviewNavigator" component={ReviewNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="CartNavigator" component={CartNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="PaymentNavigator" component={PaymentNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="VoucherNavigator" component={VoucherNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="OrderNavigator" component={OrderNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="SettingsNavigator" component={SettingsNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
            <Stack.Screen name="ExtensionNavigator" component={ExtensionNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS
                }}
            />
        </Stack.Navigator>
    )
}

export default MainNavigator
