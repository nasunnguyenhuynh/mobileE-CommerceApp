import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { CartStackParamList } from '../../routers/types'
import { ShopCard, ProductCard } from '../../components';
import { Shop } from '../../interfaces/shop';
import { Product } from '../../interfaces/product';
import { SelectedProductList } from '../../interfaces/product';

// Redux
import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import store from '../../redux/store';
type Props = StackScreenProps<CartStackParamList, 'CartScreen'>;
// navigate shop, prodetail, payment

// #### Be4 payment
// ----- product :  
//  + selectAll/selectProducts -> Create state for tracking 'selectedProduct' (save id)
//  + inc/des quantity -> add product to 'selectedProduct' state (!tracking), update cartSlice for product_quantity (loop id and update ), quantity=0 -> removeProduct (asking be4 remove)
//  + removeProduct
// ----- voucher :


// Loop cartSlice -> renderProducts
// ShopCard > ProductCard + VoucherCard
const CartScreen = ({ navigation }: Props) => {
    const { productList } = useSelector((state: RootState) => state.cart);

    return (
        <View>
            <ScrollView
                style={{ paddingHorizontal: 10, marginTop: 10 }}
            >
                {productList && productList.map((shop) => (
                    <ShopCard
                        key={shop.shopId}
                        shopId={shop.shopId}
                        products={shop.products}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

export default CartScreen
