import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native';
import Feather from "react-native-vector-icons/Feather"
import { Badge } from "react-native-elements";
// navigation
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
// redux
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
const Cart = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [countProduct, setCountProduct] = useState(0);
    const productList = useSelector((state: RootState) => state.cart.productList);
    useEffect(() => {
        let count = 0;
        productList.forEach(shop => count += shop.products.length);
        setCountProduct(count);
    }, [productList])

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('CartNavigator', {
                    screen: 'CartScreen'
                })
            }}
        >
            <View>
                <Feather
                    name={"shopping-cart"}
                    size={30}
                    color={"black"}
                />
                <Badge
                    badgeStyle={{
                        backgroundColor: "#cf3131",
                    }}
                    containerStyle={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                    }}
                    status="error"
                    textProps={{}}
                    textStyle={{
                        fontSize: 10,
                    }}
                    value={countProduct}
                />
            </View>
        </TouchableOpacity>
    )
}

export default Cart
