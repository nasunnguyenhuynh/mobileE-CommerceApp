import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
import { colors } from '../../constants/colors'
import formatCurrency from '../../constants/formatCurrency'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
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

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

    const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
        setSelectedPaymentMethod(paymentMethod);
    };

    const paymentMethodImages: any = {
        "Zalo Pay": require("../../assets/images/zalopay-logo.png"),
        "Momo": require("../../assets/images/momo-logo.png"),
        "VNPay": require("../../assets/images/vnpay-logo.png"),
    };

    const getPaymentMethodImage = (name: string) => {
        return paymentMethodImages[name] || require("../../assets/images/loading-img.png");
    };

    //     source = {
    //         require(`../../ assets / images / ${ getPaymentMethodImage(paymentMethod.name)
    // }`)}
    {/* <MaterialCommunityIcons
        name={"credit-card-outline"}
        size={30}
        color={colors.darkOrange}
    /> */}

    const renderPaymentMethod = (paymentMethod: PaymentMethod) => {
        const isChecked = selectedPaymentMethod?.id === paymentMethod.id;

        return (
            <TouchableOpacity
                key={paymentMethod.id}
                onPress={() => { handleSelectPaymentMethod(paymentMethod) }}
            >
                <View style={styles.container}>
                    {/* left */}
                    <View style={styles.section}>
                        <Image
                            source={getPaymentMethodImage(paymentMethod.name)}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={[styles.textStyle, { fontWeight: 'bold', marginLeft: 10 }]}>
                            {paymentMethod.name}
                        </Text>
                    </View>
                    {/* right */}
                    {isChecked &&
                        <MaterialCommunityIcons
                            name={"check"}
                            size={30}
                            color={colors.darkOrange}
                        />
                    }
                </View>
            </TouchableOpacity>
        )
    }

    const handleApplyPaymentMethod = () => {
        if (selectedPaymentMethod) {
            navigation.navigate('PaymentScreen', { selectedPaymentMethod })
        }
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 10, marginBottom: 50, }}>
                    {paymentMethodList.length > 0 && paymentMethodList.map(item => renderPaymentMethod(item))}
                </View>
            </ScrollView >
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyPaymentMethod}>
                <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
        </>
    )
}

export default PaymentMethodScreen

const styles = StyleSheet.create({
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
    },
    // renderPaymentMethod 
    container: {
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomColor: colors.lightGray,
        borderBottomWidth: 0.2
    },
    section: { flexDirection: 'row', alignItems: 'center' },
    textStyle: { fontSize: 16, color: '#000' }
})