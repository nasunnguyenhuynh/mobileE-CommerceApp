import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types'
// interfaces
import { PaymentMethod } from '../../interfaces/category'

type Props = StackScreenProps<PaymentStackParamList, 'PaymentMethodScreen'>;
const PaymentMethodScreen = ({ navigation }: Props) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([])
    const fetchpaymentMethodList = async () => {
        try {
            setLoading(true)
            const axiosInstance = await authAPI();

            const response = await axiosInstance.get(endpoints['payment-method'])
            if (response.status === 200 && response.data) {
                setPaymentMethodList(response.data);
            }
        } catch (error) {
            console.error('Error fetching paymentMethodList:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => { // For 1st mounted
        fetchpaymentMethodList();
    }, []);

    return (
        <>
            {paymentMethodList && paymentMethodList.map(item => {
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => { navigation.navigate('PaymentScreen', { selectedPaymentMethod: item }); }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )
            })}
        </>
    )
}

export default PaymentMethodScreen
