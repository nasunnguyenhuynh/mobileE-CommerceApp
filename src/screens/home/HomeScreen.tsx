import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from "../../routers/types";
import Feather from "react-native-vector-icons/Feather"
// Components
import { ProductList, VoucherList, Cart, BubbleChat } from '../../components';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store';
import store from '../../redux/store';
import { loadCartFromStorage, loadVoucherFromStorage } from '../../redux/storage';
import { currentUser } from '../../redux/user/userSlice';
import { addProducts } from '../../redux/cart/cartSlice';
import { addVouchers } from '../../redux/voucher/voucherSlice';

type Props = StackScreenProps<HomeStackParamList, 'HomeScreen'>;
const HomeScreen = ({ navigation }: Props) => {

    const [search, setSearch] = useState('');

    // Get UserState, CartState, voucherState from redux-store
    const dispatch = useDispatch<AppDispatch>()
    const loadVoucherData = async () => {
        try {
            const data = await loadVoucherFromStorage(store.getState().auth?.token);
            if (data) {
                dispatch(addVouchers(data))
            }
        } catch (error) {
            console.error('Failed to load voucherData', error);
        }
    }

    const loadCartData = async () => {
        try {
            const data = await loadCartFromStorage(store.getState().auth?.token);
            if (data) {
                dispatch(addProducts(data))
            }
        } catch (error) {
            console.error('Failed to load cartData', error);
        }
    }
    useEffect(() => {
        if (!store.getState().user.info) {
            dispatch(currentUser())
        }
        loadVoucherData();
        loadCartData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Wrap_Top_Hompage */}
            <View>
                <View style={styles.wrapHeaderHompage}>
                    {/* Search */}
                    <View style={styles.inputContainer} >
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('ProductNavigator', {
                                screen: 'SearchProductScreen',
                                params: { data: search }
                            })
                        }}>
                            <Feather
                                name={"search"}
                                size={24}
                                color={"#9A9A9A"}
                                style={styles.inputIcon}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search"
                            onChangeText={setSearch}
                        />
                    </View>
                    {/* Cart_Chat */}
                    <View style={styles.wrapCartMessage}>
                        <Cart />
                        <BubbleChat />
                    </View>
                </View>
            </View>
            {/* VoucherList */}
            <View>
                <VoucherList />
            </View>
            <ProductList />
        </View >
    );
};
export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    wrapHeaderHompage: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    inputContainer: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 20,
        elevation: 10,
        alignItems: "center",
        height: 50,
        marginVertical: 10,
        flex: 2,
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        marginRight: 10,
    },
    wrapCartMessage: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end"
    },
})