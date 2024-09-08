import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types'
// interfaces
import { ShippingUnit } from '../../interfaces/shipping';

type Props = StackScreenProps<PaymentStackParamList, 'ShippingUnitScreen'>;
const ShippingUnitScreen = ({ navigation }: Props) => {
    const [loading, setLoading] = useState(false);
    const [shippingUnitList, setShippingUnitList] = useState<ShippingUnit[]>([])
    const fetchShippingUnitList = async () => {
        try {
            setLoading(true)
            const axiosInstance = await authAPI();

            const response = await axiosInstance.get(endpoints['shipping-unit'])
            if (response.status === 200 && response.data) {
                setShippingUnitList(response.data);
            }
        } catch (error) {
            console.error('Error fetching ShippingUnitList:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => { // For 1st mounted
        fetchShippingUnitList();
    }, []);

    return (
        <>
            {shippingUnitList && shippingUnitList.map(item => {
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => { navigation.navigate('PaymentScreen', { selectedShippingUnit: item }) }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )
            })}
        </>
    )
}

export default ShippingUnitScreen
