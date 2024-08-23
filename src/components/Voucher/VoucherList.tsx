import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, } from 'react-native';
import api, { endpoints, authAPI } from '../../utils/api';
import remainDateTime from '../../constants/remainDateTime';
import formatCurrency from '../../constants/formatCurrency';

interface Product {
    id: number,
    name: string
}

interface Category {
    id: number,
    name: string
}

interface PaymentMethod {
    id: number,
    name: string
}

interface Shipping {
    id: number,
    name: string,
    fee: number
}

interface Condition {
    id: number,
    min_order_amount: number,
    discount: number,
    remain: number,
    products: Product[],
    categories: Category[],
    payment_methods: PaymentMethod[],
    shippings: Shipping[],
}

interface Voucher {
    id: number,
    active: boolean,
    name: string,
    code: string,
    start_date: string,
    end_date: string,
    voucher_type_name: string,
    conditions: Condition[] | []
}


const VoucherList = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await api.get(endpoints.vouchers);
            if (response.status === 200 && response.data) {
                setVouchers(response.data);
            }
        } catch (error) {
            console.error('vouchers not found', error);
        }
    };



    const VoucherCard = (item: Voucher) => {
        return (
            <View key={item?.id.toString()} style={styles.card}>
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
                    {item?.conditions.length > 0 && item?.conditions[0].discount ?
                        <Text style={styles.discountText}>
                            Discount: {formatCurrency(item?.conditions[0].discount)}đ
                        </Text> : <></>}
                    {item?.conditions.length > 0 && item?.conditions[0].min_order_amount ?
                        <Text style={styles.orderText}>
                            Min order: {formatCurrency(item?.conditions[0].min_order_amount)}đ
                        </Text> : <></>}
                    <Text style={styles.videoText}>{item?.voucher_type_name}</Text>
                </View>
                {/* item?start_date */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.useLaterButton}>
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
            {vouchers.length > 0 ? vouchers.map(item => VoucherCard(item)) : <></>}
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
