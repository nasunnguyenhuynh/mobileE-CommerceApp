import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, } from 'react-native'
import { Badge } from "react-native-elements";
import { ExtensionElement } from '../../components';
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import { colors } from '../../constants/colors';

// Redux
import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { currentUser, clearUser } from '../../redux/user/userSlice';
import { logout } from '../../redux/auth/authSlice';
import { getShopConfirmation, clearShopConfirmation } from '../../redux/user/userShopConfirmationSlice';
import { clearCart } from '../../redux/cart/cartSlice';
import { clearVoucher } from '../../redux/voucher/voucherSlice';
import { clearReInfo } from '../../redux/reInfo/receiverInformationSlice';
import { clearLocalStorage } from '../../redux/storage';
import { saveCartToStorage, saveVoucherToStorage } from '../../redux/storage';
import store from '../../redux/store';
// Navigation
import { ProfileStackParamList, RootStackParamList } from '../../routers/types'
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
type ProfileScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'ProfileScreen'>,
    StackNavigationProp<RootStackParamList>
>;

const ProfileScreen = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
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

    useEffect(() => {
        if (user_status === 'success' && user_info?.id) {
            dispatch(getShopConfirmation(user_info.id));
        }
    }, [user_info]);

    //More
    const numberMessage = 12;
    const numberProductInCart = 27;
    //Refresh ProfileScreen
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => { dispatch(currentUser()) };

    const handleLogout = () => { //removeToken & resetState
        console.log("LOGOUT");
        console.log('profile_state', store.getState()?.cart);
        console.log('voucher', store.getState()?.voucher);

        saveCartToStorage(store.getState().cart?.productList, store.getState().auth?.token)
        saveVoucherToStorage(store.getState().voucher?.vouchers, store.getState().auth?.token)
        dispatch(clearShopConfirmation())
        dispatch(clearCart())
        dispatch(clearVoucher())
        dispatch(clearUser())
        dispatch(logout())
        dispatch(clearReInfo())
        // clearLocalStorage()
        navigation.navigate('Login');
    };

    const handleShop = () => {
        navigation.navigate('ExtensionNavigator', {
            screen: 'ExtensionShopScreen'
        })
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
                                <TouchableOpacity style={styles.avatarContainer} >
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
                                <View style={{ position: 'relative' }}>
                                    <Feather
                                        name={"shopping-cart"}
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
                                        value={numberProductInCart}
                                    // options={{}}
                                    />
                                </View>
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
                        {/*Extension*/}
                        <View style={styles.wrapExtension}>
                            <View style={styles.wrapExtensionTitle}>
                                <Text style={{ fontWeight: "500" }}>Extension</Text>
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
                                <Text style={{ fontWeight: "500" }}>Short cut</Text>
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