import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, } from 'react-native';
import { Badge } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../../constants/colors';
import { authAPI, endpoints } from '../../utils/api';
// Components
import { ExtensionElement, OrderProcessElement, Cart } from '../../components';
// Redux
import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { currentUser, clearUser } from '../../redux/user/userSlice';
import { logout } from '../../redux/auth/authSlice';
import { getShopConfirmation, clearShopConfirmation } from '../../redux/user/userShopConfirmationSlice';
import { clearCart } from '../../redux/cart/cartSlice';
import { clearVoucher } from '../../redux/voucher/voucherSlice';
import { clearReInfo } from '../../redux/reInfo/receiverInformationSlice';
import { clearLocalStorage } from '../../redux/storage';
import { saveCartToStorage, saveVoucherToStorage } from '../../redux/storage';
import store from '../../redux/store';
// interfaces
import { Order } from '../../interfaces/order';
// Navigation
import { HomeStackParamList } from '../../routers/types';
import { StackScreenProps } from '@react-navigation/stack';
type Props = StackScreenProps<HomeStackParamList, 'ProfileScreen'>;

const ProfileScreen = ({ navigation }: Props) => {
    // const navigation = useNavigation<ProfileScreenNavigationProp>();
    const dispatch = useDispatch<AppDispatch>()
    const {
        status: user_status,
        info: user_info,
        error: user_error
    } = useSelector((state: RootState) => state.user);
    const {
        status: shopConfirmation_status,
        info: shopConfirmation_info,
        error: shopConfirmation_error
    } = useSelector((state: RootState) => state.userShopConfirmation);


    // Cart_Chat
    const numberMessage = 12;
    const numberProductInCart = 27;

    // Profile
    const handleEditProfile = () => {
        navigation.navigate('ProfileNavigator', { screen: 'EditProfileScreen' })
    }

    // Order
    const [order, setOrder] = useState<Order[]>([]);
    const [orderConfirming, setOrderConfirming] = useState<Order[]>([]);
    const [orderPacking, setOrderPacking] = useState<Order[]>([]);
    const [orderDelivering, setOrderDelivering] = useState<Order[]>([]);
    const [orderDelivered, setOrderDelivered] = useState<Order[]>([]);
    const [orderNotRated, setOrderNotRated] = useState<Order[]>([]);
    const [orderCanceled, setOrderCanceled] = useState<Order[]>([]);
    const [orderReturned, setOrderReturned] = useState<Order[]>([]);

    const classifyOrders = (orders: Order[]) => {
        const confirming: Order[] = [];
        const packing: Order[] = [];
        const delivering: Order[] = [];
        const delivered: Order[] = [];
        const notRated: Order[] = [];
        const canceled: Order[] = [];
        const returned: Order[] = [];

        orders.forEach(order => {
            const status = order.status;
            switch (status) {
                case "Order Handling":
                    confirming.push(order);
                    break;
                case "Paid":
                    confirming.push(order);
                    break;
                case "Order Packing":
                    packing.push(order);
                    break;
                case "Order Delivering":
                    delivering.push(order);
                    break;
                case "Order Delivered":
                    delivered.push(order);
                    break;
                case "Order Canceled":
                    canceled.push(order);
                    break;
                default:
                    break;
            }
        });

        delivered.forEach(order => {
            if (!order.product_review || !order.shop_review) {
                notRated.push(order);
            }
        })

        setOrderConfirming(confirming);
        setOrderPacking(packing);
        setOrderDelivering(delivering);
        setOrderDelivered(delivered);
        setOrderNotRated(notRated);
        setOrderCanceled(canceled);
        setOrderReturned(returned);
    };

    const fetchOrder = async () => {// refresh, 1st_mounted
        try {
            const axiosInstance = await authAPI();
            const dataOrder = await axiosInstance.get(endpoints.order(store.getState().user.info?.id));
            setOrder(dataOrder.data);
            classifyOrders(dataOrder.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    //Refresh ProfileScreen
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        dispatch(currentUser());
    };

    useEffect(() => {
        if (user_status === 'success' && user_info?.id) {
            dispatch(getShopConfirmation(user_info.id));
            fetchOrder();
        }
    }, [user_info]);

    const handleShop = () => {
        navigation.navigate('ExtensionNavigator', {
            screen: 'ExtensionShopScreen'
        })
    };

    const handleLogout = () => { //removeToken & resetState
        saveCartToStorage(store.getState().cart?.productList, store.getState().auth?.token)
        saveVoucherToStorage(store.getState().voucher?.vouchers, store.getState().auth?.token)
        dispatch(clearShopConfirmation())
        dispatch(clearCart())
        dispatch(clearVoucher())
        dispatch(clearUser())
        dispatch(logout())
        dispatch(clearReInfo())
        // clearLocalStorage()
        navigation.navigate('AuthNavigator', { screen: 'Login' });
    };

    return (
        <View style={styles.container}>
            {user_status === 'pending' && <ActivityIndicator
                style={{ flex: 1, justifyContent: "center" }}
                size="small"
                color="#bc2b78" />}
            {user_status === 'success' && (
                <>
                    {/* Header */}
                    <View style={{ marginHorizontal: 10 }}>
                        <View style={styles.wrapHeaderProfile}>
                            <View style={styles.wrapUserInfo} >
                                <TouchableOpacity style={styles.avatarContainer}
                                    onPress={handleEditProfile}
                                >
                                    <Image
                                        source={{ uri: user_info?.avatar }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.iconContainer} >
                                        <FontAwesome
                                            name={"pencil"}
                                            size={16}
                                            color={"black"}
                                            style={{}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.userInfo}>
                                    <Text style={{ fontWeight: "500", color: '#000' }}>{user_info?.username}</Text>
                                </View>
                            </View>

                            {/* Setting_Cart_Chat */}
                            <View style={styles.wrapSettingCartMessage}>
                                <View>
                                    <AntDesign
                                        name={"setting"}
                                        size={30}
                                        color={"black"}
                                    />
                                </View>
                                <Cart />
                                <View style={{ position: 'relative' }}>
                                    <Ionicons
                                        name={"chatbubbles-outline"}
                                        size={30}
                                        color={"black"}
                                    // style={styles.socialIcon}
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
                                        onPress={() => {
                                            // alert("message");
                                        }}
                                        status="error"
                                        textProps={{}}
                                        textStyle={{
                                            fontSize: 10,
                                        }}
                                        value={numberMessage}
                                    // options={{}}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* ScrollView */}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} />
                        }
                    >
                        {/*Order*/}
                        <View style={styles.wrapOrder}>
                            <View style={styles.wrapOrderTitle}>
                                <Text style={{ fontWeight: "500", color: '#000' }}>Order</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('OrderNavigator', {
                                        screen: 'OrderScreen',
                                        params: {
                                            orderConfirming: orderConfirming, orderPacking: orderPacking,
                                            orderDelivering: orderDelivering, orderDelivered: orderDelivered,
                                            orderCanceled: orderCanceled, orderReturned: orderReturned
                                        }
                                    })
                                }}>
                                    <Text style={{ color: "#3169f5", textDecorationLine: 'underline' }}>
                                        Order History
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.wrapOrderProcess}>
                                <OrderProcessElement
                                    iconType={"Ionicons"}
                                    iconName={"wallet-outline"}
                                    text={"Confirming"}
                                    value={orderConfirming.length}
                                />
                                <OrderProcessElement
                                    iconType={"Feather"}
                                    iconName={"package"}
                                    text={"Packing"}
                                    value={orderPacking.length}
                                />
                                <OrderProcessElement
                                    iconType={"Feather"}
                                    iconName={"truck"}
                                    text={"Delivering"}
                                    value={orderDelivering.length}
                                />
                                <OrderProcessElement
                                    iconType={"AntDesign"}
                                    iconName={"staro"}
                                    text={"Rating"}
                                    value={orderNotRated.length}
                                />
                            </View>
                        </View>
                        {/*Extension*/}
                        <View style={styles.wrapExtension}>
                            <View style={styles.wrapExtensionTitle}>
                                <Text style={{ fontWeight: "500", color: '#000' }}>Extension</Text>
                            </View>
                            <View style={styles.wrapExtensionComponent}>
                                <TouchableOpacity style={{ width: "48%" }}>
                                    <ExtensionElement
                                        iconType={"Ionicons"} iconName={"medal-outline"}
                                        iconColor={"#e7700d"} text={"Loyal Customer"}
                                        containerStyle={{ width: "100%", borderColor: "#e7700d" }}
                                        textStyle={{ fontSize: 12, fontWeight: "400", color: "#e7700d" }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "48%" }}>
                                    <ExtensionElement
                                        iconType={"AntDesign"} iconName={"hearto"}
                                        iconColor={"#cf3131"} text={"Liked"}
                                        containerStyle={{ width: "100%", borderColor: "#cf3131" }}
                                        textStyle={{ fontSize: 12, fontWeight: "400", color: "#cf3131" }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.wrapExtensionComponent}>
                                <TouchableOpacity style={{ width: "48%" }}>
                                    <ExtensionElement
                                        iconType={"AntDesign"} iconName={"clockcircleo"}
                                        iconColor={"blue"} text={"Recently Viewd"}
                                        containerStyle={{ width: "100%", borderColor: "blue" }}
                                        textStyle={{ fontSize: 12, fontWeight: "400", color: "blue" }} />
                                </TouchableOpacity>
                                {shopConfirmation_status === 'failed' && !user_info?.is_vendor &&
                                    <TouchableOpacity style={{ width: "48%" }} onPress={handleShop}>
                                        <ExtensionElement
                                            iconType={"Ionicons"} iconName={"storefront-outline"}
                                            iconColor={"gray"} text={"Create Store"}
                                            containerStyle={{ width: "100%", borderColor: "gray" }}
                                            textStyle={{ fontSize: 12, fontWeight: "400", color: "gray" }} />
                                    </TouchableOpacity>}
                                {shopConfirmation_status === 'success' && shopConfirmation_info?.status === 'Approving' &&
                                    <TouchableOpacity style={{ width: "48%" }}>
                                        <ExtensionElement
                                            iconType={"Ionicons"} iconName={"storefront-outline"}
                                            iconColor={"powderblue"} text={"Approving"}
                                            containerStyle={{ width: "100%", borderColor: "powderblue" }}
                                            textStyle={{ fontSize: 12, fontWeight: "400", color: "powderblue" }} />
                                    </TouchableOpacity>}
                                {shopConfirmation_status === 'success' && shopConfirmation_info?.status === 'Providing Additional Information' &&
                                    <TouchableOpacity style={{ width: "48%" }} onPress={handleShop}>
                                        <ExtensionElement
                                            iconType={"Ionicons"} iconName={"storefront-outline"}
                                            iconColor={"navy"} text={"Needs providing"}
                                            containerStyle={{ width: "100%", borderColor: "navy" }}
                                            textStyle={{ fontSize: 12, fontWeight: "400", color: "navy" }} />
                                    </TouchableOpacity>}
                                {shopConfirmation_status === 'success' && shopConfirmation_info?.status === 'Successful' &&
                                    <TouchableOpacity style={{ width: "48%" }} onPress={handleShop}>
                                        <ExtensionElement
                                            iconType={"Ionicons"} iconName={"storefront-outline"}
                                            iconColor={"green"} text={"My Shop"}
                                            containerStyle={{ width: "100%", borderColor: "green" }}
                                            textStyle={{ fontSize: 12, fontWeight: "400", color: "green" }} />
                                    </TouchableOpacity>}
                            </View>
                        </View>

                        {/*Support*/}
                        <View style={styles.wrapSupport}>
                            <View style={styles.wrapSupportTitle}>
                                <Text style={{ fontWeight: "500", color: '#000' }}>Support</Text>
                            </View>
                            <View style={styles.wrapSupportComponent}>
                                <ExtensionElement iconType={"AntDesign"} iconName={"questioncircleo"} text={"Help Center"} iconColor={"#000"}
                                    containerStyle={{ width: "100%", marginBottom: 8, borderColor: '#000' }}
                                    textStyle={{ fontSize: 14, fontWeight: "500", color: '#000' }} />
                                <ExtensionElement iconType={"AntDesign"} iconName={"customerservice"} text={"Customer Service"} iconColor={"#000"}
                                    containerStyle={{ width: "100%", borderColor: '#000' }}
                                    textStyle={{ fontSize: 14, fontWeight: "500", color: '#000' }} />
                            </View>
                        </View>

                        {/*Short cut*/}
                        <View style={styles.wrapSupport}>
                            <View style={styles.wrapSupportTitle}>
                                <Text style={{ fontWeight: "500", color: '#000' }}>Short cut</Text>
                            </View>
                            <View style={styles.wrapSupportComponent}>
                                <TouchableOpacity onPress={handleLogout}>
                                    <ExtensionElement
                                        iconType={"MaterialIcons"}
                                        iconColor={colors.blueSky}
                                        iconName={"logout"}
                                        text={"Logout"}
                                        containerStyle={{ width: "100%", marginBottom: 8, borderColor: colors.blueSky }}
                                        textStyle={{ fontSize: 14, fontWeight: "500", color: colors.blueSky }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </>
            )}
            {user_status === 'failed' && <Text>{user_error}</Text>}
        </View>
    );
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    wrapHeaderProfile: {
        flexDirection: "row",
        alignItems: "center",
    },
    wrapUserInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 14,
        flex: 2,
    },
    avatarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    iconContainer: {
        position: "absolute",
        top: "60%",
        left: "60%",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "gray",
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    userInfo: {
        marginVertical: 4,
        marginHorizontal: 6,
    },
    wrapSettingCartMessage: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between",
    },
    wrapOrder: {
        marginVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    wrapOrderTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapOrderProcess: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8,
        marginHorizontal: 16,
    },
    wrapExtension: {
        marginVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    wrapExtensionTitle: {
        marginVertical: 8,
    },
    wrapExtensionComponent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    wrapSupport: {
        marginVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    wrapSupportTitle: {
        marginVertical: 8,
    },
    wrapSupportComponent: {
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
})