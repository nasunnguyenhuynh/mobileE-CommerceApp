import React, { useState } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import formatCurrency from '../../constants/formatCurrency'
import { authAPI } from '../../utils/api'
import { WebView } from 'react-native-webview';
import { colors } from '../../constants/colors'
// navigation
import { StackScreenProps } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../routers/types';

type Props = StackScreenProps<PaymentStackParamList, 'PaymentResultScreen'>;
const PaymentResultScreen = ({ route, navigation }: Props) => {
    const { url } = route.params
    const [paymentResult, setPaymentResult] = useState(false);
    const [vnp_ResponseCode, setVnp_ResponseCode] = useState<string | null>(null);
    const [vnp_TransactionNo, setVnp_TransactionNo] = useState<string | null>(null);
    const [vnp_Amount, setVnp_Amount] = useState<string | null>(null);

    const handleNavigationStateChange = async (navState: any) => {
        const { url: newUrl } = navState;
        console.log('url_State ', newUrl)
        if (newUrl.includes('payment_return')) {

            const axiosInstance = await authAPI();
            const response = await axiosInstance.get(newUrl);
            console.log('response ', response.data)
            // Parse the URL to get the query parameters
            const urlParams = new URLSearchParams(new URL(newUrl).search);
            const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
            const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
            const vnp_Amount = (Number(urlParams.get('vnp_Amount')) / 100).toString();
            console.log('vnp_ResponseCode ', vnp_ResponseCode)
            console.log('vnp_TransactionNo ', vnp_TransactionNo)
            console.log('vnp_Amount ', vnp_Amount)
            setVnp_ResponseCode(vnp_ResponseCode);
            setVnp_TransactionNo(vnp_TransactionNo);
            setVnp_Amount(vnp_Amount);
            setPaymentResult(true);
        }
    };

    if (!url) {
        //console.error('url is undefined');
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>url is missing</Text>
            </View>
        );
    }

    return (
        paymentResult ?
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ position: "absolute", top: "10%", right: "10%" }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('HomeNavigator', { screen: 'HomeScreen' })
                        }}>
                            <Ionicons name={"home"} size={30}
                                color={colors.blueSky} style={{}} />
                        </TouchableOpacity>
                    </View>
                    {
                        vnp_ResponseCode === "00" ?
                            <>
                                <View style={styles.checkmarkContainer}>
                                    <View style={styles.checkmarkBackground}>
                                        <AntDesign name="checkcircle" size={64} color="green" />
                                    </View>
                                </View>
                                <Text style={styles.successText}>Payment Successful</Text>
                                <Text style={styles.transactionNumber}>Transaction Number: {vnp_TransactionNo}</Text>
                                <Text style={styles.amount}>Amount paid: đ{formatCurrency(Number(vnp_Amount))}</Text>
                            </> :
                            <Text style={styles.failureText}>Payment Failed</Text>
                    }
                </View>
            </View> :
            <View style={{ flex: 1 }}>
                <WebView
                    style={{ marginTop: 28 }}
                    source={{ uri: url }}
                    startInLoadingState={true}
                    onNavigationStateChange={handleNavigationStateChange}
                    renderLoading={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    )}
                />
            </View>
    );
}

export default PaymentResultScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        backgroundColor: '#00BCD4',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkContainer: {
        marginBottom: 20,
    },
    checkmarkBackground: {
        backgroundColor: '#e0f7fa',
        borderRadius: 100,
        padding: 20,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transactionNumber: {
        fontSize: 16,
        marginBottom: 5,
    },
    amount: {
        fontSize: 16,
        marginBottom: 5,
        color: '#009688',
    },
    failureText: {
        fontSize: 16,
        color: 'red',
    },
})