import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import api, { authAPI, endpoints } from '../../utils/api'
import { colors } from '../../constants/colors'
import formatCurrency from '../../constants/formatCurrency'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types'
// interfaces
import { ShippingUnit } from '../../interfaces/shipping';
type Props = StackScreenProps<PaymentStackParamList, 'ShippingUnitScreen'>;
const ShippingUnitScreen = ({ navigation }: Props) => {
    // currentDate
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();

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

    const [selectedShippingUnit, setSelectedShippingUnit] = useState<ShippingUnit | null>(null);

    const handleSelectShippingUnit = (shippingUnit: ShippingUnit) => {
        setSelectedShippingUnit(shippingUnit);
    };

    const renderShippingUnit = (shippingUnit: ShippingUnit) => {
        const isChecked = selectedShippingUnit?.id === shippingUnit.id;

        return (
            <TouchableOpacity
                key={shippingUnit.id}
                onPress={() => { handleSelectShippingUnit(shippingUnit) }}
            >
                <View style={styles.container}>
                    {/* left */}
                    <View>
                        <View style={styles.section}>
                            <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>
                                {shippingUnit.name}
                            </Text>
                            <Text style={[styles.textStyle, { marginLeft: 10 }]}>
                                đ{formatCurrency(shippingUnit.fee)}
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <MaterialCommunityIcons
                                name={"truck-fast"}
                                size={24}
                                color={colors.seafoam}
                            />
                            <Text
                                style={[styles.textStyle, { marginLeft: 10, color: colors.seafoam, fontStyle: 'italic' }]}>
                                Receive order from {`${day}`} - {`${day + 5}/${month}/${year}`}
                            </Text>
                        </View>
                    </View>
                    {/* right */}
                    {isChecked &&
                        <MaterialCommunityIcons
                            name={"check"}
                            size={30}
                            color={colors.darkOrange}
                        />}
                </View>
            </TouchableOpacity>
        )
    }

    const handleApplyShippingUnit = () => {
        if (selectedShippingUnit) {
            navigation.navigate('PaymentScreen', { selectedShippingUnit })
        }
    }

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 10, marginBottom: 50, }}>
                    {shippingUnitList.length > 0 && shippingUnitList.map(item => renderShippingUnit(item))}
                </View>
            </ScrollView >
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyShippingUnit}>
                <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
        </>
    )
}

export default ShippingUnitScreen

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
    // renderShippingUnit   
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