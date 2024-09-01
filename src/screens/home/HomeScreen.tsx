import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from "../../routers/types";
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import { Badge } from "react-native-elements";
import { ProductList } from '../../components';
import { VoucherList } from '../../components';
// Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store';
import store from '../../redux/store';
import { loadCartFromStorage, loadVoucherFromStorage } from '../../redux/storage';
import { currentUser } from '../../redux/user/userSlice';
import { addProducts } from '../../redux/cart/cartSlice';
import { addVouchers } from '../../redux/voucher/voucherSlice';

type Props = StackScreenProps<HomeStackParamList, 'HomeScreen'>;
const HomeScreen = ({ navigation }: Props) => {
    const numberMessage = 12;
    const [countProduct, setCountProduct] = useState(0);
    const [search, setSearch] = useState('');
    const [cartData, setCartData] = useState<any>(null);
    const [voucherData, setVoucherData] = useState<any>(null);
    // Get UserState, CartState, voucherState from redux-store
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                dispatch(currentUser())
                const data = await loadCartFromStorage(store.getState().auth?.token);
                if (data) {
                    dispatch(addProducts(data)) // copy from cartLocalStoarge -> cartSlice
                    let count = 0
                    data.map((shop: any) => {
                        count += shop.products.length
                    })
                    setCountProduct(count)
                }
                //setCartData(data); // Set the fetched data to state
            } catch (error) {
                console.error('Failed to fetch cart data', error);
            }
        };
        const fetchVoucherData = async () => {
            try {
                const data = await loadVoucherFromStorage(store.getState().auth?.token);
                if (data) {
                    dispatch(addVouchers(data))
                }
            } catch (error) {
                console.error('Failed to fetch voucher data', error);
            }
        }
        if (!cartData) {
            fetchCartData();
        }
        if (!voucherData) {
            fetchVoucherData();
        }
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
                        <TouchableOpacity>
                            <View>
                                <Ionicons
                                    name={"chatbubbles-outline"}
                                    size={30}
                                    color={"black"}
                                    style={{ marginLeft: 12 }}
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
                                    value={numberMessage}
                                />
                            </View>
                        </TouchableOpacity>
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