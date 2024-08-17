import { API_KEY } from "@env";
import React from 'react'
import { View, Text } from 'react-native'

const ShopScreen = () => {
    return (
        <View>
            <Text>Shop Screen</Text>
            <Text>{API_KEY}</Text>
        </View>
    )
}

export default ShopScreen
