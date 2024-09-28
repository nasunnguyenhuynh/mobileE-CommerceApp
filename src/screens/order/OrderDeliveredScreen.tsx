import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { colors } from '../../constants/colors';
import formatCurrency from '../../constants/formatCurrency';
import api, { authAPI, endpoints } from '../../utils/api';
// redux
import store from '../../redux/store';
// interfaces
import { OrderDetail } from '../../interfaces/order';
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { OrderScreenStackParamList } from '../types';
type Props = StackScreenProps<OrderScreenStackParamList, 'OrderDeliveredScreen'>;
const OrderDeliveredScreen = ({ route, navigation }: Props) => {
    const { orderDelivered } = route.params
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {

    };

    const renderOrder = (order: any) => { // OverviewOrder -> press to view OrderDetail
        const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
        const fetchOrderDetail = async (userId: number | undefined, orderId: number) => {
            try {
                const axiosInstance = await authAPI();
                const response = await axiosInstance.get(endpoints['order-detail'](userId, orderId));
                if (response.status === 200 && response.data) {
                    setOrderDetail(response.data);
                }
            } catch (error) {
                console.error(`Error fetching order with id ${orderId}:`, error);
            }
        }


        useEffect(() => {
            fetchOrderDetail(store.getState().user.info?.id, order.id);
        }, [])

        // const navigation = useNavigation<OrderDeliveredScreenNavigationProp>();
        const handleRepurchase = () => {
            navigation.navigate('PaymentNavigator', { screen: 'PaymentScreen' })
        }
        const handleRating = () => {
            navigation.navigate('ReviewNavigator', { screen: 'ReviewFormScreen', params: orderDetail })
        }
        // Update State after posted
        return (
            <View style={styles.containerOrder} key={order.id}>
                <View style={styles.orderTitle}>
                    <Text style={styles.shopName} numberOfLines={1} ellipsizeMode='tail'>
                        {orderDetail?.order_details[0].shop_name}
                    </Text>
                    <Text style={styles.orderStatus}>
                        {orderDetail?.status}
                    </Text>
                </View>
                <View style={styles.orderBody}>
                    <Image
                        source={orderDetail ? { uri: orderDetail?.order_details[0].product_img } :
                            require("../../assets/images/loading-img.png")}
                        style={styles.orderImg}
                    />
                    <View style={styles.orderContent}>
                        <Text style={styles.productName} numberOfLines={1} ellipsizeMode='tail'>
                            {orderDetail?.order_details[0].product_name}
                        </Text>
                        <View style={styles.wrapProductClassificationQuantity}>
                            <Text style={{ fontSize: 14, color: colors.lightGray }}>
                                {orderDetail?.order_details[0].color_name}
                            </Text>
                            <Text style={{ fontSize: 14 }}>x
                                {orderDetail?.order_details[0].quantity}
                            </Text>
                        </View>
                        <Text style={styles.productPrice}>
                            đ{formatCurrency(orderDetail ? orderDetail?.order_details[0].price : 0)}
                        </Text>
                    </View>
                </View>
                <View style={styles.orderTotal}>
                    <Text style={{ color: colors.lightGray }}>
                        <Text style={{ color: colors.lightGray }}>
                            {orderDetail?.order_details.length} product
                        </Text>
                    </Text>
                    <Text style={{ color: '#000' }}>
                        Total: <Text style={{ color: 'tomato' }}>
                            đ{formatCurrency(orderDetail ? orderDetail.total_amount : 0)}
                        </Text>
                    </Text>
                </View>
                <View style={styles.orderFooter}>
                    <TouchableOpacity
                        style={styles.btnPurchase}
                        onPress={orderDetail?.product_review && orderDetail?.shop_review ?
                            handleRepurchase : handleRating}
                    >
                        <Text style={{ color: "#fff" }}>
                            {orderDetail?.product_review && orderDetail?.shop_review ? "Repurchase" : "Rating"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            }
        >
            {orderDelivered && orderDelivered.map((item: any) => renderOrder(item))}
        </ScrollView>
    )
}

export default OrderDeliveredScreen
const styles = StyleSheet.create({
    containerOrder: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    orderTitle: {
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000'
    },
    orderStatus: {
        fontSize: 12,
        color: 'tomato',
    },
    orderBody: {
        padding: 10,
        borderBottomWidth: 0.2,
        borderColor: colors.lightGray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderImg: {
        width: 100,
        height: 100,
        borderRadius: 4,
    },
    orderContent: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontSize: 14,
        color: '#000',
    },
    wrapProductClassificationQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productPrice: {
        fontSize: 14,
        color: 'tomato',
    },
    orderTotal: {
        padding: 10,
        borderBottomWidth: 0.2,
        borderColor: colors.lightGray,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderFooter: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    btnPurchase: {
        backgroundColor: 'tomato',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    }
})