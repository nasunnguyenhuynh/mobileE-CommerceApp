import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReviewProductScreen from './ReviewProductScreen';
import ReviewShopScreen from './ReviewShopScreen';
import ReviewCommentScreen from './ReviewCommentScreen';
//navigation
import { ReviewStackParamList } from '../types';

const ReviewStack = createMaterialTopTabNavigator<ReviewStackParamList>();
const ReviewScreen = ({ route }: { route: any }) => {
    const { productReview, shopReview, productRating, shopRating, productId } = route.params;

    return (
        <ReviewStack.Navigator
            screenOptions={{
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: { fontSize: 14, fontWeight: "400", "textTransform": "capitalize", },
                tabBarStyle: { backgroundColor: '#f5f5f5', },
                tabBarIndicatorStyle: { backgroundColor: 'tomato' },
            }}>
            <ReviewStack.Screen
                name="ReviewProductScreen"
                component={ReviewProductScreen}
                initialParams={{ productReview, productRating }}
                options={{
                    tabBarLabel: 'Review Product',
                }}>
            </ReviewStack.Screen>
            <ReviewStack.Screen
                name="ReviewShopScreen"
                component={ReviewShopScreen}
                initialParams={{ shopReview, shopRating }}
                options={{
                    tabBarLabel: 'Review Shop',
                }}>
            </ReviewStack.Screen>
            <ReviewStack.Screen
                name="ReviewCommentScreen"
                component={ReviewCommentScreen}
                initialParams={{ productId }}
                options={{
                    tabBarLabel: 'Comments',
                }}>
            </ReviewStack.Screen>
        </ReviewStack.Navigator>
    )
}

export default ReviewScreen
