import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
import { colors } from '../../constants/colors'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import formatCurrency from '../../constants/formatCurrency'
import { Notify } from '../../components'
// interfaces
import { ReceiverInformation } from '../../interfaces/receiverinfo'
import { SelectedProductList, SelectedProductDetail, Product } from '../../interfaces/product'
import { Shop } from '../../interfaces/shop'
import { ShippingUnit } from '../../interfaces/shipping'
import { MyVoucher } from '../../interfaces/voucher'
import { PaymentMethod } from '../../interfaces/category'
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types';
// redux
import { saveCartToStorage, saveVoucherToStorage } from '../../redux/storage';
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { addReInfoList } from '../../redux/reInfo/receiverInformationSlice'
import { decreaseVoucherQuantity } from '../../redux/voucher/voucherSlice'
import { removeProduct } from '../../redux/cart/cartSlice'
import store from '../../redux/store'

type Props = StackScreenProps<PaymentStackParamList, 'PaymentScreen'>;
export default function PaymentScreen({ route, navigation }: Props) {
    const [loading, setLoading] = useState(false);
    const [notifyText, setNotifyText] = useState('');
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [selectedShippingUnit, setSelectedShippingUnit] = useState<ShippingUnit | null>(null);
    const [selectedVoucherList, setSelectedVoucherList] = useState<MyVoucher[]>([]);
    const [selectedProductList, setSelectedProductList] = useState<Product[]>([])

    const handleLoading = () => {
        return (
            <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} size="small" color="#bc2b78" />
        )
    }

    const dispatch = useDispatch<AppDispatch>()
    const fetchReceiverInfo = async () => {
        try {
            setLoading(true)
            const axiosInstance = await authAPI();

            const response = await axiosInstance.get(endpoints['address-phone'](store.getState().user.info?.id));
            if (response.status === 200 && response.data) {
                dispatch(addReInfoList(response.data));
            }

        } catch (error) {
            console.error('Error fetching receiverInfo:', error);
        } finally {
            setLoading(false)
        }
    };

    const shopHasSelectedProduct = store.getState().cart.productList.filter(shop =>
        shop.products.some(product => product.isSelected)
    );

    useEffect(() => { // For 1st mounted
        console.log('selectedProductList ', shopHasSelectedProduct);
        fetchReceiverInfo(); // Get from database and add into slice
    }, []);

    const [reInfoDefault, setReInfoDefault] =
        useState<ReceiverInformation | undefined>(store.getState().reInfo.reInfoList.find(item => item.default));

    useEffect(() => {
        if (route.params?.receiverInformationList) { // Update reInfoDefault from ReceiverInformationScreen navigate
            setReInfoDefault(route.params.receiverInformationList)
        }
        if (route.params?.selectedPaymentMethod) { // Update selectedPaymentMethod from PaymentMethodScreen
            setSelectedPaymentMethod(route.params.selectedPaymentMethod);
        }
        if (route.params?.selectedShippingUnit) { // Update selectedShippingUnit from ShippingUnitScreen
            setSelectedShippingUnit(route.params.selectedShippingUnit);
        }
        if (route.params?.selectedVoucherList) {
            const discountArray = route.params?.selectedVoucherList.map(item => item.conditions[0].discount);
            const totalDiscount = discountArray.reduce((total, currentValue) => total + currentValue, 0);
            setSelectedVoucherList(route.params.selectedVoucherList);
            setTotalDiscount(totalDiscount);
        }
    },
        [route.params?.receiverInformationList,
        route.params?.selectedPaymentMethod,
        route.params?.selectedShippingUnit,
        route.params?.selectedVoucherList])

    const renderReceiverInformationDefault = (item: ReceiverInformation) => {
        return (
            <View style={styles.wrapAddress} key={item.id}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: '#000' }}>{item.name}</Text>
                <Text style={{ color: '#000' }}>{item.phone}</Text>
                <Text style={{ flexWrap: "wrap", color: '#000' }} >{item.address}</Text>
            </View>
        )
    }

    const renderSelectedProduct = (item: SelectedProductDetail) => {
        if (item.isSelected) {
            const [product, setProduct] = useState<Product | null>(null);
            const getProductByID = async (id: number) => {
                const response = await api.get(endpoints.products_id(id));
                if (response.status === 200 && response.data) {
                    setProduct(response.data);
                    setTotalProductPrice(pre => pre + response.data.price * item.quantity);
                    setSelectedProductList(prevProductList => [
                        ...prevProductList,
                        response.data
                    ]);
                }
            };

            useEffect(() => {
                getProductByID(item.id);
            }, [item.id]);

            const getColorName = (id: number): string | undefined => {
                const color = product?.colors.find(color => color.id === id);
                return color ? color.name : undefined;
            };

            return (
                <View key={item.color ? item.id.toString() + item.color.toString() : item.id}
                    style={styles.detailProduct}>
                    {product && <Image source={{ uri: product?.images[0].image }} style={styles.image} />}
                    <View style={styles.detailsContainer}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{product?.name}</Text>
                        {item.color && <Text style={styles.variant}>Variant: {getColorName(item.color)}</Text>}
                        <View style={styles.priceQuantityContainer}>
                            <Text style={styles.price}>₫{formatCurrency(product ? product.price : 0)}</Text>
                            <View style={styles.wrapQuantity}>
                                <Text style={styles.quantity}>Quantity: </Text>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        else
            return null;
    }

    const renderShopHasSelectedProduct = (item: SelectedProductList) => {
        const [shop, setShop] = useState<Shop | null>(null);
        const getShopByID = async (id: number) => {
            const response = await api.get(endpoints.shop_id(id));
            if (response.status === 200 && response.data) {
                setShop(response.data);
            }
        };
        useEffect(() => {
            getShopByID(item.shopId);
        }, [])
        return (
            <View key={item.shopId} style={styles.shopContainer}>
                <View style={styles.wrapShopName}>
                    <Text style={styles.shopText}>{shop?.name}</Text>
                </View>
                {/* renderSelectedProduct */}
                {item.products.length > 0 && item.products.map(product => renderSelectedProduct(product))}
            </View>
        )
    }

    const [openModel, setOpenModal] = useState(false);

    const handlNotify = (notifyText: string) => {
        setNotifyText(notifyText)
        setOpenModal(true)
        const timeout = setTimeout(() => {
            setOpenModal(false)
        }, 800);

        return () => clearTimeout(timeout)
    }

    const responseCondition = {
        'Plz choose the address': !reInfoDefault,
        'Plz choose shipping unit': !selectedShippingUnit,
        'Plz choose payment method': !selectedPaymentMethod,
        'Plz choose product': selectedProductList.length < 1,
    };

    const handleSelectingVoucher = () => {
        if (!selectedPaymentMethod) {
            handlNotify('Plz choose payment method')
        }
        else if (!selectedShippingUnit) {
            handlNotify('Plz choose shipping unit')
        }
        else {
            navigation.navigate('SelectingVoucherScreen', {
                totalProductPrice,
                selectedProductList,
                selectedPaymentMethod,
                selectedShippingUnit
            })
        }
    }

    // - voucher, product  // Check exp voucher, remain voucher
    const updateProductVoucherState = () => {
        if (selectedVoucherList.length > 0) {
            selectedVoucherList.forEach(voucher => {
                voucher.conditions.forEach(condition => {
                    dispatch(decreaseVoucherQuantity({
                        voucherId: voucher.id,
                        conditionId: condition.id
                    }));
                });
            });
            saveVoucherToStorage(store.getState().voucher?.vouchers, store.getState().auth?.token)
        }
        if (selectedProductList.length > 0) {
            store.getState().cart.productList.forEach(shop => {
                shop.products.forEach(product => {
                    if (product.isSelected) {
                        dispatch(removeProduct({
                            shopId: shop.shopId,
                            productId: product.id,
                            color: product.color
                        }));
                    }
                });
            });
            saveCartToStorage(store.getState().cart?.productList, store.getState().auth?.token)
        }
    }

    const handlePurchase = async () => {  // Check other method not VNPAy
        for (const [message, condition] of Object.entries(responseCondition)) {
            if (condition) {
                handlNotify(message);
                return; // Exit early if a condition fails
            }
        }

        if (selectedPaymentMethod?.name !== 'VNPay' && selectedPaymentMethod?.name !== 'Cash') {
            handlNotify('Payment method is not currently supported')
            return;
        }
        try {
            const data = {
                total_amount: selectedShippingUnit && selectedShippingUnit.fee + totalProductPrice - totalDiscount,
                products: shopHasSelectedProduct
                    .flatMap(shop => shop.products
                        .filter(product => product.isSelected)  // Filter selected products
                        .map(product => ({                     // Map to desired format
                            id: product.id,
                            color: product.color,
                            quantity: product.quantity,
                        }))
                    ),
                vouchers: selectedVoucherList.length > 0 ?
                    selectedVoucherList.flatMap(voucher => voucher.conditions.map(cond => cond.id)) : [],
                payment_method: selectedPaymentMethod?.id,
                shipping: selectedShippingUnit?.id
            }
            const axiosInstance = await authAPI();
            const createOrder = await axiosInstance.post(endpoints.order(store.getState().user.info?.id), data);


            if (createOrder.status === 201 && createOrder.data) {
                updateProductVoucherState()
                if (selectedPaymentMethod?.name == 'Cash') {
                    navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
                }
                else {
                    try {
                        const response = await axiosInstance.post(endpoints.payment, {
                            order_id: Number(createOrder.data.order_id),
                            amount: Number(createOrder.data.total_amount)
                        });
                        if (response.status === 200 && response.data) {
                            navigation.navigate('PaymentResultScreen', { url: response.data.url });
                        } else {
                            handlNotify('Error: URL not found in response, plz try again later')
                        }
                    } catch (error) {
                        handlNotify('Error when redirecting to VNPAY, , plz try again later')
                    }
                }
            }
        } catch (error) {
            handlNotify('Error when creating order, plz try again later')
        }
    }

    return (
        <>
            <ScrollView style={{ backgroundColor: "#f5f5f5", flex: 1, marginBottom: 64 }}>
                <View style={{ marginHorizontal: 10 }}>
                    <Notify visible={openModel} text={notifyText} />
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
                            loading ?
                                handleLoading() :
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

                    {/* shopHasSelectedProduct */}
                    {
                        shopHasSelectedProduct &&
                        shopHasSelectedProduct.map(shop => renderShopHasSelectedProduct(shop))
                    }

                    {/* Shipping-unit */}
                    <View style={styles.containerShippingUnit}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ShippingUnitScreen')
                            }}
                        >
                            <Text style={styles.shippingUnitTitle}>Shipping Unit
                                <Text style={{ color: colors.blueSky }}> (Choose here)</Text>
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.wrapNamePriceShippingUnit}>
                            <Text style={styles.shippingUnitName}>
                                {selectedShippingUnit && selectedShippingUnit.name}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name={"ticket-outline"}
                                    size={20}
                                    color={selectedShippingUnit ? '#05988a' : colors.lightGray}
                                    style={{}}
                                />
                                <Text style={{ color: '#000', marginLeft: 5 }}>
                                    {selectedShippingUnit && "đ" + formatCurrency(selectedShippingUnit.fee)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.shippingUnitText, { marginBottom: 5 }]}>
                            Receiving a voucher worth đ{formatCurrency(15000)} if the order was delivered to you after 5 days.
                        </Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.shippingUnitText}>Checking product policy</Text>
                            <AntDesign
                                name={"questioncircleo"}
                                size={12}
                                color={colors.lightGray}
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Voucher */}
                    <TouchableOpacity style={styles.containerVoucher} onPress={handleSelectingVoucher}>
                        <View style={styles.wrapVoucher}>
                            <Ionicons
                                name={"ticket-outline"}
                                size={20}
                                color={'tomato'}
                            />
                            <Text style={{ color: '#000', marginLeft: 5 }}>E-Commerce Voucher</Text>
                        </View>
                        <View style={styles.wrapVoucher}>
                            {
                                selectedVoucherList.length > 0 ?
                                    selectedVoucherList?.find(item => item.voucher_type_name === 'All Shops') ?
                                        <>
                                            <MaterialCommunityIcons
                                                name={"ticket-percent"}
                                                size={30}
                                                color={"#05988a"}
                                                style={{ marginRight: 5 }}
                                            />
                                            <MaterialCommunityIcons
                                                name={"ticket-percent"}
                                                size={30}
                                                color={'tomato'}
                                                style={{ marginRight: 5 }}
                                            />
                                        </>
                                        :
                                        <MaterialCommunityIcons
                                            name={"ticket-percent"}
                                            size={30}
                                            color={'tomato'}
                                            style={{ marginRight: 5 }}
                                        />
                                    : null
                            }
                            <AntDesign
                                name={"right"}
                                size={14}
                                color={colors.lightGray}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* PaymentMethod */}
                    <TouchableOpacity
                        style={styles.containerVoucher}
                        onPress={() => {
                            navigation.navigate('PaymentMethodScreen')
                        }}
                    >
                        <View style={styles.wrapVoucher}>
                            <MaterialIcons
                                name={"currency-exchange"}
                                size={20}
                                color={'tomato'}
                            />
                            <Text style={{ color: '#000', marginLeft: 5 }}>Payment Method</Text>
                        </View>
                        <View style={styles.wrapVoucher}>
                            <Text style={{ color: '#000', marginRight: 5 }}>
                                {selectedPaymentMethod ? selectedPaymentMethod.name :
                                    <Text style={{ color: colors.blueSky }}> Choose here</Text>}
                            </Text>
                            <AntDesign
                                name={"right"}
                                size={14}
                                color={colors.lightGray}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* PaymentDetailContainer */}
                    <View style={styles.paymentDetailContainer}>
                        <View style={styles.paymentDetailTitle}>
                            <FontAwesome name={"newspaper-o"} size={16} color={colors.darkOrange} style={{}} />
                            <Text style={{ marginLeft: 10, fontWeight: "500", color: '#000' }}>
                                Payment Detail
                            </Text>
                        </View>
                        <View style={styles.wrapTotalProductPrice}>
                            <Text style={{ color: '#000' }}>Total product price</Text>
                            <Text style={{ color: '#000' }}>đ{totalProductPrice && formatCurrency(totalProductPrice)}</Text>
                        </View>
                        <View style={styles.wrapTotalTransportationFee}>
                            <Text style={{ color: '#000' }}>Total transportation fee</Text>
                            <Text style={{ color: '#000' }}>{selectedShippingUnit && 'đ' + formatCurrency(selectedShippingUnit.fee)}</Text>
                        </View>
                        {selectedVoucherList.length > 0 &&
                            <View style={styles.wrapProductDiscount}>
                                <Text style={{ color: '#000' }}>Product discount</Text>
                                <Text style={{ color: '#000' }}>- đ{formatCurrency(totalDiscount)}</Text>
                            </View>
                        }
                        {/*
                            <View style={styles.wrapTransportationDiscount}>
                                <Text>Transportation discount</Text>
                                <Text>- đ{FormatCurrency(productDiscount)}</Text>
                            </View> */}
                        <View style={styles.wrapTotal}>
                            <Text style={{ fontSize: 16, color: '#000' }}>Total</Text>
                            <Text style={{ color: colors.darkOrange, fontSize: 16, }}>
                                đ{
                                    selectedShippingUnit ?
                                        formatCurrency(selectedShippingUnit.fee + totalProductPrice - totalDiscount) :
                                        formatCurrency(totalProductPrice - totalDiscount)
                                }
                            </Text>
                        </View>
                    </View>

                    {/* Noti terms */}
                    <View style={styles.notiTermsContainer}>
                        <FontAwesome name={"newspaper-o"} size={16} color={colors.darkOrange} style={{}} />
                        <Text style={{ marginLeft: 10, fontSize: 12, color: '#000' }}>
                            Clicking "
                            <Text style={{ fontWeight: "500", fontSize: 12, color: '#000' }}>Purchase</Text>
                            " means obeying our
                            <Text style={{ textDecorationLine: "underline", color: colors.blueSky }}> terms</Text>
                        </Text>
                    </View>
                </View >
            </ScrollView >
            {/* footer */}
            <View style={styles.footerPayment} >
                <View style={styles.wrapFooterPayment}>
                    <View style={styles.displayTotal}>
                        <Text style={{ color: '#000' }}>Total</Text>
                        <Text style={{ color: colors.darkOrange, fontWeight: "500" }}>
                            đ{
                                selectedShippingUnit ?
                                    formatCurrency(selectedShippingUnit.fee + totalProductPrice - totalDiscount) :
                                    formatCurrency(totalProductPrice - totalDiscount)
                            }
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.btnPurchase} onPress={handlePurchase}>
                        <Text style={{ color: "#fff", fontWeight: "500" }}>Purchase</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </>
    )
}


const styles = StyleSheet.create({
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
    // Shop
    shopContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    wrapShopName: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    shopText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Product
    detailProduct: {
        flexDirection: 'row',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: 'powderblue'
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        flexWrap: 'wrap',
        width: '90%'
    },
    variant: {
        fontSize: 14,
        color: '#888',
    },
    priceQuantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 18,
        color: '#f00',
        fontWeight: 'bold',
    },
    wrapQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {},

    // Shipping-unit
    containerShippingUnit: {
        marginBottom: 10,
        backgroundColor: colors.lightSeafoam,
        borderColor: colors.seafoam,
        borderWidth: 0.5,
        borderRadius: 4,
        padding: 10,
    },
    shippingUnitTitle: {
        paddingVertical: 5,
        color: '#000'
    },
    wrapNamePriceShippingUnit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    shippingUnitName: {
        paddingVertical: 5,
        color: '#000',
        fontWeight: '500',
        fontSize: 16
    },
    shippingUnitText: {
        flexWrap: "wrap",
        fontSize: 12,
        color: colors.lightGray,
    },

    // Voucher & PaymentMethod
    containerVoucher: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    wrapVoucher: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // PaymentDetailContainer
    paymentDetailContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 10
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

    // Noti terms 
    notiTermsContainer: {
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 10,

        flexDirection: "row",
        alignItems: "center",
    },

    // footer
    footerPayment: {
        position: "absolute",
        bottom: 0,
        height: 64,
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
        backgroundColor: '#ccc',
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