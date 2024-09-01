import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import api, { endpoints, authAPI } from '../../utils/api';
import remainDateTime from '../../constants/remainDateTime';
import formatCurrency from '../../constants/formatCurrency';
import { Voucher, MyVoucher, Condition } from '../../interfaces/voucher';
// redux
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { addVoucher } from '../../redux/voucher/voucherSlice';

const VoucherList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await api.get(endpoints.vouchers);
            if (response.status === 200 && response.data) {
                console.log('voucherData: ', response.data);
                setVouchers(response.data.filter((voucher: Voucher) =>
                    remainDateTime(voucher.end_date) !== "Time has passed."));
            }
        } catch (error) {
            console.error('vouchers not found', error);
        }
    };

    const handleSaveVoucher = (voucher: Voucher, condition: Condition) => {
        if (voucher.conditions.find(cond => cond.id === condition.id)?.remain) {
            const myVoucher: MyVoucher = {
                id: voucher.id,
                name: voucher.name,
                code: voucher.code,
                is_multiple: voucher.is_multiple,
                start_date: voucher.start_date,
                end_date: voucher.end_date,
                voucher_type_name: voucher.voucher_type_name,
                conditions: [
                    {
                        id: condition.id,
                        min_order_amount: condition.min_order_amount,
                        discount: condition.discount,
                        quantity: 1,
                        products: condition.products,
                        categories: condition.categories,
                        payment_methods: condition.payment_methods,
                        shippings: condition.shippings,
                    }]
            }
            dispatch(addVoucher(myVoucher))
        }
        else {
            Alert.alert("Noti", "Voucher not remain")
        }

    }


    const VoucherCard = (item: Voucher, condition: Condition) => {
        return (
            <View key={item?.id.toString() + condition?.id.toString()} style={styles.card}>
                <View style={styles.topSection}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>{item?.name}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>ECOMMERCE {item?.voucher_type_name.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.middleSection}>
                    <Text style={styles.limitedText}>Limited quantity</Text>
                    {condition ?
                        <Text style={styles.discountText}>
                            Discount: {formatCurrency(condition.discount)}đ
                        </Text> : <></>}
                    {condition ?
                        <Text style={styles.orderText}>
                            Min order: {formatCurrency(condition.min_order_amount)}đ
                        </Text> : <></>}
                    <Text style={styles.videoText}>{item?.voucher_type_name}</Text>
                </View>

                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.useLaterButton} onPress={() => { handleSaveVoucher(item, condition) }}>
                        <Text style={styles.useLaterText}>Save</Text>
                    </TouchableOpacity>
                    <View style={styles.expirationContainer}>
                        {
                            remainDateTime(item?.start_date) !== "Time has passed." ?
                                <Text style={styles.expirationText}>
                                    {`Valid after ${remainDateTime(item?.start_date)}`}
                                </Text> : <></>
                        }
                        <TouchableOpacity>
                            <Text style={styles.conditionText}>Condition</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {vouchers.length > 0 ? vouchers.map(item => item.conditions.map(cond => VoucherCard(item, cond))) : <></>}
        </ScrollView>
    );
};

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth * 0.8
const styles = StyleSheet.create({
    card: {
        height: 180,
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelContainer: {
        backgroundColor: '#FFA500',
        borderRadius: 5,
        padding: 5,
    },
    labelText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    iconContainer: {
        backgroundColor: '#FF5722',
        borderRadius: 5,
        padding: 5,
    },
    iconText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    middleSection: {
        marginTop: 10,
    },
    limitedText: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
    discountText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderText: {
        color: '#000',
    },
    videoText: {
        color: '#FF5722',
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    useLaterButton: {
        borderColor: '#FF5722',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    useLaterText: {
        color: '#FF5722',
        fontWeight: 'bold',
    },
    expirationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expirationText: {
        marginRight: 5,
    },
    conditionText: {
        color: '#007BFF',
    },
});

export default VoucherList;
