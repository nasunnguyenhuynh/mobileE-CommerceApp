import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { authAPI, endpoints } from '../../utils/api'
import { colors } from '../../constants/colors'
import Ionicons from "react-native-vector-icons/Ionicons"
import { ReceiverInformation } from '../../interfaces/receiverinfo'
//navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types';
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux'
import { addReInfoList } from '../../redux/reInfo/receiverInformationSlice'
import store from '../../redux/store'

type Props = StackScreenProps<PaymentStackParamList, 'PaymentScreen'>;
export default function PaymentScreen({ route, navigation }: Props) {
    const [loadingUserData, setLoadingUserData] = useState(false);
    const loading = () => {
        return (
            <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} size="small" color="#bc2b78" />
        )
    }

    const dispatch = useDispatch<AppDispatch>()
    const fetchReceiverInfo = async () => {
        try {
            setLoadingUserData(true)
            const axiosInstance = await authAPI();
            const result = await axiosInstance.get(endpoints['address-phone'](store.getState().user.info?.id));
            if (result.status === 200 && result.data) {
                dispatch(addReInfoList(result.data))
            }

        } catch (error) {
            console.error('Error fetching receiverInfo:', error);
        } finally {
            setLoadingUserData(false)
        }
    };

    useEffect(() => { // For 1st mounted
        fetchReceiverInfo(); // Get from DB and add into slice
    }, []);

    const [reInfoDefault, setReInfoDefault] =
        useState<ReceiverInformation | undefined>(store.getState().reInfo.reInfoList.find(item => item.default));

    useEffect(() => { // For ReceiverInformationScreen navigate to
        if (route.params?.data) {
            setReInfoDefault(route.params.data) // Update the new default from Re..Screen
        }
    }, [route.params?.data])

    const renderReceiverInformationDefault = (item: ReceiverInformation) => {
        return (
            <View style={styles.wrapAddress} key={item.id}>
                <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text>{item.phone}</Text>
                <Text style={{ flexWrap: "wrap" }}>{item.address}</Text>
            </View>
        )
    }

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ marginHorizontal: 10, marginBottom: 50, }}>
                        {/* Address */}
                        <View style={styles.addressContainer}>
                            <View style={styles.wrapAddressIcon}>
                                <Ionicons
                                    name={"location-outline"}
                                    size={20}
                                    color={colors.lightGray}
                                    style={{}}
                                />
                            </View>
                            {/* Check receiverInfo ? */}
                            {
                                loadingUserData ?
                                    loading() :
                                    (store.getState().user.info?.first_name.length === 0 ||
                                        store.getState().user.info?.last_name.length === 0 ||
                                        store.getState().reInfo.reInfoList.length === 0) ?
                                        <>
                                            <Text style={{ color: "red", }}>Please update your information </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('ReceiverInformationScreen')
                                                }}>
                                                <Text style={{
                                                    textDecorationLine: "underline",
                                                    fontWeight: "500",
                                                    color: colors.blueSky
                                                }}>here</Text>
                                            </TouchableOpacity>
                                        </> :
                                        <>
                                            {reInfoDefault && renderReceiverInformationDefault(reInfoDefault)}
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('ReceiverInformationScreen')
                                                }}>
                                                <Text style={{ color: colors.blueSky, fontSize: 12, }}>Change</Text>
                                            </TouchableOpacity>
                                        </>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    // Address 
    addressContainer: {
        marginVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    wrapAddressIcon: {
        height: "100%",
    },
    wrapAddress: {
        marginLeft: 10,
        flex: 1,
    },
    // Product
    productContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    shopName: { fontWeight: "500" },
    wrapProduct: {
        flexDirection: "row",
        alignItems: "center",
    },
    productImg: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    wrapProductInfo: {
        flex: 1,
        marginLeft: 5,
    },
    productName: {
        flexWrap: 'wrap',
    },
    productText: { color: colors.lightGray, fontSize: 14, },

    // Transportation
    transportationContainer: {
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,
        backgroundColor: "powderblue",
    },
    wrapTransportationMethodPrice: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    transportationText: {
        flexWrap: "wrap",
        fontSize: 12,
        color: colors.lightGray,
    },
    // methodPayment
    methodPaymentContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    wrapMethodPaymentLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    wrapMethodPaymentRight: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-end',
    },
    // PaymentDetailContainer
    paymentDetailContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    paymentDetailTitle: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    wrapTotalProductPrice: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapTotalTransportationFee: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapProductDiscount: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapTransportationDiscount: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    wrapTotal: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    //
    notiTermsContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,

        flexDirection: "row",
        alignItems: "center",
    },
    // footer
    footerPayment: {
        position: "absolute",
        bottom: 0,
        height: "8%",
        width: "100%",
        backgroundColor: "#fff",
    },
    wrapFooterPayment: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
    },
    displayTotal: {
        height: "100%",
        backgroundColor: colors.lightGray,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },

    btnPurchase: {
        height: "100%",
        backgroundColor: colors.darkOrange,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
})