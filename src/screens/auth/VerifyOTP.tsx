import { Image, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { OtpInput } from "react-native-otp-entry";
import styles from "../../styles/Auth/styles";
import globalStyles from '../../styles/globalStyles'

import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../routers/types';
import { useFocusEffect } from '@react-navigation/native';

import type { RootState, AppDispatch } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux'
import { verifyOTP } from '../../redux/auth/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'VerifyOTP'>;
const VerifyOTP = ({ navigation }: Props) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch<AppDispatch>()
    const { status, error: err } = useSelector((state: RootState) => state.auth);
    const handleVerifydOTP = async () => {
        if (otp.length < 6) {
            setError("This field cannot be empty");
            return;
        }
        dispatch(verifyOTP({ otp }));
    };

    useFocusEffect(
        React.useCallback(() => {
            if (status === 'failed') {
                setError(err);
            }
            if (status === 'success') {
                navigation.navigate('HomeNavigator');
            }
        }, [status])
    );

    return (
        <View style={[globalStyles.container, globalStyles.center]}>
            <View style={{ marginHorizontal: 40, marginVertical: 60 }}>
                <View>
                    <View style={styles.logoLoginContainer} >
                        <Image
                            source={require("../../assets/images/logo.jpg")}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.loginTextContainer}>
                        <Text style={styles.loginText}>Verification OTP</Text>
                        <Text>Your verification code will be sent by text message to phone</Text>
                    </View>
                    <View style={styles.wrapInputContainer}>
                        <OtpInput
                            numberOfDigits={6}
                            onTextChange={(text) => {
                                setOtp(text);
                                if (text.length === 6) {
                                    setError('');
                                }
                            }}
                            focusColor={"#232836"}
                            focusStickBlinkingDuration={400}
                            theme={{
                                pinCodeContainerStyle: {
                                    backgroundColor: "#ffffff",
                                    borderRadius: 12
                                }
                            }}></OtpInput>
                        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
                        <View style={styles.loginButtonContainer}>
                            <TouchableOpacity onPress={handleVerifydOTP}>
                                <Text style={styles.loginButtonText}>Send OTP</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textLinkSignupContainer}>
                        </View>
                    </View>
                </View>

            </View>
        </View >
    );
};

export default VerifyOTP;