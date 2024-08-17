import React from 'react'
import { View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import {CartStackParamList} from '../../routers/types'

type Props = StackScreenProps<CartStackParamList, 'CartScreen'>;

const CartScreen = ({navigation}: Props) => {
    return (
        <View>
            <Text>Cart Screen</Text>
        </View>
    )
}

export default CartScreen
