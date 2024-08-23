import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductDetailScreen, SearchProductScreen, ReviewScreen, ShopScreen } from '../screens';
import { ProductStackParamList } from './types';

const ProductStack = createStackNavigator<ProductStackParamList>();

const ProductNavigator = () => {
    return (
        <ProductStack.Navigator
        // screenOptions={{ headerShown: false }}
        >
            <ProductStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ title: '' }} />
            <ProductStack.Screen name="SearchProductScreen" component={SearchProductScreen}
                options={{ headerShown: false }} />

            {/* <ProductStack.Screen name="ReviewScreen" component={ReviewScreen} /> */}
            <ProductStack.Screen name="ShopScreen" component={ShopScreen} options={{ title: '' }} />
        </ProductStack.Navigator>
    );
};

export default ProductNavigator;
