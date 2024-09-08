import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import formatCurrency from '../../constants/formatCurrency';
import remainDateTime from '../../constants/remainDateTime';
import { colors } from '../../constants/colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types'
// interfaces
import { MyVoucher, VoucherCondition } from '../../interfaces/voucher';
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import store from '../../redux/store'

type Props = StackScreenProps<PaymentStackParamList, 'SelectingVoucherScreen'>;
const SelectingVoucherScreen = ({ route, navigation }: Props) => {
    // const dispatch = useDispatch<AppDispatch>()
    const { totalProductPrice, selectedShippingUnit, selectedProductList, selectedPaymentMethod } = route.params;
    // Display which are available
    // select and apply
    const [selectedVoucherList, setSelectedVoucherList] = useState<MyVoucher[]>([])
    const handleApplyVoucher = () => {
        navigation.navigate('PaymentScreen', { selectedVoucherList: selectedVoucherList })
        console.log(selectedVoucherList);
    }


    const renderSavedVoucher = (voucher: MyVoucher, condition: VoucherCondition) => {
        if (condition.quantity === 0) { // voucher has been used
            return null;
        }
        const [isChecked, setIsChecked] = useState(false);
        const [isValid, setIsValid] = useState(true);
        const isAllShops = voucher.voucher_type_name === 'All Shops';

        const isValidVoucher = () => {
            if (remainDateTime(voucher?.start_date) !== "Time has passed.") {
                return false;
            }
            if (condition.min_order_amount > totalProductPrice) { // Check totalProductPrice
                console.log('Check totalProductPrice ');
                return false;
            }
            if (!condition.shippings.find(item => item.name === selectedShippingUnit.name)) { // Check selectedShippingUnit
                console.log('Check selectedShippingUnit');
                return false;
            }
            if (condition.categories.length > 0) { // Check categories
                const result = selectedProductList.map(item => item.category).
                    find(item => !condition.categories.map(item => item.id).includes(item));
                if (result) {
                    console.log('Check categories', result);
                    return false;
                }
            }
            if (condition.products.length > 0) { // Check selectedProductList
                const result = selectedProductList.map(item => item.id).
                    find(item => !condition.products.map(item => item.id).includes(item))
                if (result) {
                    console.log('Check selectedProductList', result);
                    return false;
                }
            }
            if (condition.payment_methods.length > 0) { // Check selectedPaymentMethod
                const result = condition.payment_methods.find(item => item.id == selectedPaymentMethod.id)
                if (!result) {
                    console.log('Check selectedPaymentMethod ');
                    return false;
                }
            }
            return true
        }

        useEffect(() => {
            setIsValid(isValidVoucher());
        }, [])

        const handleViewCondition = () => {
            navigation.navigate('VoucherNavigator', {
                screen: 'VoucherConditionScreen'
            })
            console.log("View condition");
        }

        const handleCheckVoucher = () => {
            if (isChecked) {
                console.log("Checked");
                const result = selectedVoucherList.filter(item => item.id !== voucher.id)
                setSelectedVoucherList(result);
            }
            else {
                console.log("!Checked");
                setSelectedVoucherList(prev => [...prev, voucher])
            }
            setIsChecked(!isChecked);
        }

        return (
            <View key={voucher.id.toString() + condition.id.toString()}
                style={isValid ? styles.containerVoucher : [styles.containerVoucher, { marginBottom: 50 }]}>
                {/* Left */}
                <View style={isAllShops ? styles.voucherLeft : [styles.voucherLeft, { backgroundColor: 'tomato' }]}>
                    <MaterialCommunityIcons
                        name={"ticket-percent"}
                        size={46}
                        color={'#fff'}
                    />
                    <Text style={styles.voucherLeftText}>{voucher.name}</Text>
                    {condition.quantity > 1 &&
                        <View style={isAllShops ? styles.multiVoucherLeft :
                            [styles.multiVoucherLeft, { backgroundColor: 'tomato' }]}>
                        </View>
                    }
                </View>
                {/* Right */}
                <View style={styles.voucherRight}>
                    <View style={styles.voucherRightWrapInside}>
                        <View style={styles.voucherRightContent}>
                            <View>
                                <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    Discount đ{formatCurrency(condition.discount)}</Text>
                                <Text style={{ fontSize: 16, color: '#000' }}>
                                    Min order đ{formatCurrency(condition.min_order_amount)}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, color: colors.lightGray }}>end_date 06.09.2024</Text>
                                    <TouchableOpacity onPress={handleViewCondition}>
                                        <Text style={{ fontSize: 14, color: colors.blue, fontWeight: 'bold', marginLeft: 5 }}>Condition</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.voucherRightCheckBox}>
                            {condition.quantity > 1 &&
                                <View style={styles.badge}>
                                    <Text style={{ color: 'tomato', fontWeight: 'bold', fontSize: 16 }}>
                                        <Text style={{ fontSize: 12 }}>x</Text>
                                        {condition.quantity}</Text>
                                </View>
                            }
                            <TouchableOpacity onPress={handleCheckVoucher}>
                                <MaterialCommunityIcons
                                    name={isChecked ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                                    size={30}
                                    color={isChecked ? "#22a779" : "#ccc"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {condition.quantity > 1 &&
                        <View style={styles.mutiVoucherRight}></View>}
                </View>
                {!isValid &&
                    <>
                        <View style={styles.blur}></View>
                        <TouchableOpacity style={styles.bottomNotify} onPress={handleViewCondition}>
                            <AntDesign name="infocirlceo" size={16} color="#ccc" />
                            <Text style={{ color: 'red', marginLeft: 5 }}>Does not meet the voucher requirements.</Text>
                        </TouchableOpacity>
                    </>}
            </View>
        )
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 10, marginBottom: 50, }}>
                    {store.getState().voucher.vouchers.
                        map(voucher => voucher.conditions.
                            map(cond => renderSavedVoucher(voucher, cond)))}
                </View>
            </ScrollView >
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyVoucher}>
                <Text style={styles.applyButtonText}>Apply Voucher</Text>
            </TouchableOpacity>
        </>
    )
}

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
    containerVoucher: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 140,
        marginBottom: 30,
        borderColor: colors.lightGray,
        borderWidth: 0.2,
    },
    voucherLeft: {
        backgroundColor: colors.seafoam,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 10
    },
    multiVoucherLeft: {
        backgroundColor: colors.lightSeafoam2,
        borderWidth: 0.1,
        borderColor: colors.lightGray,
        width: '100%',
        position: 'absolute', height: 8,
        bottom: -8, right: 0
    },
    voucherLeftText: {
        flexWrap: 'wrap',
        color: '#fff',
        fontSize: 12
    },
    voucherRight: {
        height: '100%',
        flex: 1
    },
    voucherRightWrapInside: {
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    voucherRightContent: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    voucherRightCheckBox: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    mutiVoucherRight: {
        backgroundColor: '#fff', borderWidth: 0.1, borderColor: colors.lightGray,
        width: '96%',
        position: 'absolute', height: 8,
        bottom: -8, left: 0
    },
    badge: {
        position: 'absolute', top: 8, right: 0, height: 24, width: 40,
        backgroundColor: '#fdebe6',
        justifyContent: 'center', alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    blur: {
        width: screenWidth - 20,
        height: 150,
        backgroundColor: 'rgba(255,255,255, 0.5)',
        position: 'absolute',
        top: 0,
    },
    bottomNotify: {
        position: 'absolute',
        top: 150,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef6e7',
        padding: 4
    },
    applyButton: {
        backgroundColor: 'tomato',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center'
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '400'
    }
});


export default SelectingVoucherScreen
