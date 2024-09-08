import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import remainDateTime from '../../constants/remainDateTime';
import formatCurrency from '../../constants/formatCurrency';
// interfaces
import { Voucher, Condition } from '../../interfaces/voucher';
import { colors } from '../../constants/colors';

interface VoucherCardProps {
    voucher: Voucher,
    condition: Condition,
    onSaveVoucher: (voucher: Voucher, condition: Condition) => void;
}
const VoucherCard = ({ voucher, condition, onSaveVoucher }: VoucherCardProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.topSection}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{voucher?.name}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>ECOMMERCE {voucher?.voucher_type_name.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.middleSection}>
                <Text style={styles.limitedText}>Limited quantity</Text>
                {condition ?
                    <Text style={styles.discountText}>
                        Discount: {formatCurrency(condition.discount)}đ
                    </Text> : null}
                {condition ?
                    <Text style={styles.orderText}>
                        Min order: {formatCurrency(condition.min_order_amount)}đ
                    </Text> : null}
                <Text style={styles.videoText}>{voucher?.voucher_type_name}</Text>
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.useLaterButton}
                    onPress={() => { onSaveVoucher(voucher, condition) }}
                >
                    <Text
                        style={styles.useLaterText}
                    >
                        Save
                    </Text>
                </TouchableOpacity>
                <View style={styles.expirationContainer}>
                    {
                        remainDateTime(voucher?.start_date) !== "Time has passed." ?
                            <Text style={styles.expirationText}>
                                {`Valid after ${remainDateTime(voucher?.start_date)}`}
                            </Text> : null
                    }
                    <TouchableOpacity>
                        <Text style={styles.conditionText}>Condition</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
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
        color: colors.blue,
    },
});

export default VoucherCard
