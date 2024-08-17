import React, { useEffect } from 'react'
import { HomeScreen, ProfileScreen } from '../screens';
import { HomeStackParamList } from './types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"

const HomeStack = createBottomTabNavigator<HomeStackParamList>();

const HomeNavigator = () => {
    return (
        <HomeStack.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'HomeScreen') {
                        iconName = focused
                            ? 'ios-information-circle'
                            : 'ios-information-circle-outline';
                    } else if (route.name === 'ProfileScreen') {
                        iconName = focused ? 'ios-list-box' : 'ios-list';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
            })}
            initialRouteName="HomeScreen"
        >
            <HomeStack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign
                            name={"home"}
                            size={size}
                            color={color}
                        // style={styles.socialIcon}
                        />
                    ),
                }} />
            <HomeStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign
                            name={"user"}
                            size={size}
                            color={color}
                        // style={styles.socialIcon}
                        />
                    ),
                }} />
        </HomeStack.Navigator>
    );
};

export default HomeNavigator
