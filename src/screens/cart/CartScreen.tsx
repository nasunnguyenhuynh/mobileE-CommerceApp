import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { CartStackParamList } from '../../routers/types'
import { ShopCard } from '../../components';
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

// Redux
import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import store from '../../redux/store';
import { toggleSelectAll } from '../../redux/cart/cartSlice';
type Props = StackScreenProps<CartStackParamList, 'CartScreen'>;
// navigate shop, prodetail, payment
// ----- voucher :

const CartScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const { productList } = useSelector((state: RootState) => state.cart);
    const { isSelectAll } = useSelector((state: RootState) => state.cart);
    // Modal
    const transparent = 'rgba(0,0,0,0.5)';
    const [openModel, setOpenModal] = useState(false);

    const handleSelectAllChange = () => {
        dispatch(toggleSelectAll());
    };

    const handlePurchase = () => {
        const product = store.getState().cart.productList.find(shop =>
            shop.products.find(product => product.isSelected === true))
        if (product) {
            // navigate to be4 payment
            navigation.navigate('PaymentNavigator', {
                screen: 'PaymentScreen'
            })

        } else {
            setOpenModal(true)
            const timeout = setTimeout(() => {
                setOpenModal(false)
            }, 800);

            return () => clearTimeout(timeout)
        }

    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ paddingHorizontal: 10, marginTop: 10 }}
            >
                {productList && productList.map((shop) => (
                    <ShopCard
                        key={shop.shopId}

                        shopId={shop.shopId}
                        products={shop.products}
                        isSelected={shop.isSelected}
                    />
                ))}
            </ScrollView>
            <View style={styles.containerPurchase}>
                <View style={styles.wrapSelectAll}>
                    <TouchableOpacity
                        onPress={() => handleSelectAllChange()}
                    >
                        <MaterialIcons
                            name={isSelectAll ? "check-box" : "check-box-outline-blank"}
                            size={30}
                            color={isSelectAll ? "#22a779" : "#ccc"}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.shopText}>
                            Select All
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.wrapPurchaseButton} onPress={handlePurchase}>
                    <Text style={styles.purchaseText}>Purchase</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={openModel}
                animationType="fade"
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={{
                        position: "absolute",
                        backgroundColor: transparent,
                        padding: 15,
                        width: "60%",
                        borderRadius: 10,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <AntDesign name="infocirlce" size={30} color="#fff" />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>Please choose the product</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CartScreen

const styles = StyleSheet.create({
    containerPurchase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingLeft: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10
    },
    // wrapSelectAll
    wrapSelectAll: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    shopText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkbox: {
        marginRight: 10,
    },
    wrapPurchaseButton: {
        backgroundColor: 'tomato',
        paddingVertical: 20,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    purchaseText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})