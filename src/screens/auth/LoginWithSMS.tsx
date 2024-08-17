import { Image, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { authAPI, endpoints } from "../../utils/api";
import styles from "../../styles/Auth/styles";
import globalStyles from "../../styles/globalStyles";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"

import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../routers/types';

import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { loginWithGG } from '../../redux/auth/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'LoginWithSMS'>;
const LoginWithSMS = ({ navigation }: Props) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleFieldFocus = (field: String) => {
        if (error && field === 'phone') {
            setError('');
        }
    };

    const navigateSignup = () => {
        navigation.navigate("Signup")
    }
    const navigateLoginpWithPassword = () => {
        navigation.navigate("Login")
    }

    const handleSendOTP = async () => {
        if (/[^0-9]/.test(phone) || !phone) {
            setError("Phone is invalid");
            return;
        } else
            try {
                const api = await authAPI();
                const response = await api.post(endpoints.loginWithSms, { phone: phone });

                if (response.status === 200) {
                    console.log('OTP sent successfully', response.data);
                    navigation.navigate('VerifyOTP');
                } else {
                    console.log('Failed to send OTP', response.data);
                    // alert('Failed to send OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error sending OTP:', error);
                // alert('Error when sending OTP. Please check your network and try again.');
            }
    };

    const dispatch = useDispatch<AppDispatch>()
    const handleLoginWithGoogle = async () => {
        dispatch(loginWithGG());
    }


    return (
        <View style={[globalStyles.container, globalStyles.center]}>
            <View>
                <View style={styles.logoLoginContainer} >
                    <Image
                        source={require("../../assets/images/logo.jpg")}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.loginTextContainer}>
                    <Text style={styles.loginText}>Login</Text>
                </View>
                <View style={styles.wrapInputContainer}>
                    <View style={styles.inputContainer} >
                        <FontAwesome
                            name={"phone"}
                            size={24}
                            color={"#9A9A9A"}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Phone"
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={setPhone}
                            value={phone}
                            onFocus={() => handleFieldFocus('phone')}
                        />
                    </View>
                    <View style={styles.textLinkContainer}>
                        <TouchableOpacity onPress={navigateLoginpWithPassword}>
                            <Text style={styles.loginWithPasswordText}>Login with password</Text>
                        </TouchableOpacity>
                    </View>
                    {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
                    <View style={styles.loginButtonContainer}>
                        <TouchableOpacity onPress={handleSendOTP}>
                            <Text style={styles.loginButtonText}>Send SMS</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textLinkSignupContainer}>
                        <TouchableOpacity onPress={navigateSignup}>
                            <Text>Don't have an account?
                                <Text style={{ color: "#0171d3" }}> Signup</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        marginVertical: 16,
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: "center",
                    }}>
                        <View style={{
                            width: "40%",
                            borderTopWidth: 1,
                            borderTopColor: "#8b8b8b",
                        }}></View>
                        <View style={{ marginHorizontal: 10 }}><Text style={{ color: "#8b8b8b" }}>Or</Text></View>
                        <View style={{
                            width: "40%",
                            borderTopWidth: 1,
                            borderTopColor: "#8b8b8b",
                        }}></View>
                    </View>
                </View>
                <View style={styles.socialMediaContainer}>
                    {/* <Entypo
                        name={"facebook-with-circle"}
                        size={30}
                        color={"blue"}
                        style={styles.socialIcon}
                    />
                    <AntDesign
                        name={"github"}
                        size={30}
                        color={"black"}
                        style={styles.socialIcon}
                    /> */}
                    <TouchableOpacity onPress={handleLoginWithGoogle}>
                        <AntDesign
                            name={"google"}
                            size={30}
                            color={"red"}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
};

export default LoginWithSMS;